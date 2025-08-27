"use client";

import localFont from 'next/font/local';
import Header from '../components/header';
import Footer from '../components/footer';
import GlitchText from '../components/GlitchText';
import { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import Image from 'next/image';

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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', slidesToShow: 1, breakpoints: { '(min-width: 768px)': { slidesToShow: 3 } } });

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
                  <div key={topic._id} className="embla__slide flex-[0_0_100%] md:flex-[0_0_33.33%] min-w-0">
                    <div className="bg-gray-900 border border-blue-500/30 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
                      {topic.imagery && topic.imagery[0] && topic.imagery[0].image.asset.url && (
                        <div className="relative h-48">
                          <Image
                            src={topic.imagery[0].image.asset.url}
                            alt={topic.imagery[0].description || topic.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        </div>
                      )}
                      <div className="p-6 relative">
                        <span className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold text-white bg-purple-600 rounded-full">{topic.category}</span>
                        <Link href={`/vlsipulse?topic=${topic._id}`} className="block text-xl font-bold text-white hover:text-blue-300 mb-2">
                          {topic.title}
                        </Link>
                        <p className="text-sm text-gray-300 line-clamp-3 mb-4">{topic.summary}</p>
                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <span>{topic.author || 'Anonymous'}</span>
                          <span>{new Date(topic.publishDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                          <span>👍 {topic.upvotes || 0}</span>
                          <span>👀 {topic.views || 0}</span>
                          {topic.isVerified && <span className="text-green-500 font-semibold">Verified ✓</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-6 space-x-4">
              <button onClick={() => emblaApi?.scrollPrev()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Prev</button>
              <button onClick={() => emblaApi?.scrollNext()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Next</button>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}