"use client";

import { Inter } from 'next/font/google';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
});

// Skeleton Loader Component
function SkeletonCard() {
  return (
    <div className="bg-slate-900/85 backdrop-blur-xl p-5 rounded-xl border border-gray-700/30 animate-pulse">
      <div className="h-36 w-full bg-gray-800/50 rounded-lg mb-3"></div>
      <div className="h-5 bg-gray-800/50 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-800/50 rounded w-full"></div>
    </div>
  );
}

// Hardware Card Component
function HardwareCard({ item, onClick }: { item: Hardware; onClick: () => void }) {
  return (
    <div
      className="group flex flex-col items-center text-center cursor-pointer bg-slate-900/85 backdrop-blur-xl p-5 rounded-xl border border-gray-700/30 hover:border-teal-500/40 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-500 hover:-translate-y-1.5"
      onClick={onClick}
    >
      <div className="relative w-full aspect-square max-w-37.5 sm:max-w-45">
        <Image
          src={item.image?.asset?.url || '/placeholder.png'}
          alt={item.name}
          fill
          className="object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 150px, 180px"
        />
        <span className="absolute top-2 right-2 bg-slate-900/90 backdrop-blur-md text-white px-2 py-1 rounded-full text-xs font-medium border border-gray-700/50">
          x{item.count ?? 0}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white group-hover:text-teal-400 transition-colors">{item.name}</h3>
      <p className="text-gray-400 text-sm mt-2 line-clamp-2">{item.shortDescription}</p>
    </div>
  );
}

// Drawer Component
function Drawer({ isOpen, onClose, item }: { isOpen: boolean; onClose: () => void; item: Hardware | null }) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-40 flex justify-end">
      <div className="h-full w-full sm:max-w-md bg-gray-900 p-6 sm:p-8 overflow-y-auto border-l border-gray-800">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl p-2 transition-colors"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">{item.name}</h2>
        <p className="text-gray-400 text-sm mb-6">{item.fullDescription}</p>
        <h3 className="text-lg font-semibold text-white mb-3">Learn More</h3>
        <ul className="space-y-2">
          {item.links?.map((link, index) => (
            <li key={index}>
              <a
                href={link.url}
                className="text-teal-400 hover:text-teal-300 text-sm transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.title}
              </a>
            </li>
          )) ?? <p className="text-gray-500 text-sm">No links available.</p>}
        </ul>
      </div>
    </div>
  );
}

interface Resource {
  category: string;
  title: string;
  type: string;
  description: string;
  file?: { asset?: { url: string } };
}

interface Hardware {
  name: string;
  count: number;
  shortDescription: string;
  fullDescription: string;
  image?: { asset?: { url: string } };
  links?: Array<{ title: string; url: string }>;
}

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [hardware, setHardware] = useState<Hardware[]>([]);
  const [selectedHardware, setSelectedHardware] = useState<Hardware | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/sanity');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setResources(data.resources || []);
        setHardware(data.hardware || []);
        console.log('Fetched data:', data);
      } catch (error) {
        console.error('Error fetching data from API:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={`flex flex-col min-h-screen bg-black text-white ${inter.className}`}>
      <Header />
      <div className="relative flex flex-col grow p-4 sm:p-8 mt-16">
        {/* Grid Background Pattern */}
        <div
          className="absolute inset-0 [background-size:20px_20px] [background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        />
        <div className="pointer-events-none absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        
        <main className="z-10 max-w-7xl mx-auto w-full">
          {/* Resources Section */}
          <section className="py-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-teal-400">
              VLSI Resources
            </h2>
            <p className="text-gray-400 text-center mb-10 text-sm sm:text-base max-w-2xl mx-auto">
              Explore curated resources on VLSI design, categorized for easy navigation. From foundational books to advanced tutorials, these materials are selected to bridge theoretical knowledge with practical application in semiconductor design.
            </p>
            {error ? (
              <p className="text-red-400 text-center">{error}</p>
            ) : loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : resources.length > 0 ? (
              Array.from(new Set(resources.map((r) => r.category))).map((category) => (
                <div key={category} className="mb-10">
                  <h3 className="text-xl font-semibold mb-4 text-gray-200">{category}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources
                      .filter((item) => item.category === category)
                      .map((item, index) => (
                        <div
                          key={index}
                          className="bg-gray-900/60 backdrop-blur-sm p-5 rounded-xl border border-gray-800/50 hover:border-gray-700 transition-all duration-300"
                        >
                          <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                          <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">{item.type}</p>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-3">{item.description}</p>
                          <a
                            href={item.file?.asset?.url || '#'}
                            className="inline-flex items-center text-teal-400 hover:text-teal-300 text-sm transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download/View →
                          </a>
                        </div>
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">No resources available.</p>
            )}
          </section>

          {/* Hardware Section */}
          <section className="py-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Hardware Component Availability
            </h2>
            <p className="text-gray-400 text-center mb-10 text-sm sm:text-base">
              This information involves the list and the number of hardware components available with the club.
            </p>
            {error ? (
              <p className="text-red-400 text-center">{error}</p>
            ) : loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : hardware.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {hardware.map((item, index) => (
                  <HardwareCard key={index} item={item} onClick={() => setSelectedHardware(item)} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400">No hardware components available.</p>
            )}
          </section>
        </main>
      </div>
      <Footer />
      <Drawer isOpen={!!selectedHardware} onClose={() => setSelectedHardware(null)} item={selectedHardware} />
    </div>
  );
}