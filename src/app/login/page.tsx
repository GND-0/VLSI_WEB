"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import GoogleAuthButton from "../../components/GoogleAuthButton";
import Link from "next/link";
import { createOrUpdateUserDoc } from "../../../lib/userUtils";
import { Eye, EyeOff } from "lucide-react";

type AuthMode = 'login' | 'signup';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
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
      if (user && isValidDomain(user.email || '')) {
        if (mode === 'login' && user.emailVerified) {
          router.push("/dashboard");
        } else if (mode === 'signup' && user.emailVerified) {
          router.push("/dashboard");
        }
      }
    });
    return () => unsubscribe();
  }, [router, mode]);

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
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please try again.';
      case 'auth/email-already-in-use':
        return 'This email is already registered. Try logging in.';
      case 'auth/invalid-email':
        return 'Invalid email format. Please check your email.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use a stronger password.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Contact support.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
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

    if (!isValidDomain(email)) {
      setError("Please use your college email (@iiitdwd.ac.in)");
      setLoading(false);
      setLoginAttempts(loginAttempts + 1);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        setError("Please verify your email before logging in.");
        await signOut(auth);
        setLoading(false);
        return;
      }
      await createOrUpdateUserDoc(userCredential.user);
      router.push("/dashboard");
    } catch (err: any) {
      setLoginAttempts(loginAttempts + 1);
      setError(getFriendlyErrorMessage(err.code || err.message));
    } finally {
      setLoading(false);
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
      
      if (mode === 'login' && !userCredential.user.emailVerified) {
        setError("Please verify your email before logging in.");
        await signOut(auth);
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

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4 relative overflow-hidden">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 [background-size:20px_20px] [background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]" />
      <div className="pointer-events-none absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gray-900/90 backdrop-blur-xl p-8 rounded-2xl border border-gray-800 shadow-2xl shadow-teal-900/10 w-full max-w-md relative z-10"
      >
        {/* Tab Switcher */}
        <div className="flex gap-2 mb-8 bg-gray-800/50 p-1 rounded-xl">
          <button
            onClick={() => switchMode('login')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
              mode === 'login'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => switchMode('signup')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
              mode === 'signup'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-center mb-6 text-teal-400 tracking-tight">
              {mode === 'login' ? 'Welcome Back' : 'Join Us Today'}
            </h2>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm text-center">
                {error}
              </div>
            )}
            
            {loading && (
              <div className="flex justify-center mb-6">
                <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            
            <form onSubmit={mode === 'login' ? handleLogin : handleSignUp} className="space-y-4">
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors text-sm"
                    required
                  />
                </motion.div>
              )}
              
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="College Mail ID (e.g., username@iiitdwd.ac.in)"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors text-sm"
                  required
                />
              </div>
              
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors text-sm pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors text-sm pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Password must be 8+ characters, with uppercase, lowercase, digit, and special character.
                  </p>
                  <div className="flex items-center text-sm text-gray-400">
                    <input
                      type="checkbox"
                      required
                      className="mr-2 accent-teal-500"
                      id="privacy-checkbox"
                    />
                    <label htmlFor="privacy-checkbox">
                      I agree to the <Link href="/privacy" className="text-teal-400 hover:text-teal-300 transition-colors">Privacy Policy</Link>
                    </label>
                  </div>
                </motion.div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-500 text-white py-3 rounded-lg font-medium transition-all disabled:opacity-50 text-sm"
              >
                {mode === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            </form>
            
            <div className="mt-6">
              <GoogleAuthButton onClick={handleGoogleSignIn} disabled={loading} />
            </div>
            
            {mode === 'login' && (
              <div className="mt-6 text-center text-sm text-gray-400">
                <Link href="/forgot-password" className="block hover:text-teal-400 transition-colors">
                  Forgot Password?
                </Link>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}