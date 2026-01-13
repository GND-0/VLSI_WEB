import { cn } from "@/lib/utils";
import React from "react";

interface GridBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export default function GridBackground({ children, className }: GridBackgroundProps) {
  return (
    <div className={cn("relative min-h-screen w-full bg-black", className)}>
      {/* Grid pattern */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for faded look */}
      <div className="pointer-events-none absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
