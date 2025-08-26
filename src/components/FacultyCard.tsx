// src/components/FacultyCard.tsx
import { Inter } from "next/font/google";
import Link from "next/link";
import { Linkedin } from "lucide-react";
import Image from "next/image";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

interface FacultyCardProps {
  name: string;
  position: string;
  imageSrc: string;
  linkedin: string;
}

export default function FacultyCard({ name, position, imageSrc, linkedin }: FacultyCardProps) {
  return (
    <div className={`flex flex-col items-center text-center p-4 bg-black/40 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${inter.className}`}>
      <div className="relative group overflow-hidden">
        <Image
          src={imageSrc || "/placeholder.png"}
          alt={`${name}'s profile`}
          width={240}
          height={240}
          className="w-60 h-60 object-cover rounded-lg shadow-inner transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
          <Link href={linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-700/80 rounded-full hover:bg-gray-800 transition-colors">
            <Linkedin className="h-6 w-6 text-white" />
          </Link>
        </div>
      </div>
      <h3 className="mt-4 text-xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text">{name}</h3>
      <p className="text-gray-400 text-sm font-medium mt-1">{position}</p>
    </div>
  );
}