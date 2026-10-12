import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Film, Sparkles } from 'lucide-react';

export const CoolPageTransition: React.FC = () => {
  const { isPageTransitioning, transitionLabel } = usePortfolio();

  if (!isPageTransitioning) return null;

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-[#090A0F]/90 backdrop-blur-md transition-opacity duration-200 animate-in fade-in"
      aria-live="polite"
      aria-busy="true"
    >
      {/* Background ambient gold aura */}
      <div className="absolute w-80 h-80 rounded-full bg-[#E5A93C]/10 blur-[100px] pointer-events-none" />

      {/* Cinematic Film Centerpiece */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <div className="relative mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#141824] border border-[#E5A93C]/40 flex items-center justify-center shadow-lg shadow-[#E5A93C]/20">
            <Film className="w-6 h-6 text-[#E5A93C] animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5A93C] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E5A93C]"></span>
          </span>
        </div>

        {/* Dynamic Transition Label */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#E5A93C] uppercase tracking-widest font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{transitionLabel}</span>
        </div>

        {/* Cinematic Shutter Bar */}
        <div className="w-48 h-1 bg-white/[0.08] rounded-full mt-4 overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-transparent via-[#E5A93C] to-[#F59E0B] rounded-full animate-[shimmer_0.6s_ease-in-out_infinite] shadow-[0_0_12px_#E5A93C]" />
        </div>
      </div>
    </div>
  );
};
