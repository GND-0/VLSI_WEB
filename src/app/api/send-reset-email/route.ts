import { NextResponse } from "next/server";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../../lib/firebase";
import nodemailer from "nodemailer";

// Server-side environment variables (recommended for production)
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.endsWith("@iiitdwd.ac.in")) {
      return NextResponse.json(
        {
          success: false,
          message: "Please use your college email (@iiitdwd.ac.in)",
        },
        { status: 400 }
      );
    }

    if (!EMAIL_USER || !EMAIL_PASS) {
      return NextResponse.json(
        { success: false, message: "Email configuration is missing." },
        { status: 500 }
      );
    }

    // Generate Firebase password reset link
    await sendPasswordResetEmail(auth, email);
    const resetLink = await auth.generatePasswordResetLink(email);

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"IIITDWD Support" <${EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Click the link below to reset it:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; color: #fff; background: linear-gradient(to right, #4f46e5, #7c3aed); text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>If you didn't request a password reset, please ignore this email.</p>
          <p>Best regards,<br/>IIITDWD Support Team</p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      {
        success: true,
        message: "Password reset email sent! Check your inbox.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    const getFriendlyErrorMessage = (errorCode: string) => {
      switch (errorCode) {
        case "auth/invalid-email":
          return "Invalid email format. Please check your email.";
        case "auth/user-not-found":
          return "No account found with this email.";
        case "auth/too-many-requests":
          return "Too many requests. Please try again later.";
        default:
          return "An error occurred. Please try again.";
      }
    };
    return NextResponse.json(
      {
        success: false,
        message: getFriendlyErrorMessage(error.code || error.message),
      },
      { status: 500 }
    );
  }
}
