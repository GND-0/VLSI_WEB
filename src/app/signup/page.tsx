"use client";

import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import GoogleAuthButton from "../../components/GoogleAuthButton";
import Link from "next/link";
import { createOrUpdateUserDoc } from "../../../lib/userUtils";
import { Eye, EyeOff } from "lucide-react";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
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

  const validatePassword = (pwd: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(pwd);
  };

  const validateFullName = (name: string) => {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    return nameRegex.test(name.trim());
  };

  const isValidDomain = (email: string) => {
    return email.endsWith('@iiitdwd.ac.in');
  };

  const getFriendlyErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Try logging in.';
      case 'auth/invalid-email':
        return 'Invalid email format. Please check your email.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use a stronger password.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!navigator.onLine) {
      setError("No internet connection. Please check your network and try again.");
      setLoading(false);
      return;
    }

    if (loginAttempts >= 5) {
      setError("Too many attempts. Please wait 1 minute before trying again.");
      setTimeout(() => setLoginAttempts(0), 60000);
      setLoading(false);
      return;
    }

    if (!validateFullName(fullName)) {
      setError("Full Name must be 2-50 characters long and contain only letters and spaces.");
      setLoading(false);
      setLoginAttempts(loginAttempts + 1);
      return;
    }

    if (!isValidDomain(email)) {
      setError("Please use your college email (@iiitdwd.ac.in)");
      setLoading(false);
      setLoginAttempts(loginAttempts + 1);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      setLoginAttempts(loginAttempts + 1);
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one digit, and one special character.");
      setLoading(false);
      setLoginAttempts(loginAttempts + 1);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      await createOrUpdateUserDoc(userCredential.user, { name: fullName });
      setError("Please verify your email before logging in. A verification email has been sent.");
      await signOut(auth);
    } catch (err: any) {
      setLoginAttempts(loginAttempts + 1);
      setError(getFriendlyErrorMessage(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    if (!navigator.onLine) {
      setError("No internet connection. Please check your network and try again.");
      setLoading(false);
      return;
    }

    const provider = new GoogleAuthProvider();
    provider.addScope("profile email");
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const userCredential = await signInWithPopup(auth, provider);
      if (!isValidDomain(userCredential.user.email || '')) {
        await signOut(auth);
        setError("Please use your college email (@iiitdwd.ac.in)");
        setLoading(false);
        return;
      }
      await createOrUpdateUserDoc(userCredential.user, { name: userCredential.user.displayName || '' });
      router.push("/dashboard");
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err.code || err.message));
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
        className="bg-white/5 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/10 relative z-10 mt-15"
        role="dialog"
        aria-labelledby="signup-title"
      >
        <motion.h2
          id="signup-title"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500"
        >
          Join Us Today
        </motion.h2>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-center mb-4"
            role="alert"
            id="signup-error"
          >
            {error}
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
        <form onSubmit={handleSignUp} className="space-y-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="w-full p-4 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
              aria-describedby={error ? "signup-error" : undefined}
            />
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="College Mail ID (e.g., username@iiitdwd.ac.in)"
              className="w-full p-4 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
              aria-describedby={error ? "signup-error" : undefined}
            />
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-4 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
              aria-describedby={error ? "signup-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="relative"
          >
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full p-4 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
              aria-describedby={error ? "signup-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="text-xs text-gray-400 mt-[-1rem] mb-2"
          >
            Password must be 8+ characters, with uppercase, lowercase, digit, and special character.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center text-sm text-gray-300"
          >
            <input
              type="checkbox"
              required
              className="mr-2 accent-indigo-500"
              id="privacy-checkbox"
            />
            <label htmlFor="privacy-checkbox">
              I agree to the <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</Link>
            </label>
          </motion.div>
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 shadow-lg"
          >
            Sign Up
          </motion.button>
        </form>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-6"
        >
          <GoogleAuthButton onClick={handleGoogleSignIn} disabled={loading} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-4 text-center text-sm text-gray-300"
        >
          Already have an account? <Link href="/login" className="text-indigo-400 hover:text-indigo-300">Log In</Link>
        </motion.div>
      </motion.div>
    </div>
  );
}