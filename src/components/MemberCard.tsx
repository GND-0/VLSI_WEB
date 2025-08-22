// src/components/MemberCard.tsx
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Linkedin } from 'lucide-react';
import Image from 'next/image';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
});

interface MemberCardProps {
  name: string;
  position: string;
  imageSrc: string;
  linkedin: string;
}

export default function MemberCard({ name, position, imageSrc, linkedin }: MemberCardProps) {
  return (
    <div className={`flex flex-col items-center text-center animate-fade-in ${inter.className}`}>
      <div className="relative group">
        <Image
          src={imageSrc || '/placeholder.png'}
          alt={`${name}'s profile`}
          width={192}
          height={192}
          unoptimized={true}
          className="h-48 w-48 rounded-full object-cover border-2 border-blue-500 shadow-lg transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-full">
          <Link href={linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-6 w-6 text-white" />
          </Link>
        </div>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-white">{name}</h3>
      <p className="text-gray-400 text-sm">{position}</p>
    </div>
  );
}