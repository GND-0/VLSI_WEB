// src/components/MemberCard.tsx
import { Inter } from "next/font/google";
import Link from "next/link";
import { Linkedin } from "lucide-react";
import Image from "next/image";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

interface MemberCardProps {
  name: string;
  position: string;
  imageSrc: string;
  linkedin: string;
  className?: string;
}

export default function MemberCard({ name, position, imageSrc, linkedin, className }: MemberCardProps) {
  return (
    <div className={`group flex flex-col items-center text-center p-6 bg-gray-900/90 backdrop-blur-xl rounded-xl border border-gray-800 transition-all duration-500 hover:border-teal-600/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-900/20 ${inter.className} ${className || ""}`}>
      <div className="relative overflow-hidden">
        <Image
          src={imageSrc || "/placeholder.png"}
          alt={`${name}'s profile`}
          width={200}
          height={200}
          unoptimized={true}
          className="w-48 h-48 object-cover rounded-xl border border-gray-700 transition-all duration-500 group-hover:scale-105 group-hover:border-teal-600/30"
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 rounded-xl">
          <Link 
            href={linkedin} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-2.5 bg-teal-600 hover:bg-teal-500 rounded-lg transition-all duration-300 shadow-lg shadow-teal-900/30"
          >
            <Linkedin className="h-5 w-5 text-white" />
          </Link>
        </div>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{name}</h3>
      <p className="text-gray-400 text-sm mt-1">{position}</p>
    </div>
  );
}