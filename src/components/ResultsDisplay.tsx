import { Zap, Target } from 'lucide-react';
import { SimulationResult } from '../pages/Simulation';

interface ResultsDisplayProps {
  result: SimulationResult;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 border border-[#00ff88]/20 shadow-lg shadow-[#00ff88]/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-[#00ff88]" />
          Explosion Events
        </h3>

        {result.explosions.length > 0 ? (
          <div className="space-y-2">
            <p className="text-gray-300 mb-3">
              Total Explosions: <span className="text-[#00ff88] font-bold">{result.explosions.length}</span>
            </p>
            <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
              {result.explosions.map((explosion, index) => (
                <div
                  key={index}
                  className="bg-[#0a0a23] px-4 py-2 rounded border border-[#00ff88]/20 text-gray-300"
                >
                  Explosion #{index + 1} at Event {explosion + 1}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-400 italic">No explosions occurred during simulation</p>
        )}
      </div>

      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 border border-[#00ff88]/20 shadow-lg shadow-[#00ff88]/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-[#00ff88]" />
          Query Result
        </h3>

        {result.kthExplosion !== null ? (
          <div className="space-y-4">
            <p className="text-gray-300">
              The requested explosion occurred at:
            </p>
            <div className="bg-gradient-to-r from-[#00ff88]/20 to-transparent border-l-4 border-[#00ff88] px-6 py-4 rounded">
              <p className="text-3xl font-bold text-[#00ff88]">
                Event {result.kthExplosion + 1}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
            Query out of range: Not enough explosions occurred
          </div>
        )}
      </div>
    </div>
  );
}
