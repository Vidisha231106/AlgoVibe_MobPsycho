import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, BookOpen, TrendingUp, Zap } from 'lucide-react';
import bgImage from '../components/image.png';
import explodeImg from '../components/explode.jpg';

export default function Simulation() {
  const [n, setN] = useState(10);
  const [threshold, setThreshold] = useState(100);
  const [currentEnergy, setCurrentEnergy] = useState(0);
  const [step, setStep] = useState(1);
  const [explosionList, setExplosionList] = useState<number[]>([]);
  const [prefixSum, setPrefixSum] = useState<number[]>([0]);
  const [energyChange, setEnergyChange] = useState('');
  const [history, setHistory] = useState<Array<{
    step: number;
    change: number;
    energyBefore: number;
    energyAfter: number;
    exploded: boolean;
    prefixBefore: number;
    prefixAfter: number;
  }>>([]);
  const [queryK, setQueryK] = useState('');
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [isExplosion, setIsExplosion] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleAddEnergy = () => {
    const change = parseInt(energyChange);
    if (isNaN(change) || change < -100 || change > 100) {
      alert('Please enter a valid energy change between -100 and 100');
      return;
    }

    if (step > n) {
      alert('Simulation complete! Reset to add more events.');
      return;
    }

    const newEnergy = currentEnergy + change;
    const newPrefixSum = [...prefixSum, newEnergy];
    
    let exploded = false;
    let finalEnergy = newEnergy;

    if (newEnergy >= threshold) {
      exploded = true;
      setExplosionList([...explosionList, step]);
      finalEnergy = 0;
      setIsExplosion(true);
      // Keep the explosion swirl visible longer so the effect is more pronounced
      // Timeout should match the motion image exit duration below.
      setTimeout(() => setIsExplosion(false), 2200);
    }

    setHistory([...history, {
      step,
      change,
      energyBefore: currentEnergy,
      energyAfter: finalEnergy,
      exploded,
      prefixBefore: currentEnergy,
      prefixAfter: newEnergy
    }]);

    setPrefixSum(newPrefixSum);
    setCurrentEnergy(finalEnergy);
    setEnergyChange('');

    if (step === n) {
      setIsComplete(true);
    }
    
    setStep(step + 1);
  };

  const handleReset = () => {
    setCurrentEnergy(0);
    setStep(1);
    setExplosionList([]);
    setPrefixSum([0]);
    setHistory([]);
    setEnergyChange('');
    setQueryK('');
    setQueryResult(null);
    setIsExplosion(false);
    setIsComplete(false);
  };

  const handleQuery = () => {
    const k = parseInt(queryK);
    if (isNaN(k) || k <= 0) {
      setQueryResult('Invalid query');
      return;
    }

    if (k > explosionList.length) {
      setQueryResult('NEVER');
    } else {
      setQueryResult(`Event ${explosionList[k - 1]}`);
    }
  };

  const percentage = Math.min((currentEnergy / threshold) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#050512] p-6 relative overflow-hidden">
      {/* Page background image (subtle) */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
        style={{ backgroundImage: `url(${bgImage})`, opacity: 0.25 }}
        aria-hidden
      />

      {/* Animated Background - keeping this separate from lightning */}
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

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mb-4"
          >
            <BookOpen className="w-10 h-10 text-[#00ff88] mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Step-by-Step Learning Mode
            </h1>
          </motion.div>
          <p className="text-gray-400 text-lg">
            Understand the DSA concepts behind Mob's psychic energy simulation
          </p>
        </div>

        {/* Configuration */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-[#00ff88]/20">
            <label className="block text-[#00ff88] font-semibold mb-2">
              Total Events (N)
            </label>
            <input
              type="number"
              value={n}
              onChange={(e) => setN(parseInt(e.target.value) || 1)}
              disabled={step > 1}
              className="w-full px-4 py-3 bg-[#0a0a23] text-white border border-[#00ff88]/30 rounded-lg focus:outline-none focus:border-[#00ff88] transition-colors disabled:opacity-50"
            />
          </div>

          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-[#00ff88]/20">
            <label className="block text-[#00ff88] font-semibold mb-2">
              Explosion Threshold
            </label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value) || 100)}
              disabled={step > 1}
              className="w-full px-4 py-3 bg-[#0a0a23] text-white border border-[#00ff88]/30 rounded-lg focus:outline-none focus:border-[#00ff88] transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        {/* Power Bar */}
        <motion.div
          className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-[#00ff88]/20 mb-6"
          animate={isExplosion ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between mb-3">
            <span className="text-[#00ff88] font-bold text-lg">PSYCHIC ENERGY</span>
            <span className="text-white font-bold text-lg">{currentEnergy}%</span>
          </div>

          <div className="relative h-16 bg-black/60 rounded-lg border-2 border-[#00ff88]/30 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0"
              animate={{
                width: `${percentage}%`,
                background: isExplosion
                  ? 'linear-gradient(to right, #ff0055, #ff3377)'
                  : 'linear-gradient(to right, #00ff88, #00ffaa)'
              }}
              transition={{ width: { type: 'spring', stiffness: 100, damping: 20 } }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              />
            </motion.div>

            {percentage > 80 && !isExplosion && (
              <motion.div
                className="absolute inset-0 bg-red-500/20"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              />
            )}
          </div>

          <AnimatePresence>
            {isExplosion && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="text-center mt-4"
              >
                <span className="inline-block px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg shadow-lg">
                  💥 EXPLOSION! Energy Reset to 0
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Input Section */}
        {!isComplete && (
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-[#00ff88]/20 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Event {step} of {n}
            </h2>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-[#00ff88] font-semibold mb-2">
                  Energy Change (-100 to 100)
                </label>
                <input
                  type="number"
                  value={energyChange}
                  onChange={(e) => setEnergyChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddEnergy()}
                  placeholder="e.g., 15, -20, 30"
                  className="w-full px-4 py-3 bg-[#0a0a23] text-white border border-[#00ff88]/30 rounded-lg focus:outline-none focus:border-[#00ff88] transition-colors"
                />
              </div>

              <button
                onClick={handleAddEnergy}
                className="px-8 py-3 bg-[#00ff88] text-black font-bold rounded-lg hover:bg-[#00ff88]/90 transition-all duration-300 hover:scale-105 flex items-center gap-2 self-end"
              >
                <Play className="w-5 h-5" />
                Add Energy
              </button>
            </div>
          </div>
        )}

        {/* Educational Comments */}
        {history.length > 0 && (
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-[#00ff88]/20 mb-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-[#00ff88]" />
              DSA Concepts Explained
            </h3>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {history.map((entry, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-[#0a0a23]/60 rounded-lg p-4 border-l-4 border-[#00ff88]"
                >
                  <div className="text-sm text-gray-400 mb-2">Event {entry.step}</div>
                  
                  <div className="space-y-2 text-gray-300">
                    <p>
                      <span className="text-[#00ff88] font-semibold">Input:</span> Energy change = {entry.change >= 0 ? '+' : ''}{entry.change}
                    </p>
                    
                    <p>
                      <span className="text-[#00ff88] font-semibold">Prefix Sum Concept:</span> Running total (before reset) = {entry.prefixAfter}
                      <br />
                      <span className="text-xs text-gray-500">
                        This tracks cumulative energy: [{prefixSum.slice(0, idx + 2).join(', ')}]
                      </span>
                    </p>

                    <p>
                      <span className="text-[#00ff88] font-semibold">Simulation Logic:</span>
                      <br />
                      Energy: {entry.energyBefore} + {entry.change} = {entry.prefixAfter}
                      {entry.exploded ? (
                        <>
                          <br />
                          <span className="text-red-400">
                            ⚡ {entry.prefixAfter} ≥ {threshold} → EXPLOSION! Reset to 0
                          </span>
                        </>
                      ) : (
                        <>
                          <br />
                          <span className="text-blue-400">
                            {entry.prefixAfter} &lt; {threshold} → No explosion, continue
                          </span>
                        </>
                      )}
                    </p>

                    {entry.exploded && (
                      <p className="text-xs text-yellow-400 bg-yellow-400/10 p-2 rounded">
                        💡 Key insight: We record this explosion at event {entry.step}, then reset the running energy to 0 for the next events.
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Prefix Sum Visualization */}
        {history.length > 0 && (
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-[#00ff88]/20 mb-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-[#00ff88]" />
              Prefix Sum Visualization
            </h3>

            <div className="relative h-48 bg-[#0a0a23]/60 rounded-lg p-4">
              <svg width="100%" height="100%" className="overflow-visible">
                {/* Threshold line */}
                <line
                  x1="0"
                  y1={`${100 - (threshold / (threshold * 1.2)) * 100}%`}
                  x2="100%"
                  y2={`${100 - (threshold / (threshold * 1.2)) * 100}%`}
                  stroke="#ff0055"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.5"
                />

                {/* Plot using history so we can show pre-reset peaks and post-reset baseline drops */}
                {history.map((entry, i) => {
                  // i corresponds to event index 0..history.length-1
                  const idx = i + 1; // 1-based event number
                  const prevDisplay = i === 0 ? 0 : history[i - 1].energyAfter; // displayed energy after previous event
                  const preValue = entry.prefixAfter; // running total before any reset
                  const postDisplay = entry.energyAfter; // displayed energy after applying reset (0 if exploded)

                  const x1 = ((idx - 1) / n) * 100;
                  const x2 = (idx / n) * 100;

                  const scale = threshold * 1.2;
                  const mapY = (v: number) => 100 - (v / scale) * 100;
                  const clampY = (y: number) => Math.max(Math.min(y, 140), -40);

                  const yPrev = clampY(mapY(prevDisplay));
                  const yPre = clampY(mapY(preValue));
                  const yPost = clampY(mapY(postDisplay));

                  const exploded = entry.exploded;

                  return (
                    <g key={idx}>
                      {/* Line showing accumulation up to the pre-reset value */}
                      <line
                        x1={`${x1}%`}
                        y1={`${yPrev}%`}
                        x2={`${x2}%`}
                        y2={`${yPre}%`}
                        stroke="#00ff88"
                        strokeWidth="3"
                      />

                      {/* If exploded, draw a vertical drop from the pre-peak down to baseline (post reset) */}
                      {exploded && (
                        <line
                          x1={`${x2}%`}
                          y1={`${yPre}%`}
                          x2={`${x2}%`}
                          y2={`${yPost}%`}
                          stroke="#ff0055"
                          strokeWidth="2"
                          strokeDasharray="2,2"
                          opacity={0.9}
                        />
                      )}

                      {/* Circle at the pre-value (peak) */}
                      <circle
                        cx={`${x2}%`}
                        cy={`${yPre}%`}
                        r="4"
                        fill={exploded ? '#ff0055' : '#00ff88'}
                      />

                      {/* If exploded, also mark the post-reset baseline point */}
                      {exploded && (
                        <circle
                          cx={`${x2}%`}
                          cy={`${yPost}%`}
                          r="4"
                          fill="#ffffff"
                          stroke="#ff0055"
                          strokeWidth={2}
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                <span className="text-[#00ff88]">● Prefix Sum</span>
                {' | '}
                <span className="text-red-400">● Explosion</span>
                {' | '}
                <span className="text-red-400">--- Threshold ({threshold})</span>
                {' | '}
                <span className="text-gray-400">Baseline = 0</span>
              </div>
            </div>
          </div>
        )}

        {/* Query Section */}
        {isComplete && (
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-[#00ff88]/20 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">
              Query: Find Kth Explosion
            </h3>

            <p className="text-gray-300 mb-4">
              Total Explosions: <span className="text-[#00ff88] font-bold">{explosionList.length}</span>
              {explosionList.length > 0 && (
                <span className="text-sm text-gray-500 ml-2">
                  (at events: {explosionList.map(e => e).join(', ')})
                </span>
              )}
            </p>

            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-[#00ff88] font-semibold mb-2">
                  Find which event caused the Kth explosion
                </label>
                <input
                  type="number"
                  value={queryK}
                  onChange={(e) => setQueryK(e.target.value)}
                  placeholder="Enter K (1, 2, 3...)"
                  className="w-full px-4 py-3 bg-[#0a0a23] text-white border border-[#00ff88]/30 rounded-lg focus:outline-none focus:border-[#00ff88] transition-colors"
                />
              </div>

              <button
                onClick={handleQuery}
                className="px-8 py-3 bg-[#00ff88] text-black font-bold rounded-lg hover:bg-[#00ff88]/90 transition-all"
              >
                Query
              </button>
            </div>

            {queryResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-lg border ${
                  queryResult === 'NEVER'
                    ? 'bg-red-500/20 border-red-500 text-red-300'
                    : 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88]'
                }`}
              >
                <strong>Result:</strong> {queryResult}
              </motion.div>
            )}
          </div>
        )}

        {/* Reset Button */}
        <div className="flex justify-center">
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset Simulation
          </button>
        </div>
      </div>

      {/* Explosion Swirl Animation */}
      <AnimatePresence>
        {isExplosion && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <motion.img
              src={explodeImg}
              alt="Explosion"
              // start small, expand larger, and rotate
              initial={{ scale: 0.2, rotate: 0, opacity: 0.85 }}
              animate={{ scale: 1.6, rotate: 360, opacity: 1 }}
              exit={{ scale: 0.2, rotate: 0, opacity: 0 }}
              // longer duration to match the setTimeout above so the image lingers
              transition={{ duration: 2.2, ease: 'easeOut' }}
              // Make the image visually larger on all screen sizes
              className="w-96 h-96 md:w-[32rem] md:h-[32rem] object-contain drop-shadow-2xl"
              style={{ zIndex: 51 }}
            />
            <motion.div
              // Slightly larger heading and a transition that fits the longer swirl
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.25, type: 'spring', stiffness: 300 }}
              className="absolute text-6xl md:text-8xl font-extrabold text-[#ff0055] drop-shadow-lg"
              style={{ top: '50%', left: '50%', transform: 'translate(-50%, -120%)', zIndex: 52 }}
            >
              Explosion!
            </motion.div>
            <motion.div
              // Make the reset text bolder and larger so it matches the larger explosion
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="absolute text-3xl md:text-4xl font-bold text-white bg-black/60 px-6 py-3 rounded-lg shadow-lg"
              style={{ top: '60%', left: '50%', transform: 'translate(-50%, 0)', zIndex: 53 }}
            >
              Energy Reset to 0
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}