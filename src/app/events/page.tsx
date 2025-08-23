"use client";

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import Image from "next/image";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Calendar, MapPin, Users, Clock, ExternalLink, Sparkles, X } from "lucide-react";
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
    <motion.div
      whileHover={{
        scale: 1.05,
        rotateY: 5,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        transition: { duration: 0.3 },
      }}
      className="bg-black/40 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-800 hover:border-blue-500 transition-all duration-300"
    >
      <h4 className="text-xl font-semibold text-white mb-3">{event.title}</h4>
      <p className="text-gray-400 text-sm mb-2">{new Date(event.dateTime).toLocaleString()}</p>
      <p className="text-gray-300">{event.description}</p>
    </motion.div>
  );
}

// Detailed Event Card
function DetailedEventCard({ event, onClick }: { event: EventDetailed; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        rotateY: 5,
        boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.15)",
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.98 }}
      className="bg-black/40 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-800 hover:border-blue-500 transition-all duration-300 cursor-pointer group relative overflow-hidden"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <h4 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
          {event.title}
        </h4>
        <p className="text-gray-400 text-sm mb-2">{new Date(event.dateTime).toLocaleString()}</p>
        <p className="text-gray-300 line-clamp-3">{event.shortDescription}</p>
        <div className="flex items-center gap-4 mt-3">
          {event.images.length > 0 && (
            <span className="text-blue-300 text-sm flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              {event.images.length} images
            </span>
          )}
          {event.videos && event.videos.length > 0 && (
            <span className="text-purple-300 text-sm flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              {event.videos.length} videos
            </span>
          )}
        </div>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ExternalLink className="w-5 h-5 text-blue-400" />
        </div>
      </div>
    </motion.div>
  );
}

