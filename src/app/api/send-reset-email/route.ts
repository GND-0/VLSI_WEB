import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';
import { auth } from "../../../../lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

// Server-side environment variables
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.endsWith('@iiitdwd.ac.in')) {
      return NextResponse.json({ success: false, message: "Please use your college email (@iiitdwd.ac.in)" }, { status: 400 });
    }

    if (!EMAIL_USER || !EMAIL_PASS) {
      return NextResponse.json({ success: false, message: "Email configuration is missing." }, { status: 500 });
    }

    // Trigger Firebase password reset email (for functionality)
    await sendPasswordResetEmail(auth, email);

    // Create Nodemailer transporter for custom email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    // Generate Firebase password reset link (Note: This requires Firebase client SDK to be compatible)
    // Since client SDK doesn't expose generatePasswordResetLink, we rely on sendPasswordResetEmail for the actual reset functionality
    // The custom email below is for styling purposes only
    const mailOptions = {
      from: `"IIITDWD Support" <${EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; color: #fff; max-width: 600px; margin: auto; padding: 20px; background-color: #000; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;">
          <h2 style="text-align: center; background: linear-gradient(to right, #a5b4fc, #c084fc, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. A password reset email has been sent to you from Firebase Authentication. Please check your inbox (and spam/junk folder) for a link to reset your password.</p>
          <p>If you didn't request a password reset, please ignore this email.</p>
          <p>Best regards,<br/>IIITDWD Support Team</p>
        </div>
      `,
    };

    // Send the custom email
    await transporter.sendMail(mailOptions);
    console.log(`Custom password reset email sent to ${email}`);
    return NextResponse.json({ success: true, message: "Password reset email sent! Check your inbox." }, { status: 200 });
  } catch (error: any) {
    console.error(`Error sending reset email: ${error.message}`);
    const getFriendlyErrorMessage = (errorCode: string) => {
      switch (errorCode) {
        case 'auth/invalid-email':
          return 'Invalid email format. Please check your email.';
        case 'auth/user-not-found':
          return 'No account found with this email.';
        case 'auth/too-many-requests':
          return 'Too many requests. Please try again later.';
        case 'auth/operation-not-allowed':
          return 'Password reset is not enabled. Contact support.';
        default:
          return 'An error occurred. Please try again.';
      }
    };
    return NextResponse.json(
      { success: false, message: getFriendlyErrorMessage(error.code || error.message) },
      { status: 500 }
    );
  }
}