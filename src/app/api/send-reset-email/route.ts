import { NextResponse } from "next/server";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../../lib/firebase";
import nodemailer from 'nodemailer';

// Server-side environment variables
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.endsWith('@iiitdwd.ac.in')) {
      return NextResponse.json({ success: false, message: "Please use your college email (@iiitdwd.ac.in)" }, { status: 400 });
    }

    // Check if Firebase auth is initialized
    if (!auth) {
      console.error('Firebase auth not initialized');
      return NextResponse.json({ success: false, message: "Server configuration error. Contact support." }, { status: 500 });
    }

    // Trigger Firebase password reset email
    await sendPasswordResetEmail(auth, email);

    // Optional: Send custom-styled email via Nodemailer
    let customEmailSent = false;
    if (EMAIL_USER && EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
          },
        });

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

        await transporter.sendMail(mailOptions);
        console.log(`Custom password reset email sent to ${email}`);
        customEmailSent = true;
      } catch (nodemailerError: unknown) {
        const errorMessage = nodemailerError instanceof Error ? nodemailerError.message : 'Unknown Nodemailer error';
        console.error(`Nodemailer error: ${errorMessage}`);
        // Continue even if custom email fails, as Firebase email was sent
      }
    } else {
      console.warn('Nodemailer skipped: EMAIL_USER or EMAIL_PASS missing');
    }

    return NextResponse.json(
      { success: true, message: "Password reset email sent! Check your inbox." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error in send-reset-email: ${error.message || 'Unknown error'}`);
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