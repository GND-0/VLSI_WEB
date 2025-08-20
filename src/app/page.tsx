import localFont from 'next/font/local';
import Header from '../components/header';
import Footer from '../components/footer';
import GlitchText from '../components/GlitchText';

// Load the custom font from the public directory
const customFont = localFont({
  src: '/../components/f1.ttf', // Updated to your font file path
  display: 'swap',
});

export default function Home() {
  return (
    <div className={`flex flex-col min-h-screen bg-black ${customFont.className}`}>
      <Header />
      <div
        className="relative flex flex-col items-center justify-center flex-grow p-8"
        style={{
          backgroundImage: "url('/image.png')", // Your starry background image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Hero Section */}
        <main className="z-10 flex flex-col items-center text-center">
          <GlitchText
            h1Text="GND_0 VLSI CLUB IIIT DHARWAD"
            initialH3Text="Bridging Academia and Industry in Semiconductor Design."
          />
        </main>
      </div>
      <Footer />
    </div>
  );
}