import { useState } from 'react';
import { Play } from 'lucide-react';

interface SimulationFormProps {
  onRun: (n: number, changes: number[], k: number, threshold: number) => void;
  isAnimating: boolean;
}

export default function SimulationForm({ onRun, isAnimating }: SimulationFormProps) {
  const [n, setN] = useState('10');
  const [changes, setChanges] = useState('15, 20, 30, 10, 25, 40, 15, 20, 35, 10');
  const [k, setK] = useState('2');
  const [threshold, setThreshold] = useState('100');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const nValue = parseInt(n);
    const changesArray = changes.split(',').map(c => parseInt(c.trim()));
    const kValue = parseInt(k);
    const thresholdValue = parseInt(threshold);

    if (isNaN(nValue) || nValue <= 0) {
      setError('N must be a positive number');
      return;
    }

    if (changesArray.length !== nValue) {
      setError(`Please provide exactly ${nValue} energy changes`);
      return;
    }

    if (changesArray.some(isNaN)) {
      setError('All energy changes must be valid numbers');
      return;
    }

    if (isNaN(kValue) || kValue <= 0) {
      setError('K must be a positive number');
      return;
    }

    if (isNaN(thresholdValue) || thresholdValue <= 0) {
      setError('Threshold must be a positive number');
      return;
    }

    onRun(nValue, changesArray, kValue, thresholdValue);
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 border border-[#00ff88]/20 shadow-lg shadow-[#00ff88]/10">
      <h2 className="text-2xl font-bold text-white mb-6">Configuration</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[#00ff88] font-semibold mb-2">
              Number of Events (N)
            </label>
            <input
              type="text"
              value={n}
              onChange={(e) => setN(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0a23] text-white border border-[#00ff88]/30 rounded-lg focus:outline-none focus:border-[#00ff88] transition-colors"
              placeholder="10"
              disabled={isAnimating}
            />
          </div>

          <div>
            <label className="block text-[#00ff88] font-semibold mb-2">
              Query (K)
            </label>
            <input
              type="text"
              value={k}
              onChange={(e) => setK(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0a23] text-white border border-[#00ff88]/30 rounded-lg focus:outline-none focus:border-[#00ff88] transition-colors"
              placeholder="2"
              disabled={isAnimating}
            />
          </div>
        </div>

        <div>
          <label className="block text-[#00ff88] font-semibold mb-2">
            Energy Changes (comma-separated)
          </label>
          <textarea
            value={changes}
            onChange={(e) => setChanges(e.target.value)}
            className="w-full px-4 py-3 bg-[#0a0a23] text-white border border-[#00ff88]/30 rounded-lg focus:outline-none focus:border-[#00ff88] transition-colors resize-none"
            rows={3}
            placeholder="15, 20, 30, 10, 25"
            disabled={isAnimating}
          />
        </div>

        <div>
          <label className="block text-[#00ff88] font-semibold mb-2">
            Explosion Threshold
          </label>
          <input
            type="text"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            className="w-full px-4 py-3 bg-[#0a0a23] text-white border border-[#00ff88]/30 rounded-lg focus:outline-none focus:border-[#00ff88] transition-colors"
            placeholder="100"
            disabled={isAnimating}
          />
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isAnimating}
          className="w-full px-8 py-4 bg-[#00ff88] text-black font-bold text-lg rounded-lg hover:bg-[#00ff88]/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#00ff88]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
        >
          <Play className="w-5 h-5" />
          <span>{isAnimating ? 'Simulating...' : 'Run Simulation'}</span>
        </button>
      </form>
    </div>
  );
}
