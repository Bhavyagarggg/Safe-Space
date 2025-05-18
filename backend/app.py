from flask import Flask, request, jsonify
import os
import bcrypt
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from flask_cors import CORS
import supabase
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_API_KEY")
supabase_client = supabase.create_client(supabase_url, supabase_key)

# SMTP Configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

# Routes
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone', '')
    password = data.get('password')
    security_key = data.get('securityKey')
    
    # Validate required fields
    if not all([name, email, password, security_key]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400
    
    try:
        # Check if user already exists
        response = supabase_client.table('users').select('*').eq('email', email).execute()
        if response.data:
            return jsonify({"success": False, "message": "User already exists"}), 400
        
        # Hash password and security key
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        security_key_hash = bcrypt.hashpw(security_key.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create user in Supabase
        response = supabase_client.table('users').insert({
            'name': name,
            'email': email,
            'phone': phone,
            'password_hash': password_hash,
            'security_key': security_key_hash,
            'failed_attempts': 0,
            'created_at': datetime.now().isoformat()
        }).execute()
        
        return jsonify({"success": True})
    
    except Exception as e:
        print(f"Error in signup: {e}")
        return jsonify({"success": False, "message": "Server error"}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    security_key = data.get('securityKey', '')
    
    if not all([email, password]):
        return jsonify({"success": False, "message": "Missing email or password"}), 400
    
    try:
        # Get user from Supabase
        response = supabase_client.table('users').select('*').eq('email', email).execute()
        
        if not response.data:
            return jsonify({"success": False, "message": "User not found"}), 404
        
        user = response.data[0]
        
        # Check password
        if bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            # Reset failed attempts
            supabase_client.table('users').update({
                'failed_attempts': 0
            }).eq('id', user['id']).execute()
            
            return jsonify({"success": True})
        
        # Password is wrong, check security key for decoy mode
        if security_key and bcrypt.checkpw(security_key.encode('utf-8'), user['security_key'].encode('utf-8')):
            return jsonify({"success": False, "usedSecurityKey": True})
        
        # Increment failed attempts
        new_attempts = user['failed_attempts'] + 1
        supabase_client.table('users').update({
            'failed_attempts': new_attempts
        }).eq('id', user['id']).execute()
        
        # Send alert email if 3 failed attempts
        if new_attempts >= 3:
            send_alert_email(user['email'])
        
        return jsonify({"success": False, "message": "Invalid credentials"})
    
    except Exception as e:
        print(f"Error in login: {e}")
        return jsonify({"success": False, "message": "Server error"}), 500

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"success": False, "message": "No file part"}), 400
    
    file = request.files['file']
    file_type = request.form.get('fileType')
    is_fake = request.form.get('isDecoy') == 'true'
    user_id = request.form.get('userId')  # In a real app, get this from auth token
    
    if not all([file, file_type, user_id]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400
    
    try:
        # Upload to Supabase Storage
        file_name = f"{datetime.now().timestamp()}_{file.filename}"
        storage_path = f"{file_type}/{file_name}"
        
        # Upload file to Supabase Storage
        response = supabase_client.storage.from_(file_type).upload(
            file_name,
            file.read()
        )
        
        if hasattr(response, 'error') and response.error:
            return jsonify({"success": False, "message": response.error}), 500
        
        # Get public URL
        file_url = supabase_client.storage.from_(file_type).get_public_url(file_name)
        
        # Insert record in files table
        response = supabase_client.table('files').insert({
            'user_id': user_id,
            'file_type': file_type,
            'file_name': file.filename,
            'storage_path': storage_path,
            'is_fake': is_fake
        }).execute()
        
        return jsonify({
            "success": True,
            "file": {
                "id": response.data[0]['id'],
                "name": file.filename,
                "url": file_url,
                "type": file_type,
                "isFolder": False,
                "createdAt": datetime.now().isoformat()
            }
        })
    
    except Exception as e:
        print(f"Error in upload: {e}")
        return jsonify({"success": False, "message": "Server error"}), 500

@app.route('/profile', methods=['GET'])
def get_profile():
    user_id = request.args.get('userId')  # In a real app, get this from auth token
    
    if not user_id:
        return jsonify({"success": False, "message": "User ID required"}), 400
    
    try:
        response = supabase_client.table('users').select('name, email, phone, created_at').eq('id', user_id).execute()
        
        if not response.data:
            return jsonify({"success": False, "message": "User not found"}), 404
        
        return jsonify({"success": True, "profile": response.data[0]})
    
    except Exception as e:
        print(f"Error getting profile: {e}")
        return jsonify({"success": False, "message": "Server error"}), 500

@app.route('/change-password', methods=['POST'])
def change_password():
    data = request.json
    user_id = data.get('userId')  # In a real app, get this from auth token
    current_password = data.get('currentPassword')
    new_password = data.get('newPassword')
    
    if not all([user_id, current_password, new_password]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400
    
    try:
        # Get user from Supabase
        response = supabase_client.table('users').select('password_hash').eq('id', user_id).execute()
        
        if not response.data:
            return jsonify({"success": False, "message": "User not found"}), 404
        
        user = response.data[0]
        
        # Verify current password
        if not bcrypt.checkpw(current_password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            return jsonify({"success": False, "message": "Current password is incorrect"}), 400
        
        # Hash new password
        new_password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Update password in Supabase
        supabase_client.table('users').update({
            'password_hash': new_password_hash
        }).eq('id', user_id).execute()
        
        return jsonify({"success": True})
    
    except Exception as e:
        print(f"Error changing password: {e}")
        return jsonify({"success": False, "message": "Server error"}), 500

@app.route('/export', methods=['GET'])
def export_files():
    user_id = request.args.get('userId')  # In a real app, get this from auth token
    file_type = request.args.get('fileType', 'all')
    is_fake = request.args.get('isDecoy') == 'true'
    
    if not user_id:
        return jsonify({"success": False, "message": "User ID required"}), 400
    
    try:
        query = supabase_client.table('files').select('*').eq('user_id', user_id).eq('is_fake', is_fake)
        
        if file_type != 'all':
            query = query.eq('file_type', file_type)
        
        response = query.execute()
        
        # In a real app, we would generate a zip file and return a download link
        # For this demo, we'll just return the file data
        
        return jsonify({
            "success": True,
            "files": response.data,
            "downloadUrl": f"https://example.com/download/{user_id}_{datetime.now().timestamp()}"
        })
    
    except Exception as e:
        print(f"Error exporting files: {e}")
        return jsonify({"success": False, "message": "Server error"}), 500

# Helper function to send alert email
def send_alert_email(email):
    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_EMAIL
        msg['To'] = email
        msg['Subject'] = "ALERT: Unauthorized Access Attempt"
        
        body = """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e53e3e;">Security Alert</h2>
          <p>Someone tried to log into your Safe Space account and failed 3 times.</p>
          <p>If this wasn't you, we recommend changing your password immediately.</p>
          <p>Time of attempts: {}</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 4px;">
            <p style="margin: 0; color: #718096; font-size: 14px;">
              This is an automated message from Safe Space. Please do not reply to this email.
            </p>
          </div>
        </div>
        """.format(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        
        msg.attach(MIMEText(body, 'html'))
        
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        
        return True
    except Exception as e:
        print(f"Error sending alert email: {e}")
        return False

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.getenv('PORT', 5000)))
