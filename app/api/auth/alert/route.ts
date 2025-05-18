import { NextResponse } from "next/server"

// Mock email sending function that doesn't rely on nodemailer
async function sendAlertEmail(email: string) {
  console.log(`[MOCK EMAIL] Sending security alert to: ${email}`)
  console.log(`[MOCK EMAIL] Subject: ALERT: Unauthorized Access Attempt`)
  console.log(`[MOCK EMAIL] Content: Someone tried to log into your Safe Space account and failed 3 times.`)

  // In a real production environment, you would use a service like:
  // - SendGrid API
  // - Mailchimp API
  // - AWS SES
  // - Or other email service APIs that work in serverless environments

  // For now, we'll simulate a successful email send
  return true
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Log the alert attempt
    console.log(`Security alert triggered for email: ${email}`)

    // Use our mock function instead of nodemailer
    await sendAlertEmail(email)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing alert:", error)
    return NextResponse.json({ success: false, error: "Failed to process alert" }, { status: 500 })
  }
}
