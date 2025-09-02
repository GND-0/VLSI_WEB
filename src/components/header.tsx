// src/components/header.tsx
"use client";
import localFont from 'next/font/local';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const customFont = localFont({
  src: 'f1.ttf',
  display: 'swap',
});

// User Profile Section Component
function UserProfileSection({ user, logout }: { user: any, logout: () => Promise<void> }) {
  const [currentText, setCurrentText] = useState('Welcome back!');
  const [showProfile, setShowProfile] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // First transition: Welcome back! -> View Profile (after 2 seconds)
    const timer1 = setTimeout(() => {
      setCurrentText('View Profile');
      
      // Second transition: Show profile picture (after 1 second)
      const timer2 = setTimeout(() => {
        setShowProfile(true);
      }, 1000);

      return () => clearTimeout(timer2);
    }, 2000);

    return () => clearTimeout(timer1);
  }, []);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const profileColors = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-teal-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500'
  ];

  const userColorIndex = user?.name ? user.name.length % profileColors.length : 0;

  return (
    <div className="flex items-center space-x-3">
      {/* Animated Text */}
      <div className="relative h-6 overflow-hidden">
        <div 
          className={`text-gray-300 text-sm transition-transform duration-700 ease-in-out ${
            currentText === 'View Profile' ? '-translate-y-6' : 'translate-y-0'
          }`}
        >
          <div className="h-6 flex items-center">Welcome back!</div>
          <div className="h-6 flex items-center">View Profile</div>
        </div>
      </div>

      {/* Profile Picture with Animation */}
      <div className="relative">
        <Link href="/manage-profile">
          <div 
            className={`relative transition-all duration-500 ease-out transform ${
              showProfile 
                ? 'w-10 h-10 opacity-100 scale-100 rotate-0' 
                : 'w-0 h-10 opacity-0 scale-0 rotate-180'
            }`}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${profileColors[userColorIndex]} flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 ring-2 ring-white/20 hover:ring-white/40`}>
              {getInitials(user?.name || user?.email)}
            </div>
            
            {/* Pulsing Ring Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 animate-ping opacity-20"></div>
          </div>
        </Link>

        {/* Tooltip */}
        <div 
          className={`absolute top-12 right-0 z-30 transition-all duration-300 transform ${
            showTooltip 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
          }`}
        >
          <div className="bg-black/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-xl border border-gray-600 whitespace-nowrap">
            <div className="text-sm font-medium">{user?.name || user?.email || 'User'}</div>
            <div className="text-xs text-gray-300">Click to manage account</div>
            {/* Tooltip Arrow */}
            <div className="absolute -top-1 right-4 w-2 h-2 bg-black/90 border-l border-t border-gray-600 transform rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button 
        onClick={logout} 
        className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
      >
        <span className="relative z-10">Logout</span>
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
    </div>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'Resources', href: '/resources' },
    { name: 'Register', href: '/register' },
    { name: 'About', href: '/about' },
  ];

  const profileColors = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-teal-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500'
  ];

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className={`w-full bg-black/80 backdrop-blur-sm fixed top-0 z-20 ${customFont.className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Club Name */}
          <Link href="/" className="flex items-center space-x-2 matrix-container-header">
            <Image
              src="/logo.png" // Ensure this path is correct in your public/ directory
              alt="GND_0 VLSI Club Logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain rounded-full"
            />
            <span 
              className="text-white text-lg sm:text-xl font-bold tracking-tight matrix-text-header transition-all duration-300"
              data-text="GND_0 VLSI Club"
            >
              GND_0 VLSI CLUB
            </span>
            {/* Matrix rain effect - only visible on hover */}
            <div className="matrix-rain-header"></div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-gray-300 text-base font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Auth Buttons Container */}
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-600">
              {user ? (
                <UserProfileSection user={user} logout={logout} />
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    href="/login" 
                    className="group relative text-white hover:text-blue-300 px-4 py-2.5 rounded-lg border border-transparent hover:border-blue-400/30 font-medium transition-all duration-300 hover:bg-blue-500/10"
                  >
                    <span className="relative z-10">Login</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300"></div>
                  </Link>
                  <Link 
                    href="/signup" 
                    className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                  >
                    <span className="relative z-10">Sign Up</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none hover:bg-white/10 p-2 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-700 bg-black/90 backdrop-blur-sm">
            <nav className="flex flex-col space-y-1 px-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-blue-300 hover:bg-white/5 px-3 py-2.5 rounded-lg text-base font-medium transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Auth Section */}
              <div className="border-t border-gray-700 pt-4 mt-4">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 px-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${profileColors[user?.name ? user.name.length % profileColors.length : 0]} flex items-center justify-center text-white font-bold text-xs`}>
                        {getInitials(user?.name || user?.email)}
                      </div>
                      <div className="text-gray-300 text-sm">{user?.name || user?.email || 'User'}</div>
                    </div>
                    <Link 
                      href="/manage-profile"
                      className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Manage Account
                    </Link>
                    <button 
                      onClick={() => { logout(); setIsMenuOpen(false); }} 
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link 
                      href="/login" 
                      className="block w-full text-center text-white hover:text-blue-300 border border-blue-400/30 hover:border-blue-400/50 hover:bg-blue-500/10 px-4 py-3 rounded-lg font-medium transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      href="/signup" 
                      className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}