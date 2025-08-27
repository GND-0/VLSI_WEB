"use client";

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Eye, CheckCircle, ExternalLink } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
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

// Skeleton Card
function SkeletonCard() {
  return (
    <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl animate-pulse shadow-xl">
      <div className="h-48 w-full bg-gray-800 rounded-lg mb-4"></div>
      <div className="h-6 bg-gray-800 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-800 rounded w-full mb-4"></div>
      <div className="h-4 bg-gray-800 rounded w-1/2"></div>
    </div>
  );
}

// Topic Card
function TopicCard({ topic, onOpen }: { topic: HotTopic; onOpen: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-black/60 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700/50 hover:border-blue-500/50"
    >
      <div className="flex justify-between items-start mb-4">
        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
          {topic.category}
        </Badge>
        {topic.isVerified && <CheckCircle className="w-5 h-5 text-green-400" />}
      </div>
      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
        {topic.title}
      </h3>
      <p className="text-gray-300 text-sm mb-4 line-clamp-3">{topic.summary}</p>
      <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {topic.views ?? 0}
        </div>
        <div className="flex items-center gap-1">
          <ThumbsUp className="w-4 h-4" />
          {topic.upvotes ?? 0}
        </div>
        <span>{new Date(topic.publishDate).toLocaleDateString()}</span>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={onOpen}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-purple-500 text-purple-300 hover:bg-purple-500/20 rounded-md text-sm font-medium transition-colors cursor-pointer"
        >
          Read Here
        </Button>
        <a
          href={topic.sourceUrl?.[0] || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-purple-500 text-purple-300 hover:bg-purple-500/20 rounded-md text-sm font-medium transition-colors"
        >
          Read Source <ExternalLink className="w-4 h-4 ml-2" />
        </a>
      </div>
    </motion.div>
  );
}

// Popup Component
function TopicPopup({
  topic,
  onClose,
  onUpvote,
  isUpvoted,
}: {
  topic: HotTopic | null;
  onClose: () => void;
  onUpvote: (topic: HotTopic) => void;
  isUpvoted: boolean;
}) {
  if (!topic) return null;

  const paragraphs = topic.summary.split("\n").filter((p) => p.trim());

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-black/95 backdrop-blur-xl text-white w-[95vw] h-[90vh] max-w-[95vw] !max-w-[95vw] p-6 rounded-2xl border-2 border-gray-700 shadow-2xl overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-gray-800 sticky top-0 bg-black/95 z-10">
          <DialogTitle className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            {topic.title}
          </DialogTitle>
          <div className="flex items-center gap-4 mt-2 text-gray-400 text-sm">
            <span>By {topic.author || "Unknown"}</span>
            <span>{new Date(topic.publishDate).toLocaleDateString()}</span>
            {topic.isVerified && (
              <Badge
                variant="secondary"
                className="bg-green-500/20 text-green-300"
              >
                Verified
              </Badge>
            )}
          </div>
        </DialogHeader>
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-120px)] custom-scrollbar">
          <div className="prose prose-invert prose-headings:text-white prose-a:text-blue-400 max-w-none">
            {paragraphs.map((para, index) => (
              <p key={index} className="mb-6 text-gray-300 text-lg">
                {para}
              </p>
            ))}
          </div>
          {topic.imagery && topic.imagery.length > 0 && (
            <div className="mt-10">
              <h4 className="text-2xl font-bold mb-6 text-white">Imagery</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topic.imagery.map((img, index) => (
                  <div key={index} className="relative">
                    {img.image?.asset?.url ? (
                      <Image
                        src={img.image.asset.url}
                        alt={img.description || "Imagery"}
                        width={600}
                        height={450}
                        className="w-full h-auto rounded-xl shadow-lg object-cover"
                      />
                    ) : (
                      <div className="w-full h-[450px] bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 text-lg">
                        Image not available
                      </div>
                    )}
                    <p className="mt-3 text-gray-400 text-base">
                      {img.description || "No description"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-10 flex items-center gap-8">
            <div className="flex items-center gap-3 text-gray-300 text-lg">
              <Eye className="w-6 h-6" />
              {topic.views ?? 0} Views
            </div>
            <Button
              variant="ghost"
              className={`flex items-center gap-3 text-lg ${isUpvoted ? 'text-green-400' : 'text-gray-300 hover:text-blue-400 cursor-pointer'}`}
              onClick={() => onUpvote(topic)}
            >
              <ThumbsUp className={`w-6 h-6 ${isUpvoted ? 'fill-green-400' : ''}`} />
              {topic.upvotes ?? 0} Upvotes
            </Button>
          </div>
          <div className="mt-8">
            <h4 className="text-2xl font-bold mb-6 text-white">Sources</h4>
            <ul className="space-y-3">
              {topic.sourceUrl.map((url, index) => (
                <li key={index}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-200 flex items-center gap-3 text-lg"
                  >
                    Source {index + 1} <ExternalLink className="w-5 h-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function VLSIPulse() {
  const [hotTopics, setHotTopics] = useState<HotTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<HotTopic | null>(null);
  const [upvotedTopics, setUpvotedTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/sanity");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setHotTopics(data.hotTopics || []);
      } catch (error) {
        console.error("Error fetching hot topics:", error);
        setError("Failed to load updates. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openPopup = async (topic: HotTopic) => {
    setSelectedTopic(topic);
    try {
      const response = await fetch("/api/sanity/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: topic._id, action: "incrementViews" }),
      });
      if (!response.ok) {
        console.error("Failed to increment views:", await response.text());
        return;
      }
      const data = await fetch("/api/sanity");
      if (!data.ok) throw new Error(`HTTP error! status: ${data.status}`);
      const updatedData = await data.json();
      setHotTopics(updatedData.hotTopics || []);
    } catch (err) {
      console.error("Error incrementing views:", err);
    }
  };

  const handleUpvote = async (topic: HotTopic) => {
    if (upvotedTopics.has(topic._id)) return; // Prevent multiple upvotes
    try {
      const response = await fetch("/api/sanity/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: topic._id, action: "incrementUpvotes" }),
      });
      if (!response.ok) {
        console.error("Failed to increment upvotes:", await response.text());
        return;
      }
      setUpvotedTopics((prev) => new Set(prev).add(topic._id));
      const data = await fetch("/api/sanity");
      if (!data.ok) throw new Error(`HTTP error! status: ${data.status}`);
      const updatedData = await data.json();
      setHotTopics(updatedData.hotTopics || []);
    } catch (err) {
      console.error("Error upvoting:", err);
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white ${inter.className}`}
    >
      <Header />
      <div className="relative flex flex-col flex-grow p-4 md:p-8">
        <main className="z-10 max-w-7xl mx-auto w-full">
          <section className="py-16">
            <h2 className="text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              VLSI Pulse: Latest Updates
            </h2>
            {error ? (
              <p className="text-red-400 text-center text-lg">{error}</p>
            ) : loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : hotTopics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {hotTopics.map((topic) => (
                  <TopicCard
                    key={topic._id}
                    topic={topic}
                    onOpen={() => openPopup(topic)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-lg">No updates available yet.</p>
            )}
          </section>
        </main>
      </div>
      <Footer />
      <TopicPopup
        topic={selectedTopic}
        onClose={() => setSelectedTopic(null)}
        onUpvote={handleUpvote}
        isUpvoted={upvotedTopics.has(selectedTopic?._id || '')}
      />
    </div>
  );
}