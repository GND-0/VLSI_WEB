// src/components/header.tsx
"use client";
import localFont from 'next/font/local';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const customFont = localFont({
  src: 'f1.ttf',
  display: 'swap',
});

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
            {user ? (
              <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                Logout
              </button>
            ) : (
              <div className="flex space-x-4">
                <Link href="/login" className="text-white hover:text-gray-300 text-base font-medium transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
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
          <nav className="md:hidden flex flex-col space-y-4 px-4 pb-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-gray-300 text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <button 
                onClick={() => { logout(); setIsMenuOpen(false); }} 
                className="text-red-500 hover:text-red-400 text-base font-medium transition-colors text-left"
              >
                Logout
              </button>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-white hover:text-gray-300 text-base font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="text-white hover:text-gray-300 text-base font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}