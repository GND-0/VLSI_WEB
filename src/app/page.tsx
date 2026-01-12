"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Script from "next/script";
import { Exo_2 } from "next/font/google";
import Header from "../components/header";
import Footer from "../components/footer";
import GlitchText from "../components/GlitchText";
import useEmblaCarousel from "embla-carousel-react";
import { ExternalLink, ThumbsUp, Eye, Play, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";

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

interface Video {
  _key: string;
  title: string;
  description?: string;
  category?: string;
  file: { asset: { url: string } };
}

interface VideoDump {
  _id: string;
  title: string;
  videos: Video[];
  publishDate: string;
}

const calculateReadingTime = (text: string) => {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export default function Home() {
  const [hotTopics, setHotTopics] = useState<HotTopic[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showWhiteBorder, setShowWhiteBorder] = useState(false);
  
  const [isVideoInView, setIsVideoInView] = useState(false);
  const [hasAudioPlayed, setHasAudioPlayed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const [particlesReady, setParticlesReady] = useState(false);
  const [homeVideoUrl, setHomeVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    setParticlesReady(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/sanity");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setHotTopics(data.hotTopics || []);

        if (data.videos && data.videos.length > 0) {
          const allVideos: Video[] = data.videos.flatMap((doc: VideoDump) => doc.videos);
          const homeVideo = allVideos.find(v => v.category === 'home');
          setHomeVideoUrl(homeVideo?.file.asset.url || null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!iframeRef.current || typeof window === 'undefined') return;

    const initPlayer = () => {
      try {
        if ((window as any).Vimeo && (window as any).Vimeo.Player) {
          playerRef.current = new (window as any).Vimeo.Player(iframeRef.current);
          playerRef.current.setVolume(0);
          setIsMuted(true);
          setVideoError(false);
        } else {
          setTimeout(initPlayer, 500);
        }
      } catch (error) {
        console.error('Vimeo Player Init Error:', error);
        setVideoError(true);
      }
    };

    const timer = setTimeout(initPlayer, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVideoInView(true);
          if (playerRef.current && !hasAudioPlayed && !videoError) {
            playerRef.current.setVolume(1).catch(console.error);
            setIsMuted(false);
            setHasAudioPlayed(true);
            playerRef.current.play().catch(console.error);
          }
        } else if (playerRef.current && !videoError) {
          playerRef.current.pause().catch(console.error);
        }
      },
      {
        threshold: 0.5,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAudioPlayed, videoError]);

  const scrollToVideo = () => {
    setShowWhiteBorder(true);
    sectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  const toggleAudio = () => {
    if (playerRef.current && !videoError) {
      playerRef.current.getVolume().then((volume: number) => {
        const newVolume = volume > 0 ? 0 : 1;
        playerRef.current.setVolume(newVolume).catch(console.error);
        setIsMuted(newVolume === 0);
      }).catch(console.error);
    }
  };

  const autoScroll = useCallback(() => {
    if (emblaApi) {
      const interval = setInterval(() => {
        emblaApi.scrollNext();
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [emblaApi]);

  useEffect(() => {
    const stopAutoScroll = autoScroll();
    return stopAutoScroll;
  }, [autoScroll]);

  return (
    <div className={`flex flex-col min-h-screen bg-gray-950 ${exo2.className}`}>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card {
          animation: fadeIn 0.6s ease-out;
        }
        .video-inner-container {
          position: relative;
          width: 100%;
          height: 100%;
          background: #0a0a0a;
          border-radius: 12px;
          overflow: hidden;
        }
        .video-inner-container iframe,
        .video-inner-container video {
          position: absolute;
          top: -6px;
          left: -6px;
          width: calc(100% + 12px);
          height: calc(100% + 12px);
          border: none;
          object-fit: cover;
        }
      `}</style>

      <Script
        src="https://player.vimeo.com/api/player.js"
        strategy="afterInteractive"
        onLoad={() => console.log('Vimeo API loaded')}
        onError={(e) => {
          console.error('Vimeo Script Error:', e);
          setVideoError(true);
        }}
      />

      <Header />
      <div className="relative flex flex-col items-center justify-center grow px-6 sm:px-8 lg:px-12 py-16">
        {/* Grid Background Pattern */}
        <div
          className="absolute inset-0 [background-size:20px_20px] [background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        />
        <div className="pointer-events-none absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        
        <main className="z-10 w-full max-w-7xl mx-auto mt-20">
          {/* Hero Section - Text Left, Video Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
            {/* Left - Text Content */}
            <div className="flex flex-col text-left space-y-6">
              <GlitchText
                h1Text="GND_0 VLSI CLUB IIIT DHARWAD"
                initialH3Text="Bridging Academia and Industry in Semiconductor Design."
              />
              
              <button
                onClick={scrollToVideo}
                className="group relative inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 px-8 py-4 rounded-lg text-white font-semibold text-lg shadow-xl shadow-teal-900/30 hover:shadow-teal-800/50 transition-all duration-300 hover:-translate-y-0.5 w-fit"
              >
                <Play className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span>Take the Ultimate Tour</span>
              </button>
            </div>
            
            {/* Right - Video Section */}
            <div 
              ref={sectionRef}
              className="relative w-full"
            >
              <button
                onClick={toggleAudio}
                className="absolute top-4 right-4 z-20 p-3 rounded-full bg-black/70 backdrop-blur-md border border-teal-700/50 text-white hover:bg-black/80 hover:border-teal-600/70 transition-all duration-300"
                title={isMuted ? "Unmute Audio" : "Mute Audio"}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl shadow-black/40 border-2 border-teal-600/30">
                <div className="video-inner-container">
                  {!videoError ? (
                    <iframe
                      ref={iframeRef}
                      src="https://player.vimeo.com/video/1124568750?badge=0&autopause=0&player_id=0&autoplay=1&muted=1&loop=1"
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      title="GND_Intro"
                    />
                  ) : (
                    homeVideoUrl && (
                      <video 
                        autoPlay 
                        loop 
                        playsInline 
                        muted={isMuted}
                        preload="auto"
                        className="w-full h-full object-cover"
                      >
                        <source src={homeVideoUrl} type="video/mp4" />
                      </video>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* VLSI Pulse Articles Section */}
          <div className="w-full">
            <h3 className="text-3xl md:text-4xl font-bold mb-10 text-teal-400 tracking-tight">
              Latest @ VLSI Pulse
            </h3>
            
            <div className="embla overflow-hidden px-4" ref={emblaRef}>
              <div className="embla__container flex gap-6">
                {hotTopics.map((topic) => (
                  <div
                    key={topic._id}
                    className="embla__slide flex-[0_0_320px] min-w-0"
                  >
                    <div className="bg-gray-900/90 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden shadow-xl hover:border-teal-600/50 hover:shadow-2xl hover:shadow-teal-900/20 transition-all duration-400 hover:-translate-y-2 h-full flex flex-col group">
                      {topic.thumbnail?.asset?.url && (
                        <div className="relative overflow-hidden h-44">
                          <img
                            src={topic.thumbnail.asset.url}
                            alt={topic.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      )}
                      <div className="p-5 flex-1 flex flex-col">
                        <span className="inline-block w-fit px-3 py-1 mb-3 text-xs font-semibold text-white bg-teal-600 rounded-md">
                          {topic.category}
                        </span>
                        <h4 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-teal-300 transition-colors">
                          {topic.title}
                        </h4>
                        <p className="text-sm text-gray-400 mb-4 line-clamp-3 flex-1">
                          {topic.summary}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-800">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {calculateReadingTime(topic.summary)} min read
                          </span>
                          <div className="flex gap-3">
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-3.5 h-3.5" />
                              {topic.upvotes || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              {topic.views || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Pagination Dots */}
            <div className="flex justify-center mt-8 gap-2">
              {hotTopics.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === selectedIndex
                      ? "bg-teal-500 w-8"
                      : "bg-gray-700 hover:bg-gray-600 w-2"
                  }`}
                  onClick={() => emblaApi?.scrollTo(index)}
                />
              ))}
            </div>
            
            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => emblaApi?.scrollPrev()}
                className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-all duration-300 border border-gray-700 hover:border-teal-600/50"
              >
                Prev
              </button>
              <Link
                href="/vlsiPulse"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-lg shadow-teal-900/30"
              >
                Read Articles <ExternalLink className="w-4 h-4" />
              </Link>
              <button
                onClick={() => emblaApi?.scrollNext()}
                className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-all duration-300 border border-gray-700 hover:border-teal-600/50"
              >
                Next
              </button>
            </div>
          </div>
        </main>
        
        {/* Footer inside grid background */}
        <div className="z-10 w-full mt-20">
          <Footer />
        </div>
      </div>
    </div>
  );
}