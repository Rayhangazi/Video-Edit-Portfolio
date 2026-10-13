import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { AnimatedKpiCard, AnalyticsMetricBar } from './AnalyticsMetricBar';
import { resolveAssetUrl } from '../utils/thumbnailHelper';
import { Play, ArrowUpRight, Film, Share2 } from 'lucide-react';

export const Hero: React.FC = () => {
  const { settings, openShowreelVideo, navigateTo, shareShowreel } = usePortfolio();

  const showreelThumb = resolveAssetUrl(settings.showreelThumbnailUrl || 'showreel-thumbnail.jpg');

  return (
    <section className="relative pt-10 sm:pt-14 pb-16 sm:pb-20 border-b border-cyan-500/15 overflow-hidden">
      {/* Background ambient glowing cyan aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-[350px] h-[250px] bg-[#00F0FF]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Split Screen Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Glowing cyan kicker */}
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00F0FF] animate-pulse" />
              <span className="drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">Post-Production · Commercials · Dhaka, Bangladesh</span>
            </div>

            {/* Oversized architectural headline */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
              Turning raw footage into <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-[#00F0FF] to-sky-300 drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">high-retention</span> visual adrenaline.
            </h1>

            {/* Lead copy */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mb-8">
              Hi, I’m <span className="text-white font-medium">{settings.editorName}</span>. 
              Based in Dhaka, Bangladesh, I engineer commercial edits with narrative pacing, visceral sound design, and custom color grading that keep audiences glued to the screen.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => navigateTo('projects')}
                className="px-6 py-3.5 text-sm font-bold text-black bg-gradient-to-r from-cyan-500 via-cyan-400 to-[#00F0FF] hover:from-cyan-400 hover:to-cyan-300 active:scale-[0.98] transition-all rounded-xl inline-flex items-center gap-2 shadow-[0_0_22px_rgba(6,182,212,0.45)] hover:shadow-[0_0_32px_rgba(0,240,255,0.7)] cursor-pointer"
              >
                <span>Explore Selected Works</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={openShowreelVideo}
                className="px-6 py-3.5 text-sm font-medium text-white bg-slate-900/50 hover:bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400/60 transition-all rounded-xl inline-flex items-center gap-2 group cursor-pointer backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.4)]"
              >
                <Play className="w-4 h-4 fill-cyan-400 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>Watch 2026 Showreel</span>
                <span className="text-xs text-cyan-400/80 ml-1 font-mono tabular-nums">2:10</span>
              </button>

              <button
                onClick={shareShowreel}
                title="Share Master Showreel Link with Client"
                className="p-3.5 text-slate-300 hover:text-cyan-300 bg-slate-900/50 hover:bg-cyan-950/40 border border-cyan-500/25 hover:border-cyan-400/50 rounded-xl transition-all cursor-pointer backdrop-blur-md shadow-sm"
                aria-label="Share Showreel Link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right Column: Featured Showreel Card at Matching Height */}
          <div className="lg:col-span-5" id="showreel">
            <div className="group relative rounded-2xl overflow-hidden glass-card border border-cyan-500/25 hover:border-cyan-400/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.5),0_0_30px_rgba(6,182,212,0.18)] transition-all duration-300 flex flex-col">
              
              {/* Media Container with Permanent High-Res Thumbnail */}
              <div 
                onClick={openShowreelVideo}
                className="relative cursor-pointer aspect-video sm:aspect-[16/10] lg:aspect-[4/3] overflow-hidden bg-[#060D17]"
              >
                {/* Fallback film gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#040812] via-[#081525] to-[#0d223a] flex flex-col items-center justify-center p-6 text-center pointer-events-none">
                  <Film className="w-8 h-8 text-cyan-500/40 animate-pulse mb-2" />
                </div>

                {/* Real Showreel Thumbnail Image - Guaranteed visible, never disappears on mouse move */}
                <img
                  src={showreelThumb}
                  alt="Rayhan Gazi — Master Director & Editing Showreel"
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none select-none"
                  style={{
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                  }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/showreel-thumbnail.jpg')) {
                      target.src = '/showreel-thumbnail.jpg';
                    } else if (!target.src.endsWith('/og-cover.jpg')) {
                      target.src = '/og-cover.jpg';
                    }
                  }}
                />

                {/* Cinematic Vignette & Ambient Contrast Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-black/35 to-black/30 pointer-events-none" />

                {/* Centered Glowing Play Button */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-cyan-400 to-[#00F0FF] flex items-center justify-center text-black shadow-xl shadow-cyan-400/50 group-hover:scale-105 transition-transform duration-200">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-black translate-x-0.5" />
                  </div>
                </div>

                {/* Top Floating Badges */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between text-xs pointer-events-none">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-black/85 backdrop-blur-md border border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                    4K UHD · MASTER SHOWREEL
                  </span>
                  <span className="px-2 py-1 rounded-md text-[10px] font-mono bg-black/85 backdrop-blur-md text-white border border-white/10 tabular-nums">
                    2:10 MIN
                  </span>
                </div>

                {/* Subtitle Cue inside overlay with Thin Loading Bar */}
                <div className="absolute bottom-3 inset-x-3 pointer-events-none">
                  <div className="p-3 rounded-xl bg-[#050D17]/85 backdrop-blur-md border border-cyan-500/20">
                    <div className="text-[10px] uppercase tracking-wider text-cyan-400 font-semibold mb-0.5">
                      Director & Video Editor Showreel
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                      Rayhan Gazi — Master Director & Editing Showreel
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono flex items-center justify-between mb-1.5">
                      <span>DaVinci Resolve Studio · Premiere Pro</span>
                      <span className="text-cyan-400 font-semibold">Click to Play 🎬</span>
                    </div>
                    {/* Thin glowing cyan loading bar */}
                    <AnalyticsMetricBar percentage={100} delayMs={150} heightPx={2} color="cyan" />
                  </div>
                </div>
              </div>

              {/* Bottom Quick Bar: Actions */}
              <div className="p-3 bg-[#060D17] border-t border-cyan-500/20 flex items-center justify-between text-xs">
                <button
                  onClick={() => navigateTo('showreel')}
                  className="text-slate-300 hover:text-cyan-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Film className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Showreel Breakdown & Specs</span>
                </button>

                <button
                  onClick={shareShowreel}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/60 hover:bg-cyan-950/50 text-slate-300 hover:text-cyan-300 border border-cyan-500/25 flex items-center gap-1.5 transition-colors cursor-pointer font-mono text-[11px]"
                >
                  <Share2 className="w-3 h-3 text-cyan-400" />
                  <span>Share Reel</span>
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Full-width KPI / Metrics Strip with Thin Animated Loading Bars Underneath */}
        <div className="mt-14 sm:mt-16 pt-8 sm:pt-10 border-t border-cyan-500/15 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <AnimatedKpiCard
            value={settings.totalViews}
            label="Total Audience Impressions"
            sublabel="Across Global & BD Campaigns"
            percentage={100}
            delayMs={0}
            color="cyan"
          />
          <AnimatedKpiCard
            value={settings.projectsDelivered}
            label="Commercial Cuts Shipped"
            sublabel="Commercials & Narrative Edits"
            percentage={100}
            delayMs={150}
            color="cyan"
          />
          <AnimatedKpiCard
            value={settings.turnaroundHours}
            label="Rough Cut Turnaround"
            sublabel="Guaranteed Express Pacing"
            percentage={100}
            delayMs={300}
            color="cyan"
          />
          <AnimatedKpiCard
            value={settings.clientRetention}
            label="Client Satisfaction & Return"
            sublabel="Verified Repeat Collaborators"
            percentage={99.4}
            delayMs={450}
            color="cyan"
          />
        </div>

      </div>
    </section>
  );
};
