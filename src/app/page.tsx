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
        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(100px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.8);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .card {
          animation: fadeIn 0.6s ease-out;
        }
        .glitch-title:hover {
          animation: glitch 0.3s linear 2;
        }
        .video-section-animate {
          animation: slideInFromBottom 1s ease-out;
        }
        .video-animate {
          animation: scaleIn 1s ease-out 0.3s both;
        }
        .tour-button {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899);
          background-size: 300% 300%;
          animation: shimmer 3s ease-in-out infinite;
          transition: all 0.3s ease;
        }
        .tour-button:hover {
          animation: pulse 1s infinite, shimmer 3s ease-in-out infinite;
        }
        .audio-control {
          backdrop-filter: blur(10px);
          background: rgba(0, 0, 0, 0.7);
          transition: all 0.3s ease;
        }
        .audio-control:hover {
          background: rgba(59, 130, 246, 0.8);
          transform: scale(1.1);
        }
        .video-inner-container {
          position: relative;
          width: 100%;
          height: 100%;
          background: black;
          border-radius: 10px;
          overflow: hidden;
        }
        .video-inner-container iframe {
          position: absolute;
          top: -6px;
          left: -6px;
          width: calc(100% + 12px);
          height: calc(100% + 12px);
          border: none;
        }
        .video-inner-container video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
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
        <main className="z-10 flex flex-col items-center text-center w-full max-w-7xl mx-auto space-y-16 mt-30">
          <GlitchText
            h1Text="GND_0 VLSI CLUB IIIT DHARWAD"
            initialH3Text="Bridging Academia and Industry in Semiconductor Design."
          />
          <button
            onClick={scrollToVideo}
            className={`tour-button px-8 py-4 rounded-full text-white font-bold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 mt-10 ${
              showWhiteBorder ? 'border-[3px] border-white' : ''
            }`}
          >
            <Play className="inline-block w-5 h-5 mr-2" />
            Take the Ultimate Tour
          </button>
          
          <div 
            ref={sectionRef}
            className={`mt-65 relative w-full h-[500px] rounded-2xl ${
              isVideoInView ? 'video-section-animate' : ''
            }`}
          >
            <button
              onClick={toggleAudio}
              className="audio-control absolute top-4 right-4 z-50 p-3 rounded-full text-white shadow-lg"
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </button>

            <div className={`absolute inset-0 w-full h-full ${isVideoInView ? 'video-animate' : ''}`}>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[6px]">
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

            {particlesReady && (
              <div className="absolute inset-0 z-35 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-ping"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${2 + Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="w-full mt-15">
            <h3 className="text-3xl md:text-4xl font-bold text-green mb-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
              Latest @ VLSI Pulse
            </h3>
            <div className="embla overflow-hidden" ref={emblaRef}>
              <div className="embla__container flex gap-8">
                {hotTopics.map((topic) => (
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