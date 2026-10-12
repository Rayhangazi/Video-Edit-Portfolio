import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Play, ArrowUpRight, Film, Clock, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const { settings, openShowreelVideo } = usePortfolio();

  return (
    <section className="relative pt-12 pb-20 border-b border-white/[0.08] overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#E5A93C]/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Split Screen Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Quiet unboxed kicker */}
            <div className="text-xs uppercase tracking-widest text-[#E5A93C] font-semibold mb-4">
              Post-Production · Commercials · Dhaka, Bangladesh
            </div>

            {/* Oversized architectural headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
              Turning raw footage into high-retention visual adrenaline.
            </h1>

            {/* Lead copy */}
            <p className="text-base sm:text-lg text-slate-400 font-normal leading-relaxed max-w-2xl mb-8">
              Hi, I’m <span className="text-white font-medium">{settings.editorName}</span>. 
              Based in Dhaka, Bangladesh, I engineer commercial edits with narrative pacing, visceral sound design, and custom color grading that keep audiences glued to the screen.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#works"
                className="px-6 py-3.5 text-sm font-semibold text-black bg-[#E5A93C] hover:bg-[#f5b849] active:scale-[0.98] transition-all rounded-lg inline-flex items-center gap-2 shadow-sm"
              >
                <span>Explore Selected Works</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <button
                onClick={openShowreelVideo}
                className="px-6 py-3.5 text-sm font-medium text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] transition-colors rounded-lg inline-flex items-center gap-2 group"
              >
                <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform text-white" />
                <span>Watch 2026 Showreel</span>
                <span className="text-xs text-slate-400 ml-1 font-mono tabular-nums">2:10</span>
              </button>
            </div>

          </div>

          {/* Right Column: Featured Showreel Card at Matching Height */}
          <div className="lg:col-span-5" id="showreel">
            <div 
              onClick={openShowreelVideo}
              className="group relative cursor-pointer aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden border border-white/[0.12] bg-[#0F121C] shadow-2xl transition-all duration-300 hover:border-[#E5A93C]/40"
            >
              {/* Cinematic Background Canvas */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#090A0F] via-[#141824] to-[#1E2538] flex flex-col items-center justify-center p-8 text-center">
                
                {/* Subtle film grain & grid texture lines */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#E5A93C_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Play Button Trigger */}
                <div className="relative z-10 w-20 h-20 rounded-full bg-[#E5A93C] flex items-center justify-center text-black shadow-lg shadow-[#E5A93C]/20 group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 fill-black translate-x-0.5" />
                </div>

                {/* Subtitle cue */}
                <div className="relative z-10 mt-6">
                  <div className="text-xs uppercase tracking-wider text-[#E5A93C] font-semibold mb-1">
                    Director & Editor Reel
                  </div>
                  <div className="text-sm font-semibold text-white tracking-wide">
                    Master Showreel 2025 – 2026
                  </div>
                  <div className="text-xs text-slate-400 mt-2 font-mono tabular-nums">
                    4K UHD · DaVinci Resolve · Premiere Pro
                  </div>
                </div>

              </div>

              {/* Bottom Scrim with quick info */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <Film className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>Interactive Cinema Player</span>
                </span>
                <span className="font-mono text-slate-400">Click to Play</span>
              </div>
            </div>
          </div>

        </div>

        {/* Full-width KPI / Metrics Strip below the split */}
        <div className="mt-16 pt-10 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight font-mono tabular-nums">
              {settings.totalViews}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              Total Audience Impressions
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight font-mono tabular-nums">
              {settings.projectsDelivered}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              Projects & Cuts Shipped
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight font-mono tabular-nums">
              {settings.turnaroundHours}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              Standard Rough Cut Turnaround
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight font-mono tabular-nums">
              {settings.clientRetention}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              Client Satisfaction & Return Rate
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
