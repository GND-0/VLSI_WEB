"use client";

import { useState, useEffect } from 'react';
import { 
  Fira_Code, JetBrains_Mono, Orbitron, Rajdhani, Space_Mono,
  Exo_2, Chivo_Mono, Share_Tech_Mono, Overpass_Mono, IBM_Plex_Mono,
  Source_Code_Pro, Anonymous_Pro, Inconsolata, Cousine, Teko,
  Saira, Titillium_Web, Rubik, Oxygen_Mono, VT323,
  Press_Start_2P, Audiowide, Quantico, Electrolize, Oxanium,
  B612_Mono, Major_Mono_Display
} from 'next/font/google';

// Define font loaders as individual constants at module scope
const firaCode = Fira_Code({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const exo2 = Exo_2({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const chivoMono = Chivo_Mono({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const shareTechMono = Share_Tech_Mono({ subsets: ['latin'], weight: ['400'], display: 'swap' }); // Note: 700 not available, using 400
const overpassMono = Overpass_Mono({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const ibmPlexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const sourceCodePro = Source_Code_Pro({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const anonymousPro = Anonymous_Pro({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const inconsolata = Inconsolata({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const cousine = Cousine({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const teko = Teko({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const saira = Saira({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const titilliumWeb = Titillium_Web({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const rubik = Rubik({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const oxygenMono = Oxygen_Mono({ subsets: ['latin'], weight: ['400'], display: 'swap' }); // Note: 700 not available, using 400
const vt323 = VT323({ subsets: ['latin'], weight: ['400'], display: 'swap' }); // Note: 700 not available, using 400
const pressStart2P = Press_Start_2P({ subsets: ['latin'], weight: ['400'], display: 'swap' }); // Note: 700 not available, using 400
const audiowide = Audiowide({ subsets: ['latin'], weight: ['400'], display: 'swap' }); // Note: 700 not available, using 400
const quantico = Quantico({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const electrolize = Electrolize({ subsets: ['latin'], weight: ['400'], display: 'swap' }); // Note: 700 not available, using 400
const oxanium = Oxanium({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const b612Mono = B612_Mono({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const majorMonoDisplay = Major_Mono_Display({ subsets: ['latin'], weight: ['400'], display: 'swap' }); // Note: 700 not available, using 400

// Collect fonts into an array for mapping to stock texts
const fonts = [
  firaCode,
  jetBrainsMono,
  orbitron,
  rajdhani,
  spaceMono,
  exo2,
  chivoMono,
  shareTechMono,
  overpassMono,
  ibmPlexMono,
  sourceCodePro,
  anonymousPro,
  inconsolata,
  cousine,
  teko,
  saira,
  titilliumWeb,
  rubik,
  oxygenMono,
  vt323,
  pressStart2P,
  audiowide,
  quantico,
  electrolize,
  oxanium,
  b612Mono,
  majorMonoDisplay,
];

// Stock texts for <h3>
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
  'When Ground is Zero, Innovation is Infinite',
  'When Ground is Zero, Possibilities Take Shape',
  'When Ground is Zero, Greatness Begins',
  'When Ground is Zero, Everything is Possible',
  'When Ground is Zero, Circuits Come Alive',
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
  const [isGlitching, setIsGlitching] = useState(false);
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
        setTextIndex((prev) => (prev + 1) % stockTexts.length);
      }, 1200); // Extended glitch duration for more dramatic effect
    }, 7000); // Slightly faster trigger

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className={fonts[textIndex].className}>
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
        className={`text-2xl sm:text-2xl md:text-2xl font-bold text-white tracking-tight mt-8 transition-all duration-300 ${
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