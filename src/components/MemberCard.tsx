import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Linkedin } from 'lucide-react';

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

export default function MemberCard({
  name,
  position,
  imageSrc,
  linkedin,
}: MemberCardProps) {
  return (
    <div className={`flex flex-col items-center text-center ${inter.className}`}>
      <img
        src={imageSrc}
        alt={`${name}'s profile`}
        className="h-48 w-48 object-cover rounded-lg"
      />
      <h3 className="mt-4 text-lg font-semibold text-white">{name}</h3>
      <p className="text-gray-300">{position}</p>
      <div className="mt-2">
        <Link
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 hover:text-white transition-colors flex items-center"
        >
          <Linkedin className="h-5 w-5 inline-block" />
        </Link>
      </div>
    </div>
  );
}