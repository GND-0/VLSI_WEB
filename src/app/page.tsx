"use client";

import { useEffect, useState, useCallback } from "react";
import { Exo_2 } from "next/font/google";
import Header from "../components/header";
import Footer from "../components/footer";
import GlitchText from "../components/GlitchText";
import useEmblaCarousel from "embla-carousel-react";
import { ExternalLink, ThumbsUp, Eye } from "lucide-react";
import Link from "next/link";

// Load Exo_2 font for article-like, techy aesthetic
const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

interface HotTopic {
  _id: string;
  title: string;
  author?: string;
  summary: string;
  category: string;
  sourceUrl: string[];
  thumbnail?: { asset: { url: string } };
  imagery?: Array<{
    image: { asset: { url: string } };
    description: string;
  }>;
  publishDate: string;
  isVerified: boolean;
  upvotes?: number;
  views?: number;
}

// Function to estimate reading time based on word count
const calculateReadingTime = (text: string) => {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes;
};

export default function Home() {
  const [hotTopics, setHotTopics] = useState<HotTopic[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/sanity");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setHotTopics(data.hotTopics || []);
      } catch (error) {
        console.error("Error fetching hot topics for carousel:", error);
      }
    };
    fetchData();
  }, []);

  // Auto-scroll and dot navigation
  const autoScroll = useCallback(() => {
    if (emblaApi) {
      const autoPlay = () => {
        emblaApi.scrollNext();
      };
      const interval = setInterval(autoPlay, 4000); // Slower scroll for better readability
      return () => clearInterval(interval);
    }
  }, [emblaApi]);

  useEffect(() => {
    const stopAutoScroll = autoScroll();
    return stopAutoScroll;
  }, [autoScroll]);

  // Update selected index for dots
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  return (
    <div className={`flex flex-col min-h-screen bg-black ${exo2.className}`}>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(2px, -2px);
          }
          60% {
            transform: translate(-2px, 0);
          }
          80% {
            transform: translate(2px, 2px);
          }
          100% {
            transform: translate(0);
          }
        }
        .card {
          animation: fadeIn 0.6s ease-out;
        }
        .glitch-title:hover {
          animation: glitch 0.3s linear 2;
        }
      `}</style>
      <Header />
      <div
        className="relative flex flex-col items-center justify-center flex-grow px-6 sm:px-8 lg:px-12 py-16"
        style={{
          backgroundImage: "url('/image.png')",
          backgroundSize: "auto",
          backgroundRepeat: "repeat",
          backgroundPosition: "top left",
          imageRendering: "crisp-edges",
        }}
      >
        {/* Hero Section */}
        <main className="z-10 flex flex-col items-center text-center w-full max-w-7xl mx-auto space-y-16 mt-30">
          <GlitchText
            h1Text="GND_0 VLSI CLUB IIIT DHARWAD"
            initialH3Text="Bridging Academia and Industry in Semiconductor Design."
          />
          <div className="w-full mt-15">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
              Latest VLSI Pulse
            </h3>
            <div className="embla overflow-hidden" ref={emblaRef}>
              <div className="embla__container flex gap-8">
                {hotTopics.map((topic, index) => (
                  <div
                    key={topic._id}
                    className="embla__slide flex-[0_0_340px] min-w-0 card"
                  >
                    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-md border border-blue-500/40 rounded-2xl overflow-hidden shadow-xl hover:shadow-blue-500/70 transition-all duration-500 hover:scale-105 p-6 flex flex-col h-full">
                      {topic.thumbnail?.asset?.url && (
                        <div className="relative overflow-hidden rounded-lg mb-4 group">
                          <img
                            src={topic.thumbnail.asset.url}
                            alt={topic.title}
                            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      )}
                      <div className="flex-1">
                        <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold text-white bg-blue-600/70 rounded-full">
                          {topic.category}
                        </span>
                        <div
                          className="text-2xl md:text-3xl font-bold text-white hover:text-cyan-300 mb-4 line-clamp-2 glitch-title"
                          style={{
                            textShadow: "0 0 5px rgba(0, 255, 255, 0.3)",
                          }}
                        >
                          {topic.title}
                        </div>
                        <p className="text-sm text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                          {topic.summary}
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-300 border-t border-blue-500/20 pt-3">
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {calculateReadingTime(topic.summary)} mins read
                        </span>
                        <div className="flex space-x-4">
                          <span className="flex items-center">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {topic.upvotes || 0}
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {topic.views || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-6 space-x-2">
              {hotTopics.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === selectedIndex
                      ? "bg-cyan-400 scale-125"
                      : "bg-gray-600 hover:bg-cyan-600"
                  }`}
                  onClick={() => emblaApi?.scrollTo(index)}
                />
              ))}
            </div>
            <div className="mt-8 flex justify-center space-x-6">
              <button
                onClick={() => emblaApi?.scrollPrev()}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-md text-base font-bold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Prev
              </button>
              <Link
                href="/vlsiPulse"
                className="inline-flex items-center justify-center px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md text-base font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Read Articles <ExternalLink className="w-5 h-5 ml-2" />
              </Link>
              <button
                onClick={() => emblaApi?.scrollNext()}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-md text-base font-bold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
