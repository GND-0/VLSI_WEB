// app/resources/page.tsx
"use client";

import { Inter } from 'next/font/google';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { useState, useEffect } from 'react';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
});

// Hardware Card Component
function HardwareCard({ item, onClick }: { item: any; onClick: () => void }) {
  return (
    <div
      className="relative flex flex-col items-center text-center cursor-pointer bg-black/50 backdrop-blur-sm p-4 rounded-lg hover:bg-black/70 transition-colors"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={item.image?.asset?.url}
          alt={item.name}
          className="h-48 w-48 object-cover rounded-lg"
        />
        <span className="absolute top-2 right-2 bg-white/20 text-white px-2 py-1 rounded-full text-sm font-bold">
          X {item.count}
        </span>
      </div>
      <h3 className="mt-1 text-lg font-semibold text-white">{item.name}</h3>
      <p className="text-gray-300 text-sm line-clamp-2">{item.shortDescription}</p>
    </div>
  );
}

// Drawer Component
function Drawer({ isOpen, onClose, item }: { isOpen: boolean; onClose: () => void; item: any | null }) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-1/3 bg-black/90 backdrop-blur-md p-8 overflow-y-auto z-30">
      <button className="absolute top-4 right-4 text-white" onClick={onClose}>
        Close
      </button>
      <h2 className="text-2xl font-bold text-white mb-4">{item.name}</h2>
      <p className="text-gray-300 mb-6">{item.fullDescription}</p>
      <h3 className="text-lg font-semibold text-white mb-2">Learn More</h3>
      <ul className="space-y-2">
        {item.links?.map((link: any, index: number) => (
          <li key={index}>
            <a href={link.url} className="text-blue-300 hover:text-blue-100" target="_blank" rel="noopener noreferrer">
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Resources() {
  const [resources, setResources] = useState<any[]>([]);
  const [hardware, setHardware] = useState<any[]>([]);
  const [selectedHardware, setSelectedHardware] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/sanity');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setResources(data.resources);
        setHardware(data.hardware);
        console.log('Fetched data:', data);
      } catch (error) {
        console.error('Error fetching data from API:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={`flex flex-col min-h-screen bg-black ${inter.className}`}>
      <Header />
      <div
        className="relative flex flex-col flex-grow p-8"
        style={{
          backgroundImage: "url('/image.png')",
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'top left',
          imageRendering: 'pixelated',
        }}
      >
        <main className="z-10 max-w-7xl mx-auto w-full">
          {/* Resources Sections */}
          <section className="py-12">
            <h2 className="text-3xl font-bold text-white text-center mb-8">VLSI Resources</h2>
            <p className="text-gray-300 text-center mb-12 max-w-3xl mx-auto">
              Explore curated resources on VLSI design, categorized for easy navigation. From foundational books to advanced tutorials, these materials are selected to bridge theoretical knowledge with practical application in semiconductor design.
            </p>
            {loading ? (
              <p className="text-white text-center">Loading resources...</p>
            ) : Array.from(new Set(resources.map((r) => r.category))).length > 0 ? (
              Array.from(new Set(resources.map((r) => r.category))).map((category) => (
                <div key={category} className="mb-12">
                  <h3 className="text-2xl font-semibold text-white mb-6">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources
                      .filter((item) => item.category === category)
                      .map((item, index) => (
                        <div key={index} className="bg-black/50 backdrop-blur-sm p-6 rounded-lg hover:bg-black/70 transition-colors">
                          <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                          <p className="text-gray-400 text-sm mb-2">{item.type}</p>
                          <p className="text-gray-300 mb-4 line-clamp-3">{item.description}</p>
                          <a href={item.file?.asset?.url} className="text-blue-300 hover:text-blue-100 text-sm" target="_blank" rel="noopener noreferrer">
                            Download/View
                          </a>
                        </div>
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white text-center">No resources available.</p>
            )}
          </section>

          {/* Hardware Component Availability */}
          <section className="py-12">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Hardware Component Availability</h2>
            <p className="text-gray-300 text-center mb-12">
              This information involves the list and the number of hardware components available with the club as of 11:05 PM IST on Thursday, August 21, 2025.
            </p>
            {loading ? (
              <p className="text-white text-center">Loading hardware...</p>
            ) : hardware.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hardware.map((item, index) => (
                  <HardwareCard key={index} item={item} onClick={() => setSelectedHardware(item)} />
                ))}
              </div>
            ) : (
              <p className="text-white text-center">No hardware components available.</p>
            )}
          </section>
        </main>
      </div>
      <Footer />
      <Drawer isOpen={!!selectedHardware} onClose={() => setSelectedHardware(null)} item={selectedHardware} />
    </div>
  );
}