// Enhanced Upcoming Event Component
function UpcomingEventCard({ event }: { event: UpcomingEvent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        scale: 1.03,
        rotateY: 3,
        boxShadow: "0 25px 50px -12px rgba(34, 197, 94, 0.2)",
        transition: { duration: 0.3 },
      }}
      className="bg-gradient-to-br from-black/60 via-gray-900/40 to-black/60 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 hover:border-green-400 transition-all duration-500 overflow-hidden group relative"
    >
      {/* Live indicator */}
      {event.isLive && (
        <div className="absolute top-4 right-4 z-20">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Live Now!
          </motion.div>
        </div>
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Image Section */}
      {event.images.length > 0 && (
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-1 h-full"
          >
            {event.images.slice(0, 4).map((img, index) => (
              <div key={index} className={`relative ${index === 0 ? "col-span-2" : ""} ${index >= 2 ? "h-24" : "h-full"}`}>
                <Image
                  src={img.asset.url}
                  alt="Upcoming event image"
                  fill
                  className="object-cover transition-all duration-500 group-hover:brightness-110"
                  unoptimized
                />
              </div>
            ))}
          </motion.div>
          {event.images.length > 4 && (
            <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-sm z-20">
              +{event.images.length - 4} more
            </div>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className="p-6 relative z-10">
        <h4 className="text-2xl font-bold text-white mb-3 group-hover:text-green-300 transition-colors duration-300">
          {event.title}
        </h4>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4 text-green-400" />
            <span className="text-sm">
              {event.tentativeDates.length > 1
                ? `${new Date(event.tentativeDates[0]).toLocaleDateString()} - ${new Date(
                    event.tentativeDates[event.tentativeDates.length - 1]
                  ).toLocaleDateString()}`
                : new Date(event.tentativeDates[0]).toLocaleDateString()}
            </span>
          </div>

          {event.venue && (
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-4 h-4 text-green-400" />
              <span className="text-sm">{event.venue}</span>
            </div>
          )}
        </div>

        <p className="text-gray-300 text-sm leading-relaxed mb-6">{event.description}</p>

        {/* Action Button */}
        {event.isLive && event.registrationLink && (
          <motion.a
            href={event.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
          >
            <ExternalLink className="w-4 h-4" />
            Register Now
          </motion.a>
        )}

        {!event.isLive && (
          <div className="inline-flex items-center gap-2 bg-gray-600/20 text-gray-400 px-6 py-3 rounded-xl font-semibold cursor-not-allowed">
            <Clock className="w-4 h-4" />
            Coming Soon
          </div>
        )}
      </div>
    </motion.div>
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
    <div className={`flex flex-col min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white ${inter.className}`}>
      <Header />
      <div className="relative flex flex-col flex-grow p-4 md:p-8">
        <main className="z-10 max-w-7xl mx-auto w-full">
          {/* Vertical Timeline */}
          <section className="py-16">
            <h2 className="text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Event Timeline
            </h2>
            {error ? (
              <p className="text-red-400 text-center text-lg">{error}</p>
            ) : loading ? (
              <div className="flex justify-center">
                <SkeletonCard />
              </div>
            ) : events.length > 0 ? (
              <VerticalTimeline lineColor="#4A90E2">
                {events.map((event, index) => (
                  <VerticalTimelineElement
                    key={index}
                    date={new Date(event.dateTime).toLocaleDateString()}
                    iconStyle={{ background: "linear-gradient(45deg, #4A90E2, #9013FE)", color: "#fff" }}
                    contentStyle={{ background: "rgba(26, 26, 26, 0.9)", color: "#fff", backdropFilter: "blur(10px)" }}
                    contentArrowStyle={{ borderRight: "7px solid rgba(26, 26, 26, 0.9)" }}
                  >
                    {"shortDescription" in event ? (
                      <DetailedEventCard event={event} onClick={() => setSelectedEvent(event)} />
                    ) : (
                      <SimpleEventCard event={event} />
                    )}
                  </VerticalTimelineElement>
                ))}
              </VerticalTimeline>
            ) : (
              <p className="text-center text-lg">No events available.</p>
            )}
          </section>

          {/* Upcoming Events */}
          <section className="py-16">
            <h2 className="text-5xl font-extrabold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
              Upcoming Events
            </h2>
            {error ? (
              <p className="text-red-400 text-center text-lg">{error}</p>
            ) : loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {upcomingEvents.map((event) => (
                  <UpcomingEventCard key={event._id} event={event} />
                ))}
              </div>
            ) : (
              <p className="text-center text-lg">No upcoming events.</p>
            )}
          </section>
        </main>
      </div>
      <Footer />

      {/* Enhanced Detailed Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
            <DialogContent className="p-0 rounded-3xl border border-gray-800 shadow-2xl overflow-hidden !max-w-none !w-[calc(100%-100px)] !h-[calc(100%-100px)] m-auto">
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
                  background: rgba(147, 51, 234, 0.6);
                }

                .react-resizable-handle {
                  opacity: 0;
                  transition: opacity 0.3s ease;
                }

                .react-resizable:hover .react-resizable-handle {
                  opacity: 1;
                }

                .react-resizable-handle:hover {
                  background-color: rgba(147, 51, 234, 0.3) !important;
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
                      <DialogTitle className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent leading-tight">
                        {selectedEvent?.title}
                      </DialogTitle>
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2 text-gray-400 text-xs md:text-sm">
                        <div className="flex items-center gap-1 md:gap-2">
                          <Calendar className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
                          <span>{new Date(selectedEvent.dateTime).toLocaleDateString()}</span>
                        </div>
                        {selectedEvent.location && (
                          <div className="flex items-center gap-1 md:gap-2">
                            <MapPin className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
                            <span>{selectedEvent.location}</span>
                          </div>
                        )}
                        {selectedEvent.attendeesCount && (
                          <div className="flex items-center gap-1 md:gap-2">
                            <Users className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
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
                    <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 rounded-2xl p-2 md:p-4 border border-gray-700/50">
                      <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Media Gallery
                      </h3>
                      <div className="relative h-[400px]">
                        <Carousel className="w-2xl">
                          <CarouselContent className="-ml-1 md:-ml-2">
                            {selectedEvent?.images.map((img, index) => (
                              <CarouselItem key={index} className="pl-1 md:pl-2 basis-full">
                                <motion.div
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ duration: 0.3 }}
                                  className="relative aspect-[16/9] overflow-hidden shadow-2xl border border-gray-700/50 rounded-2xl"
                                >
                                  <Image
                                    src={img.asset.url}
                                    alt={`Event image ${index + 1}`}
                                    fill
                                    className="object-cover transition-all duration-500 hover:brightness-110"
                                    unoptimized
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </motion.div>
                              </CarouselItem>
                            ))}
                            {selectedEvent?.videos &&
                              selectedEvent.videos.map((video, index) => (
                                <CarouselItem key={`video-${index}`} className="pl-1 md:pl-2 basis-full">
                                  <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-2 md:space-y-3"
                                  >
                                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50">
                                      <video
                                        src={video.asset.url}
                                        controls
                                        className="w-full h-full object-contain bg-black/50 backdrop-blur-sm"
                                      />
                                    </div>
                                    {video.caption && (
                                      <p className="text-gray-400 text-xs md:text-sm bg-gray-800/30 p-1 md:p-2 rounded-lg backdrop-blur-sm">
                                        {video.caption}
                                      </p>
                                    )}
                                  </motion.div>
                                </CarouselItem>
                              ))}
                          </CarouselContent>
                          <CarouselPrevious className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-purple-600/80 border-gray-600 hover:border-purple-500 transition-all duration-300 shadow-lg" />
                          <CarouselNext className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-purple-600/80 border-gray-600 hover:border-purple-500 transition-all duration-300 shadow-lg" />
                        </Carousel>
                        <div className="absolute top-1 md:top-2 right-1 md:right-2 bg-black/70 backdrop-blur-sm text-white px-2 md:px-3 py-1 rounded-xl text-xs font-medium shadow-lg border border-gray-700/50">
                          {selectedEvent?.images.length || 0} Images
                          {selectedEvent?.videos && selectedEvent.videos.length > 0 && ` • ${selectedEvent.videos.length} Videos`}
                        </div>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 rounded-2xl p-2 md:p-4 border border-gray-700/50">
                      <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Event Details
                      </h3>
                      <div className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line bg-gray-900/30 p-2 md:p-4 rounded-2xl backdrop-blur-sm border border-gray-700/30">
                        {selectedEvent?.longDescription.map((block) => block.children.map((child) => child.text).join(" ")).join("\n\n")}
                      </div>
                    </div>

                    {/* Speakers */}
                    {selectedEvent?.speakers && (
                      <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 rounded-2xl p-2 md:p-4 border border-gray-700/50">
                        <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                          Speakers
                        </h3>
                        <div className="flex flex-wrap gap-1 md:gap-2">
                          {selectedEvent.speakers.map((speaker, index) => (
                            <motion.span
                              key={index}
                              whileHover={{ scale: 1.05, y: -2 }}
                              className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-blue-300 px-2 md:px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 shadow-lg"
                            >
                              {speaker}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {selectedEvent?.tags && (
                      <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 rounded-2xl p-2 md:p-4 border border-gray-700/50">
                        <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-1 md:gap-2">
                          {selectedEvent.tags.map((tag, index) => (
                            <motion.span
                              key={index}
                              whileHover={{ scale: 1.05, y: -2 }}
                              className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-300 px-2 md:px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 shadow-lg"
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