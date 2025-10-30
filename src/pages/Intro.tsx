import { useNavigate } from 'react-router-dom';
import { Brain, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import bgImage from '../components/image.png';

export default function Intro() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#050512] flex items-center justify-center p-6 relative z-10">
      {/* Page background image (subtle) */}
      <div
        className="fixed inset-0 bg-cover bg-center pointer-events-none z-0"
        style={{ backgroundImage: `url(${bgImage})`, opacity: 0.25 }}
        aria-hidden
      />

      {/* Animated Background Lightning */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, #00ff8820 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, #00ff8820 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, #00ff8820 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="max-w-3xl w-full space-y-8 animate-fadeIn">

        
        <div className="text-center mb-8">
          <Brain className="w-16 h-16 mx-auto text-[#00ff88] mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Prefix Sum Simulator
            
          </h1>
          <div className="w-24 h-1 bg-[#00ff88] mx-auto rounded-full"></div>
        </div>

        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 border border-[#00ff88]/20 shadow-lg shadow-[#00ff88]/10 space-y-6">
          <div className="flex items-start space-x-4">
            <Zap className="w-8 h-8 text-[#00ff88] flex-shrink-0 mt-1" />
            <p className="text-gray-300 text-lg leading-relaxed">
              Shigeo Kageyama, known as <span className="text-[#00ff88] font-semibold">Mob</span>,
              accumulates psychic energy from various events throughout his day.
            </p>
          </div>

          <div className="flex items-start space-x-4">
            <TrendingUp className="w-8 h-8 text-[#00ff88] flex-shrink-0 mt-1" />
            <p className="text-gray-300 text-lg leading-relaxed">
              When his energy reaches <span className="text-[#00ff88] font-semibold">100%</span>,
              he experiences an explosive psychic release, resetting his energy back to 0.
            </p>
          </div>

          <div className="border-t border-[#00ff88]/20 pt-6 mt-6">
            <p className="text-gray-300 text-lg leading-relaxed">
              
              In this simulator, you'll input <span className="text-[#00ff88] font-semibold">N events</span> with
              their energy changes, track all explosions, and query the <span className="text-[#00ff88] font-semibold">Kth explosion</span> to
              analyze Mob's psychic patterns.
            </p>
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={() => navigate('/simulation')}
              className="px-8 py-4 bg-[#00ff88] text-black font-bold text-lg rounded-lg hover:bg-[#00ff88]/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#00ff88]/50"
            >
              Begin Simulation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
