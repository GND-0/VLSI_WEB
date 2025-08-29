"use client";

import { Button } from "@nextui-org/react"; // Assuming you use NextUI for styled buttons, install if needed: npm install @nextui-org/react
import { FcGoogle } from "react-icons/fc";

interface GoogleAuthButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export default function GoogleAuthButton({ onClick, disabled }: GoogleAuthButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-full mt-4 bg-white text-black hover:bg-gray-200 transition-colors flex items-center justify-center"
    >
      <FcGoogle className="mr-2" /> Sign in with Google
    </Button>
  );
}