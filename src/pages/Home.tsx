import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import bgImage from '../components/image.png';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#050512] flex flex-col items-center justify-center p-6 animate-fadeIn relative overflow-hidden">
      {/* Background image (less transparent) */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
        style={{ backgroundImage: `url(${bgImage})`, opacity: 0.4 }}
        aria-hidden
      />

      <div className="max-w-4xl w-full text-center space-y-8 relative z-10">
        <div className="relative mb-8">
          <Zap className="w-24 h-24 mx-auto text-[#00ff88] animate-pulse" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-slideDown">
          Mob Psycho 100
        </h1>

        <h2 className="text-2xl md:text-3xl font-light text-[#00ff88] mb-8 animate-slideDown">
          Psychic Energy Simulator Using Prefix Sum
        </h2>

        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 border border-[#00ff88]/20 shadow-lg shadow-[#00ff88]/10 animate-slideUp">
          <p className="text-gray-300 text-lg mb-6">
            Experience the power of psychic energy accumulation and explosive releases
          </p>

          <button
            onClick={() => navigate('/intro')}
            className="px-8 py-4 bg-[#00ff88] text-black font-bold text-lg rounded-lg hover:bg-[#00ff88]/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#00ff88]/50"
          >
            Start Simulation
          </button>
        </div>
      </div>
    </div>
  );
}
