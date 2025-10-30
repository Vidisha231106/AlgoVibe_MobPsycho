import React, { useRef, useEffect } from 'react';

type Props = {
  intensity?: number; // 0..1
  frequency?: number; // approx flashes per second at intensity=1
  color?: string;
  isActive?: boolean;
  className?: string;
};

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

interface Bolt {
  start: [number, number];
  end: [number, number];
  segments: number;
  age: number;
  lifetime: number;
  opacity: number;
  thickness: number;
  forks: number;
}

const CanvasLightningBackground: React.FC<Props> = ({
  intensity = 0.6,
  frequency = 0.6,
  color = '#a8fff7',
  isActive = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const boltsRef = useRef<Bolt[]>([]);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;

    let dpr = Math.max(1, window.devicePixelRatio || 1);
    function resize() {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvasEl.width = Math.floor(w * dpr);
      canvasEl.height = Math.floor(h * dpr);
      canvasEl.style.width = `${w}px`;
      canvasEl.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize);

    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function spawnBolt() {
      if (prefersReduced) return;
      const w = canvasEl.width / dpr;
      const h = canvasEl.height / dpr;
      const startX = Math.random() * w;
      const endX = Math.random() * w;
      const endY = h * (0.6 + Math.random() * 0.35);
      const segments = 6 + Math.floor(Math.random() * 8);
      const lifetime = 280 + Math.random() * 420;
      boltsRef.current.push({
        start: [startX, 0],
        end: [endX, endY],
        segments,
        age: 0,
        lifetime,
        opacity: 1,
        thickness: 1 + Math.random() * 2,
        forks: Math.random() * 2,
      });
    }

    function drawBolt(bolt: Bolt) {
      const { start, end, segments } = bolt;
      const points: Array<[number, number]> = [];
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = start[0] + (end[0] - start[0]) * t + (Math.random() - 0.5) * 30 * (1 - t);
        const y = start[1] + (end[1] - start[1]) * t + (Math.random() - 0.5) * 30 * t;
        points.push([x, y]);
      }

      // glow
      ctx.save();
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
      ctx.strokeStyle = color;
      ctx.globalAlpha = Math.min(1, bolt.opacity) * 0.22;
      ctx.lineWidth = (bolt.thickness + 6) * 0.7;
      ctx.shadowColor = color;
      ctx.shadowBlur = 30 * intensity;
      ctx.stroke();
      ctx.restore();

      // core
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
      ctx.strokeStyle = '#ffffff';
      ctx.globalAlpha = Math.min(1, bolt.opacity);
      ctx.lineWidth = bolt.thickness;
      ctx.stroke();
      ctx.restore();

      // forks
      if (bolt.forks > 0.3) {
        for (let f = 0; f < Math.floor(bolt.forks); f++) {
          const idx = 2 + Math.floor(Math.random() * Math.max(3, points.length - 4));
          const p = points[idx];
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(p[0], p[1]);
          const fx = p[0] + (Math.random() - 0.5) * 120;
          const fy = p[1] + (Math.random() * 80);
          ctx.lineTo(fx, fy);
          ctx.strokeStyle = '#fff';
          ctx.globalAlpha = Math.min(0.8, bolt.opacity * 0.6);
          ctx.lineWidth = bolt.thickness * 0.6;
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    let lastTime = performance.now();
    function tick(now: number) {
      const dt = now - lastTime;
      lastTime = now;

      if (!isActive) {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // spawn probability per frame
      const prob = clamp((frequency * clamp(intensity)) * (dt / 1000));
      if (Math.random() < prob) spawnBolt();

      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

      // ambient dim overlay
      ctx.save();
      ctx.fillStyle = `rgba(0,0,0,${0.06 * intensity})`;
      ctx.fillRect(0, 0, canvasEl.width / dpr, canvasEl.height / dpr);
      ctx.restore();

      const newBolts: Bolt[] = [];
      for (const bolt of boltsRef.current) {
        bolt.age += dt;
        bolt.opacity = 1 - bolt.age / bolt.lifetime;
        if (bolt.opacity > 0) {
          drawBolt(bolt);
          newBolts.push(bolt);
        }
      }
      boltsRef.current = newBolts;

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [intensity, frequency, color, isActive]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 w-full h-full z-0 ${className}`}
      aria-hidden
    />
  );
};

export default CanvasLightningBackground;
