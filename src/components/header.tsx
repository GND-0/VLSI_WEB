// src/components/header.tsx
"use client";
import localFont from 'next/font/local';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, MenuItem, HoveredLink } from './ui/navbar-menu';

const customFont = localFont({
  src: 'f1.ttf',
  display: 'swap',
});

// User Profile Section Component
function UserProfileSection({ user, logout }: { user: any, logout: () => Promise<void> }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const profileColors = [
    'from-teal-500 to-teal-600',
    'from-teal-600 to-cyan-500',
    'from-cyan-500 to-teal-500',
    'from-teal-400 to-teal-600',
    'from-cyan-600 to-teal-500'
  ];

  const userColorIndex = user?.name ? user.name.length % profileColors.length : 0;

  return (
    <div className="flex items-center gap-3">
      {/* Profile Picture */}
      <div className="relative">
        <Link href="/manage-profile">
          <div 
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div className={`w-9 h-9 rounded-full bg-linear-to-br ${profileColors[userColorIndex]} flex items-center justify-center text-white font-semibold text-sm cursor-pointer transition-transform duration-200 hover:scale-105 ring-2 ring-white/20`}>
              {getInitials(user?.name || user?.email)}
            </div>
          </div>
        </Link>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute top-12 right-0 z-30">
            <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl border border-gray-700 whitespace-nowrap">
              <div className="text-sm font-medium">{user?.name || user?.email || 'User'}</div>
              <div className="text-xs text-gray-400">View profile</div>
            </div>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <button 
        onClick={logout} 
        className="relative overflow-hidden bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border border-gray-700 hover:border-teal-600/50 shadow-lg"
      >
        <span className="relative z-10">Logout</span>
      </button>
    </div>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'Resources', href: '/resources' },
    { name: 'About', href: '/about' },
  ];

  const profileColors = [
    'from-teal-500 to-teal-600',
    'from-teal-600 to-cyan-500',
    'from-cyan-500 to-teal-500',
    'from-teal-400 to-teal-600',
    'from-cyan-600 to-teal-500'
  ];

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${customFont.className}`}>
      <div className={`flex items-center gap-8 px-6 py-3 rounded-full border transition-all duration-500 ${
        scrolled 
          ? 'bg-black/80 backdrop-blur-xl border-gray-700/50 shadow-xl shadow-black/30' 
          : 'bg-black/60 backdrop-blur-md border-gray-800/30'
      }`}>
        {/* Logo and Club Name */}
        <Link href="/" className="flex items-center gap-2 group transition-all duration-300">
          <Image
            src="/logo.png"
            alt="GND_0 VLSI Club Logo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain rounded-lg transition-transform duration-300 group-hover:scale-110"
          />
          <span className="text-base font-bold tracking-tight text-white group-hover:text-teal-300 transition-all duration-300 hidden sm:block">
            GND_0 VLSI CLUB
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <Menu setActive={setActive}>
            <Link href="/" className="text-gray-300 hover:text-white font-medium text-sm transition-colors duration-200 px-3 py-2">
              Home
            </Link>
            
            <MenuItem setActive={setActive} active={active} item="Club">
              <div className="flex flex-col space-y-3 text-sm min-w-50">
                <HoveredLink href="/about">About Us</HoveredLink>
                <HoveredLink href="/events">Events</HoveredLink>
                <HoveredLink href="/club-projects">Club Projects</HoveredLink>
                <HoveredLink href="/vlsiPulse">VLSI Pulse</HoveredLink>
              </div>
            </MenuItem>
            
            <MenuItem setActive={setActive} active={active} item="Resources">
              <div className="flex flex-col space-y-3 text-sm min-w-50">
                <HoveredLink href="/resources">Hardware Resources</HoveredLink>
                <HoveredLink href="/dashboard">Dashboard</HoveredLink>
              </div>
            </MenuItem>
          </Menu>
        </div>
        
        {/* Auth Buttons */}
        <div className="flex items-center gap-2">
          {user ? (
            <UserProfileSection user={user} logout={logout} />
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                href="/login" 
                className="text-gray-300 hover:text-white px-3 py-1.5 text-sm font-medium transition-colors duration-200"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 bg-black/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 shadow-xl">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white hover:bg-white/5 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Auth Section */}
            <div className="border-t border-gray-800 pt-3 mt-3">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4">
                    <div className={`w-8 h-8 rounded-full bg-linear-to-br ${profileColors[user?.name ? user.name.length % profileColors.length : 0]} flex items-center justify-center text-white font-semibold text-xs`}>
                      {getInitials(user?.name || user?.email)}
                    </div>
                    <span className="text-gray-300 text-sm">{user?.name || user?.email || 'User'}</span>
                  </div>
                  <Link 
                    href="/manage-profile"
                    className="block w-full text-center bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Manage Account
                  </Link>
                  <button 
                    onClick={() => { logout(); setIsMenuOpen(false); }} 
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link 
                    href="/login" 
                    className="flex-1 text-center text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    className="flex-1 text-center bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
    </header>
  );
}