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
    <div className={`group flex flex-col items-center text-center p-6 bg-slate-900/85 backdrop-blur-xl rounded-xl border border-gray-700/30 hover:border-teal-500/40 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-teal-500/10 ${inter.className}`}>
      <div className="relative overflow-hidden rounded-xl">
        <Image
          src={imageSrc || "/placeholder.png"}
          alt={`${name}'s profile`}
          width={200}
          height={200}
          className="w-48 h-48 object-cover rounded-xl border border-gray-700/50 transition-all duration-500 group-hover:scale-[1.08] group-hover:border-teal-500/30 group-hover:shadow-lg group-hover:shadow-teal-500/20"
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 rounded-xl">
          <Link href={linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-teal-600 hover:bg-teal-500 rounded-lg transition-all duration-300 shadow-lg shadow-teal-600/30 hover:shadow-teal-600/50 hover:-translate-y-0.5">
            <Linkedin className="h-5 w-5 text-white" />
          </Link>
        </div>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{name}</h3>
      <p className="text-gray-400 text-sm mt-1">{position}</p>
    </div>
  );
}