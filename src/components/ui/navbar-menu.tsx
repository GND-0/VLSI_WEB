"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const transition = {
  type: "spring" as const,
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-gray-300 hover:text-white font-medium text-sm px-3 py-2"
      >
        {item}
      </motion.p>
      {active !== null && active === item && children && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 5 }}
          transition={transition}
          className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50"
        >
          <motion.div
            layoutId="active"
            className="bg-black/95 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-700/60 shadow-2xl shadow-black/50"
          >
            <motion.div layout className="w-max h-full p-4">
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative flex items-center gap-1"
    >
      {children}
    </nav>
  );
};

export const HoveredLink = ({ 
  children, 
  href,
  ...rest 
}: { 
  children: React.ReactNode;
  href: string;
  [key: string]: any;
}) => {
  return (
    <Link
      href={href}
      {...rest}
      className="text-gray-300 hover:text-teal-400 transition-all duration-200 block py-2 px-3 rounded-lg hover:bg-white/5 text-sm"
    >
      {children}
    </Link>
  );
};
