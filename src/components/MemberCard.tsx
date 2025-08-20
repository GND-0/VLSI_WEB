import { Inter } from "next/font/google";
import Link from "next/link";
import { Mail, Linkedin, Github, Instagram, Twitter } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

interface MemberCardProps {
  name: string;
  position: string;
  imageSrc: string;
  gmail?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  twitter?: string;
  placed_at?: string; // Added for Alumni
}

export default function MemberCard({
  name,
  position,
  imageSrc,
  gmail,
  linkedin,
  github,
  instagram,
  twitter,
  placed_at,
}: MemberCardProps) {
  const socialLinks = [
    gmail && {
      name: "Gmail",
      href: `mailto:${gmail}`,
      icon: <Mail className="h-5 w-5 inline-block mr-2" />,
    },
    linkedin && {
      name: "LinkedIn",
      href: linkedin,
      icon: <Linkedin className="h-5 w-5 inline-block mr-2" />,
    },
    github && {
      name: "GitHub",
      href: github,
      icon: <Github className="h-5 w-5 inline-block mr-2" />,
    },
    instagram && {
      name: "Instagram",
      href: instagram,
      icon: <Instagram className="h-5 w-5 inline-block mr-2" />,
    },
    twitter && {
      name: "Twitter",
      href: twitter,
      icon: <Twitter className="h-5 w-5 inline-block mr-2" />,
    },
  ].filter(Boolean);

  return (
    <div
      className={`flex flex-col items-center text-center ${inter.className}`}
    >
      <img
        src={imageSrc}
        alt={`${name}'s profile`}
        className="h-48 w-48 object-cover rounded-lg"
      />
      <h3 className="mt-4 text-lg font-semibold text-white">{name}</h3>
      <p className="text-gray-300">{position}</p>
      {placed_at && <p className="text-gray-300 text-sm">{placed_at}</p>}
      <div className="mt-2 flex space-x-4">
        {socialLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition-colors flex items-center"
          >
            {link.icon}
          </Link>
        ))}
      </div>
    </div>
  );
}
