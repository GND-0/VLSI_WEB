import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Linkedin, Github, Instagram, MapPin, Phone, ArrowUp } from 'lucide-react';
import Image from 'next/image';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
});

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'Resources', href: '/resources' },
    { name: 'About', href: '/about' },
  ];

  const resources = [
    { name: 'VLSI PULSE', href: '/vlsiPulse' },
    { name: 'Club Projects', href: '/club-projects' },
    { name: 'Dashboard', href: '/dashboard' },
  ];

  const connect = [
    { name: 'Login', href: '/login' },
    { name: 'Sign Up', href: '/signup' },
    { name: 'Manage Profile', href: '/manage-profile' },
  ];

  const socialLinks = [
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/gnd-0-vlsi-club-iiit-dharwad/', icon: Linkedin },
    { name: 'GitHub', href: 'https://github.com/GND-0', icon: Github },
    { name: 'Instagram', href: 'https://www.instagram.com/ground0vlsi.iiitdwd?igsh=ZDk4emQ1Y3F2aGVm', icon: Instagram },
  ];

  return (
    <footer className={`relative w-full ${inter.className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Divider */}
        <div className="w-full h-px bg-linear-to-r from-transparent via-gray-700 to-transparent mb-12" />
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo and Contact Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">GND_0</h2>
              <p className="text-sm text-gray-400">VLSI Club</p>
            </div>
            
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 shrink-0" />
                <p>IIIT Dharwad Campus, Ittigatti Road, Near Sattur Colony, Dharwad 580009</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0" />
                <div>
                  <p>Contact Club</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">FOLLOW US</h3>
              <div className="flex gap-3">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-md bg-gray-800/50 hover:bg-gray-700/70 border border-gray-700/50 hover:border-gray-600/50 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                      aria-label={link.name}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">NAVIGATION</h3>
            <ul className="space-y-2">
              {navigation.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-300 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">RESOURCES</h3>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-300 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">CONNECT</h3>
            <ul className="space-y-2">
              {connect.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-300 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 pt-6">
          <div className="w-full h-px bg-linear-to-r from-transparent via-gray-700 to-transparent mb-6" />
          <p className="text-center text-gray-500 text-xs">
            All rights reserved © GND_0 VLSI Club IIIT Dharwad 2025 | Built with ❤️ by the GND_0 Team
          </p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-teal-600/90 hover:bg-teal-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 z-50"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
}