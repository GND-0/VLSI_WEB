import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebase";

// Note: Nodemailer logic has been moved to /api/send-reset-email/route.ts for security.
// This function is retained for potential client-side Firebase-only reset email triggers.

export async function triggerPasswordReset(
  email: string,
  isValidDomain: (email: string) => boolean
): Promise<{ success: boolean; message: string }> {
  if (!isValidDomain(email)) {
    return {
      success: false,
      message: "Please use your college email (@iiitdwd.ac.in)",
    };
  }

  if (!navigator.onLine) {
    return {
      success: false,
      message:
        "No internet connection. Please check your network and try again.",
    };
  }

  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: "Password reset email sent! Check your inbox.",
    };
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
    return {
      success: false,
      message: getFriendlyErrorMessage(error.code || error.message),
    };
  }
}
