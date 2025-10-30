import { useEffect, useState } from 'react';

interface EnergyBarProps {
  currentEnergy: number;
  threshold: number;
  exploded: boolean;
}

export default function EnergyBar({ currentEnergy, threshold, exploded }: EnergyBarProps) {
  const [isFlashing, setIsFlashing] = useState(false);
  const percentage = Math.min((currentEnergy / threshold) * 100, 100);

  useEffect(() => {
    if (exploded) {
      setIsFlashing(true);
      const timer = setTimeout(() => setIsFlashing(false), 600);
      return () => clearTimeout(timer);
    }
  }, [exploded]);

  return (
    <div className="space-y-4">
      <div className="relative h-12 bg-[#0a0a23] rounded-lg border-2 border-[#00ff88]/30 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            isFlashing
              ? 'bg-red-500 animate-pulse'
              : 'bg-gradient-to-r from-[#00ff88] to-[#00cc6a]'
          }`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-lg z-10 drop-shadow-lg">
            {currentEnergy}%
          </span>
        </div>
      </div>

      {exploded && (
        <div className="text-center">
          <span className="inline-block px-4 py-2 bg-red-500 text-white font-bold rounded-lg animate-bounce">
            EXPLOSION! Energy Reset
          </span>
        </div>
      )}
    </div>
  );
}
