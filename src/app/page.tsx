"use client";

import localFont from 'next/font/local';
import Header from '../components/header';
import Footer from '../components/footer';
import GlitchText from '../components/GlitchText';
import { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';

// Load the custom font from the public directory
const customFont = localFont({
  src: '/../components/f1.ttf', // Updated to your font file path
  display: 'swap',
});

interface HotTopic {
  _id: string;
  title: string;
  author?: string;
  summary: string;
  category: string;
  sourceUrl: string[];
  imagery?: Array<{
    image: { asset: { url: string } };
    description: string;
  }>;
  publishDate: string;
  isVerified: boolean;
  upvotes?: number;
  views?: number;
}

export default function Home() {
  const [hotTopics, setHotTopics] = useState<HotTopic[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/sanity");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setHotTopics(data.hotTopics || []);
      } catch (error) {
        console.error("Error fetching hot topics for carousel:", error);
      }
    };
    fetchData();
  }, []);

  // Auto-scroll logic
  const autoScroll = useCallback(() => {
    if (emblaApi) {
      const autoPlay = () => {
        emblaApi.scrollNext();
      };
      const interval = setInterval(autoPlay, 3000); // Auto-scroll every 3 seconds
      return () => clearInterval(interval);
    }
  }, [emblaApi]);

  useEffect(() => {
    const stopAutoScroll = autoScroll();
    return stopAutoScroll;
  }, [autoScroll]);

  return (
    <div className={`flex flex-col min-h-screen bg-black ${customFont.className}`}>
      <Header />
      <div
        className="relative flex flex-col items-center justify-center flex-grow p-8"
        style={{
          backgroundImage: "url('/image.png')",
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'top left',
          imageRendering: 'crisp-edges',
        }}
      >
        {/* Hero Section */}
        <main className="z-10 flex flex-col items-center text-center mt-16">
          <GlitchText
            h1Text="GND_0 VLSI CLUB IIIT DHARWAD"
            initialH3Text="Bridging Academia and Industry in Semiconductor Design."
          />
          <div className="mt-8 w-full max-w-3xl">
            <h3 className="text-2xl font-bold text-center mb-4">Latest VLSI Pulse</h3>
            <div className="w-full overflow-hidden" ref={emblaRef}>
              <div className="flex space-x-4">
                {hotTopics.map((topic) => (
                  <div key={topic._id} className="min-w-[300px] flex-[0_0_300px] bg-gray-800 p-4 rounded-lg text-white">
                    <Link href={`/vlsipulse?topic=${topic._id}`} className="block w-full h-full text-center text-lg font-semibold hover:text-blue-300">
                      {topic.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}