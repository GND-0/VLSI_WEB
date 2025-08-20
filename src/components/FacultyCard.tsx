import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Linkedin } from 'lucide-react';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
});

interface FacultyCardProps {
  name: string;
  position: string;
  imageSrc: string;
  linkedinUrl: string;
}

export default function FacultyCard({ name, position, imageSrc, linkedinUrl }: FacultyCardProps) {
  return (
    <div className={`flex flex-col items-center text-center ${inter.className}`}>
      <Link href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="group relative">
        <img
          src={imageSrc}
          alt={`${name}'s profile`}
          className="h-48 w-48 object-cover rounded-lg transition-all duration-300 group-hover:brightness-75"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-full group-hover:translate-y-0 flex items-center justify-center">
          <Linkedin className="h-8 w-8 text-white" />
        </div>
      </Link>
      <h3 className="mt-4 text-lg font-semibold text-white">{name}</h3>
      <p className="text-gray-300">{position}</p>
    </div>
  );
}