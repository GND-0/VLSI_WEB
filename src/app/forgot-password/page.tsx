"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
      if (result.success) {
        setSuccess(result.message);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black relative overflow-hidden">
      {/* Background animations */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.2), transparent 50%)",
          willChange: "transform, opacity",
        }}
        animate={{
          scale: [1, 1.03, 1],
          opacity: [0.2, 0.25, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGgyMFYyMEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMCAwVjIwbTAgMEwxMC4xIDBIMTBtMCAwTDEwIDAuMVYweiIgc3Ryb2tlPSIjNEYzNkU5IiBzdHJva2Utb3BhY2l0eT0iMC4xIi8+PC9zdmc+")`,
          opacity: 0.05,
          willChange: "transform",
        }}
        animate={{
          y: ["0%", "-50%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/5 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/10 relative z-10"
        role="dialog"
        aria-labelledby="forgot-password-title"
      >
        <motion.h2
          id="forgot-password-title"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500"
        >
          Reset Password
        </motion.h2>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-center mb-4"
            role="alert"
            id="reset-error"
          >
            {error}
          </motion.p>
        )}
        {success && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-400 text-center mb-4"
            role="status"
            id="reset-success"
          >
            {success}
          </motion.p>
        )}
        {loading && (
          <div className="flex justify-center mb-4">
            <motion.div
              className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              aria-label="Loading"
            />
          </div>
        )}
        <form onSubmit={handlePasswordReset} className="space-y-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="College Mail ID (e.g., username@iiitdwd.ac.in)"
              className="w-full p-4 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
              aria-describedby={error ? "reset-error" : success ? "reset-success" : undefined}
            />
          </motion.div>
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 shadow-lg"
          >
            Send Reset Email
          </motion.button>
        </form>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center text-sm text-gray-300 space-y-2"
        >
          <p>
            Remember your password? <Link href="/login" className="text-indigo-400 hover:text-indigo-300">Log In</Link>
          </p>
          <p>
            Not a member? <Link href="/signup" className="text-indigo-400 hover:text-indigo-300">Sign Up</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}