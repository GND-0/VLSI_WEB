"use client";

import { useState, useEffect } from 'react';
import { Inter, Roboto, Poppins, Lora, Merriweather } from 'next/font/google';

// Define fonts for cycling
const inter = Inter({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const lora = Lora({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const merriweather = Merriweather({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });

const fonts = [inter, roboto, poppins, lora, merriweather];
const fontNames = ['Inter', 'Roboto', 'Poppins', 'Lora', 'Merriweather'];

// Stock texts for <h3>
const stockTexts = [
  'Bridging Academia and Industry in Semiconductor Design.',
  'Innovating the Future of VLSI Technology.',
  'Empowering Students in Circuit Design Excellence.',
  'Connecting Talent with Semiconductor Opportunities.',
  'Advancing Knowledge in Microelectronics.',
];

interface GlitchTextProps {
  h1Text: string;
  initialH3Text: string;
}

export default function GlitchText({ h1Text, initialH3Text }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [fontIndex, setFontIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [glitchIntensity, setGlitchIntensity] = useState(1);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      // Randomize glitch intensity (1-3 levels)
      const intensity = Math.floor(Math.random() * 3) + 1;
      setGlitchIntensity(intensity);
      
      setIsGlitching(true);
      setTimeout(() => {
        setIsGlitching(false);
        setFontIndex((prev) => (prev + 1) % fonts.length);
        setTextIndex((prev) => (prev + 1) % stockTexts.length);
      }, 1200); // Glitch duration
    }, 7000); // Trigger interval

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className={fonts[fontIndex].className}>
      <h1
        className={`text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight transition-all duration-300 ${
          isGlitching ? `glitch-enhanced glitch-intensity-${glitchIntensity}` : ''
        }`}
        data-text={h1Text}
        style={{
          textShadow: isGlitching 
            ? '0 0 10px #00ffff, 0 0 20px #ff00ff, 0 0 30px #00ff00'
            : '0 0 5px rgba(255, 255, 255, 0.3)'
        }}
      >
        {h1Text}
      </h1>
      <h3
        className={`text-xl sm:text-2xl md:text-2xl font-medium text-gray-300 tracking-tight mt-8 transition-all duration-300 ${
          isGlitching ? `glitch-enhanced glitch-intensity-${glitchIntensity}` : ''
        }`}
        data-text={stockTexts[textIndex]}
        style={{
          textShadow: isGlitching 
            ? '0 0 8px #00ffff, 0 0 16px #ff00ff'
            : '0 0 3px rgba(255, 255, 255, 0.2)'
        }}
      >
        {stockTexts[textIndex]}
      </h3>
    </div>
  );
}