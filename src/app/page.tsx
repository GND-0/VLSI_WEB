"use client";

import localFont from 'next/font/local';
import Header from '../components/header';
import Footer from '../components/footer';
import GlitchText from '../components/GlitchText';
import { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ExternalLink } from "lucide-react";
import Link from 'next/link';

// Load the custom font from the public directory
const customFont = localFont({
  src: '/../components/f1.ttf',
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', slidesToScroll: 1 });

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
          <div className="mt-8 w-full max-w-5xl">
            <h3 className="text-3xl font-bold text-white text-center mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Latest VLSI Pulse</h3>
            <div className="embla overflow-hidden" ref={emblaRef}>
              <div className="embla__container flex gap-4">
                {hotTopics.map((topic) => (
                  <div key={topic._id} className="embla__slide flex-[0_0_300px] min-w-0">
                    <div className="bg-gray-900 border border-blue-500/30 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 p-6">
                      <div className="block text-xl font-bold text-white hover:text-blue-300 mb-2">
                        {topic.title}
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-400 mt-4">
                        <span>👍 {topic.upvotes || 0}</span>
                        <span>👀 {topic.views || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Link href="/vlsiPulse" className='flex-1 inline-flex items-center justify-center px-4 py-2 border border-purple-500 text-purple-300 hover:bg-purple-500/20 rounded-md text-sm font-medium transition-colors'>Read Articles <ExternalLink className="w-4 h-4 ml-2" /> </Link>
            </div>
            <div className="flex justify-center mt-6 space-x-4">
              <button onClick={() => emblaApi?.scrollPrev()} className="px-4 py-2 border border-purple-500 text-purple-300 hover:bg-purple-500/20 rounded-md text-sm font-medium transition-colors cursor-pointer">Prev</button>
              <button onClick={() => emblaApi?.scrollNext()} className="px-4 py-2 border border-purple-500 text-purple-300 hover:bg-purple-500/20 rounded-md text-sm font-medium transition-colors cursor-pointer">Next</button>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}