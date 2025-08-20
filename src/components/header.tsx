"use client";
import localFont from 'next/font/local';
import Link from 'next/link';
import { useState } from 'react';

// Load the custom font
const customFont = localFont({
  src: 'f1.ttf', // Replace with your .ttf file name, e.g., '/MyCustomFont.ttf'
  display: 'swap',
});

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <img
              src="logo.png" // Replace with your logo file name, e.g., '/images/logo.png'
              alt="GND_0 VLSI Club Logo"
              className="h-10 w-10 object-contain rounded-full"
            />
            <span 
              className="text-white text-lg sm:text-xl font-bold tracking-tight matrix-text-header transition-all duration-300"
              data-text="GND_0 VLSI Club"
            >
              GND_0 VLSI Club
            </span>
            {/* Matrix rain effect - only visible on hover */}
            <div className="matrix-rain-header"></div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-gray-300 text-base font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
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
          <nav className="md:hidden flex flex-col space-y-2 px-4 pb-4">
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
          </nav>
        )}
      </div>
    </header>
  );
}