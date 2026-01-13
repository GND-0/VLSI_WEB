"use client";

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import Image from "next/image";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselDots } from "@/components/ui/carousel";
import { Calendar, MapPin, Users, Clock, ExternalLink, Sparkles, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ResizableBox, ResizeCallbackData } from 'react-resizable';

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

interface EventSimple {
  _id: string;
  title: string;
  description: string;
  dateTime: string;
}

interface EventDetailed {
  _id: string;
  title: string;
  shortDescription: string;
  longDescription: Array<{ children: Array<{ text: string }> }>;
  dateTime: string;
  images: Array<{ asset: { url: string } }>;
  videos?: Array<{ asset: { url: string }; caption?: string }>;
  location?: string;
  speakers?: string[];
  tags?: string[];
  attendeesCount?: number;
  registrationLink?: string;
}

interface UpcomingEvent {
  _id: string;
  title: string;
  description: string;
  images: Array<{ asset: { url: string } }>;
  tentativeDates: string[];
  isLive: boolean;
  registrationLink?: string;
  venue?: string;
}

// Skeleton Loader for Cards
function SkeletonCard() {
  return (
    <div className="bg-black/30 backdrop-blur-md p-6 rounded-xl animate-pulse shadow-lg">
      <div className="h-8 bg-gray-700 rounded w-3/4 mb-3"></div>
      <div className="h-5 bg-gray-700 rounded w-full"></div>
    </div>
  );
}

// Simple Event Card
function SimpleEventCard({ event }: { event: EventSimple }) {
  return (
    <div className="bg-slate-900/85 backdrop-blur-xl p-5 rounded-xl border border-gray-700/30 hover:border-teal-500/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/10">
      <h4 className="text-lg font-semibold text-white mb-2">{event.title}</h4>
      <p className="text-gray-500 text-sm mb-2">{new Date(event.dateTime).toLocaleString()}</p>
      <p className="text-gray-400 text-sm">{event.description}</p>
    </div>
  );
}

// Detailed Event Card
function DetailedEventCard({ event, onClick }: { event: EventDetailed; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-slate-900/85 backdrop-blur-xl p-5 rounded-xl border border-gray-700/30 hover:border-teal-500/40 transition-all duration-500 cursor-pointer group hover:-translate-y-1.5 hover:shadow-xl hover:shadow-teal-500/10"
    >
      <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors">
        {event.title}
      </h4>
      <p className="text-gray-500 text-sm mb-2">{new Date(event.dateTime).toLocaleString()}</p>
      <p className="text-gray-400 text-sm line-clamp-3">{event.shortDescription}</p>
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
        {event.images.length > 0 && (
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            {event.images.length} images
          </span>
        )}
        {event.videos && event.videos.length > 0 && (
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            {event.videos.length} videos
          </span>
        )}
      </div>
    </div>
  );
}

