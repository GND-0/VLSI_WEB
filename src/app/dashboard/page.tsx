'use client';

import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Analytics } from "@vercel/analytics/next"
import Header from '../../components/header';
import Footer from '../../components/footer';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 [background-size:20px_20px] [background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        />
        <div className="pointer-events-none absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Grid Background Pattern */}
      <div
        className="absolute inset-0 [background-size:20px_20px] [background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
      />
      <div className="pointer-events-none absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <Header />
      <main className="grow flex items-center justify-center p-8 mt-16 relative z-10">
        <div className="max-w-md w-full bg-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-800 p-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-teal-400">
            Welcome back!
          </h1>
          <p className="text-gray-400 mb-2">{user?.email}</p>
          <p className="text-gray-500 text-sm">Manage your events and profile here.</p>
        </div>
      </main>
      <Footer />
      <Analytics />
    </div>
  );
}