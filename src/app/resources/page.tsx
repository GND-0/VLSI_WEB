// src/app/resources/page.tsx
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
    <div className="bg-black/50 backdrop-blur-sm p-6 rounded-lg animate-pulse">
      <div className="h-48 w-full bg-gray-800 rounded-lg mb-4"></div>
      <div className="h-6 bg-gray-800 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-800 rounded w-full"></div>
    </div>
  );
}

// Hardware Card Component (Improved with better hover, shadow)
function HardwareCard({ item, onClick }: { item: Hardware; onClick: () => void }) {
  return (
    <div
      className="relative flex flex-col items-center text-center cursor-pointer bg-black/60 backdrop-blur-md p-6 rounded-xl shadow-lg hover:bg-black/80 hover:shadow-xl transition-all duration-300"
      onClick={onClick}
    >
      <div className="relative">
        <Image
          src={item.image?.asset?.url || '/placeholder.png'} // Fallback image
          alt={item.name}
          width={192}
          height={192}
          className="h-48 w-48 object-cover rounded-lg"
        />
        <span className="absolute top-2 right-2 bg-white/30 text-white px-3 py-1 rounded-full text-sm font-bold">
          x {item.count ?? 0}
        </span>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-white">{item.name}</h3>
      <p className="text-gray-400 text-sm mt-2 line-clamp-2">{item.shortDescription}</p>
    </div>
  );
}

// Drawer Component (Improved with fade-in, better close button, list styling)
function Drawer({ isOpen, onClose, item }: { isOpen: boolean; onClose: () => void; item: Hardware | null }) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-40 flex justify-end transition-opacity duration-300">
      <div className="h-full w-full max-w-md bg-black/90 backdrop-blur-lg p-8 overflow-y-auto shadow-2xl animate-slide-in">
        <button className="absolute top-4 right-4 text-white hover:text-gray-300" onClick={onClose}>
          ✕
        </button>
        <h2 className="text-3xl font-bold text-white mb-4">{item.name}</h2>
        <p className="text-gray-300 mb-6">{item.fullDescription}</p>
        <h3 className="text-xl font-semibold text-white mb-4">Learn More</h3>
        <ul className="space-y-3">
          {item.links?.map((link, index) => (
            <li key={index}>
              <a
                href={link.url}
                className="text-blue-400 hover:text-blue-200 flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.title}
              </a>
            </li>
          )) ?? <p className="text-gray-400">No links available.</p>}
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
      <div
        className="relative flex flex-col flex-grow p-4 md:p-8"
        style={{
          backgroundImage: "url('/image.png')",
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'top left',
        }}
      >
        <main className="z-10 max-w-7xl mx-auto w-full">
          {/* Resources Section */}
          <section className="py-12">
            <h2 className="text-4xl font-bold text-center mb-8">VLSI Resources</h2>
            <p className="text-gray-400 text-center mb-12 max-w-3xl mx-auto">
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
                <div key={category} className="mb-12">
                  <h3 className="text-2xl font-semibold mb-6">{category}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources
                      .filter((item) => item.category === category)
                      .map((item, index) => (
                        <div key={index} className="bg-black/60 backdrop-blur-md p-6 rounded-xl shadow-lg hover:bg-black/80 hover:shadow-xl transition-all duration-300">
                          <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                          <p className="text-gray-500 text-sm mb-2">{item.type}</p>
                          <p className="text-gray-400 mb-4 line-clamp-3">{item.description}</p>
                          <a
                            href={item.file?.asset?.url || '#'}
                            className="text-blue-400 hover:text-blue-200 text-sm"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download/View
                          </a>
                        </div>
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No resources available.</p>
            )}
          </section>

          {/* Hardware Section */}
          <section className="py-12">
            <h2 className="text-4xl font-bold text-center mb-8">Hardware Component Availability</h2>
            <p className="text-gray-400 text-center mb-12">
              This information involves the list and the number of hardware components available with the club as of 11:05 PM IST on Thursday, August 21, 2025.
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
              <p className="text-center">No hardware components available.</p>
            )}
          </section>
        </main>
      </div>
      <Footer />
      <Drawer isOpen={!!selectedHardware} onClose={() => setSelectedHardware(null)} item={selectedHardware} />
    </div>
  );
}