// src/components/AlumniCard.tsx
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Linkedin } from 'lucide-react';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
});

interface AlumniCardProps {
  name: string;
  position: string;
  placed_at: string;
  imageSrc: string;
  linkedin: string;
}

export default function AlumniCard({ name, position, placed_at, imageSrc, linkedin }: AlumniCardProps) {
  return (
    <div className={`flex flex-col items-center text-center animate-fade-in ${inter.className}`}>
      <div className="relative group">
        <img
          src={imageSrc || '/placeholder.png'}
          alt={`${name}'s profile`}
          className="h-48 w-48 rounded-full object-cover border-2 border-green-300 shadow-lg transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gray-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-full">
          <Link href={linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-6 w-6 text-white" />
          </Link>
        </div>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-white">{name}</h3>
      <p className="text-blue-300 text-sm">{placed_at}</p>
      <p className="text-gray-400 text-sm mt-1">{position}</p>
    </div>
  );
}