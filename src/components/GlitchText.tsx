"use client";

import { useState, useEffect } from 'react';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });

// Stock texts for rotating tagline
const stockTexts = [
  'From Ground to Greatness',
  'Grounding Knowledge, Rising in Innovation',
  'Where Ground is Zero, Possibilities are Infinite',
  'Every Circuit Starts Here, Every Innovation Starts Now',
  'Rooted in Ground, Reaching for Greatness',
  'From GND_0 to Global Innovation',
  'Grounding Engineers, Powering the Future',
  'Zero as a Start, Greatness as a Destination',
  'Where Ideas Ground, Greatness Grows',
  'Grounded in Circuits, Soaring in Innovation',
  'When Ground is Zero, the Future is Designed',
  'When Ground is Zero, Excellence Flows',
  'When Ground is Zero, We Rise Higher',
  'When Ground is Zero, Innovation Flows',
  'When Ground is Zero, Ideas Spark',
  'When Ground is Zero, Circuits Thrive',
  'When Ground is Zero, Knowledge Flows',
  'When Ground is Zero, Creativity Flows',
  'When Ground is Zero, the Future Flows',
  'When Ground is Zero, Possibilities Multiply',
  'When Ground is Zero, Everything Connects',
  'When Ground is Zero, Excellence Begins to Flow',
];

interface GlitchTextProps {
  h1Text: string;
  initialH3Text: string;
}

export default function GlitchText({ h1Text }: GlitchTextProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setTextIndex((prev) => (prev + 1) % stockTexts.length);
        setIsTransitioning(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${orbitron.className} text-left space-y-4`}>
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
        {h1Text}
      </h1>
      <p
        className={`text-lg sm:text-xl md:text-2xl text-teal-400 font-medium mt-4 transition-opacity duration-300 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {stockTexts[textIndex]}
      </p>
    </div>
  );
}