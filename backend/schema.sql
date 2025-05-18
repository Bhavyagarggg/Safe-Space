-- Supabase Schema for Safe Space

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  security_key TEXT NOT NULL,
  failed_attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Files Table
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_type TEXT NOT NULL CHECK (file_type IN ('documents', 'photos', 'videos', 'notes')),
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  is_fake BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Storage Buckets
-- Note: This would be done through the Supabase dashboard or API
-- CREATE BUCKET documents;
-- CREATE BUCKET photos;
-- CREATE BUCKET videos;
-- CREATE BUCKET notes;

-- Row Level Security Policies

-- Users Table RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Files Table RLS
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own files" ON files
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own files" ON files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own files" ON files
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files" ON files
  FOR DELETE USING (auth.uid() = user_id);

-- Storage Bucket Policies
-- These would be configured through the Supabase dashboard
-- Example policy for documents bucket:
-- CREATE POLICY "Users can upload their own documents" ON storage.objects
--   FOR INSERT WITH CHECK (auth.uid() = owner);
