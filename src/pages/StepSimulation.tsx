import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, BookOpen, TrendingUp, Zap } from 'lucide-react';

export default function StepByStepSimulation() {
  const [n, setN] = useState(10);
  const [threshold, setThreshold] = useState(100);
  const [currentEnergy, setCurrentEnergy] = useState(0);
  const [step, setStep] = useState(1);
  const [explosionList, setExplosionList] = useState([]);
  const [prefixSum, setPrefixSum] = useState([0]);
  const [energyChange, setEnergyChange] = useState('');
  const [history, setHistory] = useState([]);
  const [queryK, setQueryK] = useState('');
  const [queryResult, setQueryResult] = useState(null);
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
      setTimeout(() => setIsExplosion(false), 1000);
    }

    // Add to history
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
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
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
        {prefixSum.length > 1 && (
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

                {/* Prefix sum line */}
                {prefixSum.map((val, idx) => {
                  if (idx === 0) return null;
                  const x1 = ((idx - 1) / (n)) * 100;
                  const x2 = (idx / (n)) * 100;
                  const y1 = 100 - (prefixSum[idx - 1] / (threshold * 1.2)) * 100;
                  const y2 = 100 - (val / (threshold * 1.2)) * 100;

                  return (
                    <g key={idx}>
                      <line
                        x1={`${x1}%`}
                        y1={`${y1}%`}
                        x2={`${x2}%`}
                        y2={`${y2}%`}
                        stroke="#00ff88"
                        strokeWidth="3"
                      />
                      <circle
                        cx={`${x2}%`}
                        cy={`${y2}%`}
                        r="4"
                        fill={explosionList.includes(idx) ? '#ff0055' : '#00ff88'}
                      />
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

      {/* Explosion Particles */}
      <AnimatePresence>
        {isExplosion && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-[#ff0055] rounded-full"
                initial={{
                  x: '50vw',
                  y: '30vh',
                  opacity: 1
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 100}vw`,
                  y: `${30 + (Math.random() - 0.5) * 100}vh`,
                  opacity: 0,
                  scale: 0
                }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}