// Enhanced Upcoming Event Component
function UpcomingEventCard({ event }: { event: UpcomingEvent }) {
  return (
    <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800/50 overflow-hidden hover:border-gray-700 transition-all duration-300 group">
      {/* Live indicator */}
      {event.isLive && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Live Now
          </div>
        </div>
      )}

      {/* Image Section */}
      {event.images.length > 0 && (
        <div className="relative h-44 overflow-hidden">
          <Image
            src={event.images[0].asset.url}
            alt="Event image"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
          <div className="absolute inset-0 bg-linear-to-t from-gray-900 to-transparent" />
          {event.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
              +{event.images.length - 1} more
            </div>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className="p-5">
        <h4 className="text-lg font-semibold text-white mb-3 group-hover:text-green-400 transition-colors">
          {event.title}
        </h4>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Calendar className="w-4 h-4 text-green-400" />
            <span>
              {event.tentativeDates.length > 1
                ? `${new Date(event.tentativeDates[0]).toLocaleDateString()} - ${new Date(
                    event.tentativeDates[event.tentativeDates.length - 1]
                  ).toLocaleDateString()}`
                : new Date(event.tentativeDates[0]).toLocaleDateString()}
            </span>
          </div>

          {event.venue && (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <MapPin className="w-4 h-4 text-green-400" />
              <span>{event.venue}</span>
            </div>
          )}
        </div>

        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{event.description}</p>

        {/* Action Button */}
        {event.isLive && event.registrationLink ? (
          <a
            href={event.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Register Now
          </a>
        ) : (
          <div className="inline-flex items-center gap-2 bg-gray-800 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
            <Clock className="w-4 h-4" />
            Coming Soon
          </div>
        )}
      </div>
    </div>
  );
}

export default function Events() {
  const [eventSimple, setEventSimple] = useState<EventSimple[]>([]);
  const [eventDetailed, setEventDetailed] = useState<EventDetailed[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventDetailed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [modalSize, setModalSize] = useState({ width: 800, height: 600 });

  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (selectedEvent && viewportSize.width > 0) {
      setModalSize({
        width: viewportSize.width - 100,
        height: viewportSize.height - 100,
      });
    }
  }, [selectedEvent, viewportSize]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/sanity", { signal: AbortSignal.timeout(30000) });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setEventSimple(data.eventSimple || []);
        setEventDetailed(data.eventDetailed || []);
        setUpcomingEvents(data.upcomingEvents || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(error instanceof Error ? error.message : "Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const events = [...eventSimple, ...eventDetailed].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  return (
    <div className={`flex flex-col min-h-screen bg-black text-white ${inter.className}`}>
      <Header />
      <div className="relative flex flex-col grow p-4 md:p-8 mt-16">
        {/* Grid Background Pattern */}
        <div
          className="absolute inset-0 [background-size:20px_20px] [background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        />
        <div className="pointer-events-none absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        
        <main className="z-10 max-w-7xl mx-auto w-full px-4">
          {/* Horizontal Timeline */}
          <section className="py-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-teal-400">
              Event Timeline
            </h2>
            {error ? (
              <p className="text-red-400 text-center">{error}</p>
            ) : loading ? (
              <div className="flex justify-center">
                <SkeletonCard />
              </div>
            ) : events.length > 0 ? (
              <div className="relative">
                {/* Horizontal Timeline Container */}
                <div className="overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-gray-800">
                  <div className="flex items-stretch gap-8 min-w-max px-4">
                    {events.map((event, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex flex-col items-center"
                        style={{ minWidth: '320px', maxWidth: '320px' }}
                      >
                        {/* Timeline connector line */}
                        {index < events.length - 1 && (
                          <div className="absolute top-8 left-1/2 w-full h-0.5 bg-linear-to-r from-teal-600 via-teal-500 to-transparent z-0" 
                            style={{ transform: 'translateY(-50%)', left: '50%', width: 'calc(100% + 32px)' }} 
                          />
                        )}
                        
                        {/* Timeline node/icon */}
                        <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-teal-600 to-cyan-500 border-4 border-gray-900 shadow-lg shadow-teal-500/30 mb-4">
                          <div className="text-white font-bold text-sm">{index + 1}</div>
                        </div>
                        
                        {/* Date */}
                        <div className="text-teal-400 text-sm font-medium mb-3">
                          {new Date(event.dateTime).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </div>
                        
                        {/* Event Card */}
                        <div className="w-full">
                          {"shortDescription" in event ? (
                            <DetailedEventCard event={event} onClick={() => setSelectedEvent(event)} />
                          ) : (
                            <SimpleEventCard event={event} />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Scroll indicators */}
                <div className="flex justify-center gap-2 mt-4">
                  <div className="text-gray-500 text-xs flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    <span>Scroll to see more</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-400">No events available.</p>
            )}
          </section>

          {/* Upcoming Events */}
          <section className="py-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Upcoming Events
            </h2>
            {error ? (
              <p className="text-red-400 text-center">{error}</p>
            ) : loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <UpcomingEventCard key={event._id} event={event} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400">No upcoming events.</p>
            )}
          </section>
        </main>
      </div>
      <Footer />

      {/* Enhanced Detailed Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
            <DialogContent className="p-0 rounded-3xl border border-gray-800 shadow-2xl overflow-hidden max-w-none! w-[calc(100%-100px)]! h-[calc(100%-100px)]! m-auto">
              <style jsx global>{`
                .custom-scrollbar {
                  scrollbar-width: thin;
                  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
                }

                .custom-scrollbar::-webkit-scrollbar {
                  width: 6px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                  background: transparent;
                  border-radius: 3px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: transparent;
                  border-radius: 3px;
                  transition: background 0.3s ease;
                }

                .custom-scrollbar:hover::-webkit-scrollbar-thumb,
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: rgba(20, 184, 166, 0.6);
                }

                .react-resizable-handle {
                  opacity: 0;
                  transition: opacity 0.3s ease;
                }

                .react-resizable:hover .react-resizable-handle {
                  opacity: 1;
                }

                .react-resizable-handle:hover {
                  background-color: rgba(20, 184, 166, 0.3) !important;
                }
              `}</style>
              <ResizableBox
                width={modalSize.width}
                height={modalSize.height}
                onResizeStop={(_e: React.SyntheticEvent, data: ResizeCallbackData) => setModalSize(data.size)}
                minConstraints={[400, 300]}
                maxConstraints={[viewportSize.width - 100, viewportSize.height - 100]}
                resizeHandles={["sw", "se", "nw", "ne", "w", "e", "n", "s"]}
                className="bg-black/95 backdrop-blur-xl text-white overflow-hidden rounded-3xl flex flex-col"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="h-full flex flex-col"
                >
                  {/* Header */}
                  <DialogHeader className="p-2 md:p-4 border-b border-gray-800 shrink-0 relative">
                    <div>
                      <DialogTitle className="text-xl md:text-2xl lg:text-3xl font-bold text-teal-400 leading-tight">
                        {selectedEvent?.title}
                      </DialogTitle>
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2 text-gray-400 text-xs md:text-sm">
                        <div className="flex items-center gap-1 md:gap-2">
                          <Calendar className="w-3 h-3 md:w-4 md:h-4 text-teal-400" />
                          <span>{new Date(selectedEvent.dateTime).toLocaleDateString()}</span>
                        </div>
                        {selectedEvent.location && (
                          <div className="flex items-center gap-1 md:gap-2">
                            <MapPin className="w-3 h-3 md:w-4 md:h-4 text-teal-400" />
                            <span>{selectedEvent.location}</span>
                          </div>
                        )}
                        {selectedEvent.attendeesCount && (
                          <div className="flex items-center gap-1 md:gap-2">
                            <Users className="w-3 h-3 md:w-4 md:h-4 text-teal-400" />
                            <span>{selectedEvent.attendeesCount} attendees</span>
                          </div>
                        )}
                      </div>
                      <DialogDescription className="text-gray-300 mt-2 text-sm md:text-base leading-relaxed line-clamp-2">
                        {selectedEvent?.shortDescription}
                      </DialogDescription>
                    </div>
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-400 transition-colors duration-200 p-1 rounded-full hover:bg-gray-800/50 focus:outline-none"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </DialogHeader>

                  {/* Content with Custom Scrollbar */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-2 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Media Gallery */}
                    <div className="bg-linear-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 rounded-2xl p-2 md:p-4 border border-gray-700/50">
                      <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4 text-teal-400">
                        Media Gallery
                      </h3>
                      <div className="relative">
                        <Carousel className="w-full" opts={{ loop: true }}>
                          <CarouselContent>
                            {selectedEvent?.images.map((img, index) => (
                              <CarouselItem key={index}>
                                <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-700/30">
                                  <Image
                                    src={img.asset.url}
                                    alt={`Event image ${index + 1}`}
                                    fill
                                    className="object-cover transition-all duration-500 hover:scale-105"
                                    unoptimized
                                  />
                                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                                </div>
                              </CarouselItem>
                            ))}
                            {selectedEvent?.videos &&
                              selectedEvent.videos.map((video, index) => (
                                <CarouselItem key={`video-${index}`}>
                                  <div className="space-y-2">
                                    <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-700/30">
                                      <video
                                        src={video.asset.url}
                                        controls
                                        className="w-full h-full object-contain bg-black"
                                      />
                                    </div>
                                    {video.caption && (
                                      <p className="text-gray-400 text-sm bg-gray-800/40 p-2 rounded-lg">
                                        {video.caption}
                                      </p>
                                    )}
                                  </div>
                                </CarouselItem>
                              ))}
                          </CarouselContent>
                          <CarouselPrevious />
                          <CarouselNext />
                          <CarouselDots />
                        </Carousel>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="bg-linear-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 rounded-2xl p-2 md:p-4 border border-gray-700/50">
                      <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4 bg-linear-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                        Event Details
                      </h3>
                      <div className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line bg-gray-900/30 p-2 md:p-4 rounded-2xl backdrop-blur-sm border border-gray-700/30">
                        {selectedEvent?.longDescription.map((block) => block.children.map((child) => child.text).join(" ")).join("\n\n")}
                      </div>
                    </div>

                    {/* Speakers */}
                    {selectedEvent?.speakers && (
                      <div className="bg-linear-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 rounded-2xl p-2 md:p-4 border border-gray-700/50">
                        <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4 bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                          Speakers
                        </h3>
                        <div className="flex flex-wrap gap-1 md:gap-2">
                          {selectedEvent.speakers.map((speaker, index) => (
                            <motion.span
                              key={index}
                              whileHover={{ scale: 1.05, y: -2 }}
                              className="bg-linear-to-r from-teal-600/30 to-cyan-600/30 text-teal-300 px-2 md:px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-teal-500/20 hover:border-teal-400/40 transition-all duration-300 shadow-lg"
                            >
                              {speaker}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {selectedEvent?.tags && (
                      <div className="bg-linear-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 rounded-2xl p-2 md:p-4 border border-gray-700/50">
                        <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4 text-teal-400">
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-1 md:gap-2">
                          {selectedEvent.tags.map((tag, index) => (
                            <motion.span
                              key={index}
                              whileHover={{ scale: 1.05, y: -2 }}
                              className="bg-linear-to-r from-teal-600/30 to-cyan-600/30 text-teal-300 px-2 md:px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-teal-500/20 hover:border-teal-400/40 transition-all duration-300 shadow-lg"
                            >
                              #{tag}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </ResizableBox>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}