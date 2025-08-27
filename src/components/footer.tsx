import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Linkedin, Github, Instagram } from 'lucide-react';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
});

export default function Footer() {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'Resources', href: '/resources' },
    { name: 'Register', href: '/register' },
    { name: 'About', href: '/about' },
    { name: 'VLSI PULSE', href: '/vlsiPulse' },
  ];

  const socialLinks = [
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/gnd-0-vlsi-club-iiit-dharwad/', icon: <Linkedin className="h-5 w-5 inline-block mr-2" /> },
    { name: 'GitHub', href: 'https://github.com/GND-0', icon: <Github className="h-5 w-5 inline-block mr-2" /> },
    { name: 'Instagram', href: 'https://www.instagram.com/ground0vlsi.iiitdwd?igsh=ZDk4emQ1Y3F2aGVm', icon: <Instagram className="h-5 w-5 inline-block mr-2" /> },
  ];

  return (
    <footer className={`w-full bg-black/80 backdrop-blur-sm text-white py-8 ${inter.className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-300 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* License */}
          <div>
            <h3 className="text-lg font-semibold mb-4">License</h3>
            <p className="text-gray-300">All rights reserved &copy; GND_0 VLSI Club IIIT Dharwad 2025</p>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow GND_0 VLSI Club IIIT Dharwad</h3>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors flex items-center"
                  >
                    {link.icon}
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}