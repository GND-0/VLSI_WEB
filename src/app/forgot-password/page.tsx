"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Session management
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && isValidDomain(user.email || '') && user.emailVerified) {
        router.push("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const isValidDomain = (email: string) => {
    return email.endsWith('@iiitdwd.ac.in');
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!navigator.onLine) {
      setError("No internet connection. Please check your network and try again.");
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      setLoading(false);
      return;
    }

    if (!isValidDomain(email)) {
      setError("Please use your college email (@iiitdwd.ac.in)");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/send-reset-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setSuccess(result.message);
      } else {
        throw new Error(result.message || 'Failed to send reset email.');
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black relative overflow-hidden">
      {/* Grid Background Pattern */}
      <div
        className="absolute inset-0 [background-size:20px_20px] [background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
      />
      <div className="pointer-events-none absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <div
        className="bg-gray-900/90 backdrop-blur-xl p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-800 relative z-10"
        role="dialog"
        aria-labelledby="forgot-password-title"
      >
        <h2
          id="forgot-password-title"
          className="text-3xl font-bold text-center mb-6 text-teal-400"
        >
          Reset Password
        </h2>
        {error && (
          <p
            className="text-red-400 text-center mb-4 text-sm"
            role="alert"
            id="reset-error"
          >
            {error}
          </p>
        )}
        {success && (
          <p
            className="text-green-400 text-center mb-4 text-sm"
            role="status"
            id="reset-success"
          >
            {success}
          </p>
        )}
        {loading && (
          <div className="flex justify-center mb-4">
            <div
              className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"
              aria-label="Loading"
            />
          </div>
        )}
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="College Mail ID (e.g., username@iiitdwd.ac.in)"
              className="w-full p-3 border border-gray-700/50 rounded-lg bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
              required
              aria-describedby={error ? "reset-error" : success ? "reset-success" : undefined}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white p-3 rounded-lg transition-all disabled:opacity-50 font-medium"
          >
            Send Reset Email
          </button>
        </form>
        <div className="mt-5 text-center text-sm text-gray-400 space-y-2">
          <p>
            Remember your password? <Link href="/login" className="text-teal-400 hover:text-teal-300 transition-colors">Log In</Link>
          </p>
          <p>
            Not a member? <Link href="/signup" className="text-teal-400 hover:text-teal-300 transition-colors">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}