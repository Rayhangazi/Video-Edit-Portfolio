import React, { useEffect, useState } from 'react';
import { Film, Sparkles } from 'lucide-react';

export const PageLoader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Fast, buttery smooth progress bar
    const startTime = performance.now();
    const duration = 600; // ms

    const step = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed < duration) {
        requestAnimationFrame(step);
      } else {
        setIsDone(true);
        setTimeout(() => {
          setIsVisible(false);
        }, 400);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050811] pointer-events-none transition-opacity duration-500 ease-out ${
        isDone ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ willChange: 'opacity' }}
    >
      {/* Glowing cyan ambient aura */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-cyan-500/15 blur-[100px] pointer-events-none" />

      {/* Center Cinematic Signature */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <div className="relative mb-5">
          <div className="w-14 h-14 rounded-2xl glass-card border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-400/20">
            <Film className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00F0FF]"></span>
          </span>
        </div>

        <h1 className="font-display font-extrabold text-xl sm:text-2xl tracking-wider text-white uppercase">
          Rayhan Gazi
        </h1>
        <p className="text-[11px] sm:text-xs text-cyan-300 font-mono tracking-widest uppercase mt-1">
          Post-Production · Master Cuts
        </p>

        {/* Minimalist Glowing Cyan Progress Meter */}
        <div className="w-44 sm:w-56 h-[2.5px] bg-cyan-950/40 border border-cyan-500/20 rounded-full mt-7 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-cyan-500/40 via-cyan-400 to-[#00F0FF] rounded-full transition-all duration-75 ease-out shadow-[0_0_12px_#00F0FF]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-[10px] text-slate-400 font-mono mt-2.5 tabular-nums">
          {progress < 100 ? `Loading 1080p Portfolio · ${progress}%` : 'Ready'}
        </div>
      </div>
    </div>
  );
};
