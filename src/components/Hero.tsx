import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { AnimatedKpiCard, AnalyticsMetricBar } from './AnalyticsMetricBar';
import { resolveAssetUrl } from '../utils/thumbnailHelper';
import { Play, ArrowUpRight, Film, Share2 } from 'lucide-react';

export const Hero: React.FC = () => {
  const { settings, openShowreelVideo, navigateTo, shareShowreel } = usePortfolio();

  const showreelThumb = resolveAssetUrl(settings.showreelThumbnailUrl || 'showreel-thumbnail.jpg');

  return (
    <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-20 border-b border-cyan-500/15 overflow-hidden">
      {/* Background ambient glowing cyan aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-[350px] h-[250px] bg-[#00F0FF]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Split Screen Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-center gpu-stabilize">
            
            {/* Glowing cyan kicker */}
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-3 sm:mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00F0FF] animate-pulse shrink-0 isolate" />
              <span className="drop-shadow-[0_0_8px_rgba(6,182,212,0.4)] truncate">Post-Production · Commercials · Dhaka, BD</span>
            </div>

            {/* Oversized architectural headline with GPU anti-flicker */}
            <h1 className="font-display text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] sm:leading-[1.08] mb-4 sm:mb-6 gpu-stabilize">
              Turning raw footage into{' '}
              <span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-[#00F0FF] to-sky-300 drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                style={{
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              >
                high-retention
              </span>{' '}
              visual adrenaline.
            </h1>

            {/* Lead copy */}
            <p className="text-sm sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mb-6 sm:mb-8 gpu-stabilize">
              Hi, I’m <span className="text-white font-medium">{settings.editorName}</span>. 
              Based in Dhaka, Bangladesh, I engineer commercial edits with narrative pacing, visceral sound design, and custom color grading that keep audiences glued to the screen.
            </p>

            {/* Action buttons - Mobile full-width responsive stack */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full">
              <button
                onClick={() => navigateTo('projects')}
                className="px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-black bg-gradient-to-r from-cyan-500 via-cyan-400 to-[#00F0FF] hover:from-cyan-400 hover:to-cyan-300 active:scale-[0.98] transition-all rounded-xl inline-flex items-center justify-center gap-2 shadow-[0_0_22px_rgba(6,182,212,0.45)] hover:shadow-[0_0_32px_rgba(0,240,255,0.7)] cursor-pointer min-h-[44px]"
              >
                <span>Explore Selected Works</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </button>

              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={openShowreelVideo}
                  className="flex-1 sm:flex-initial px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-medium text-white bg-slate-900/60 hover:bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400/60 transition-all rounded-xl inline-flex items-center justify-center gap-2 group cursor-pointer backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.4)] min-h-[44px]"
                >
                  <Play className="w-4 h-4 fill-cyan-400 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                  <span>Watch 2026 Reel</span>
                  <span className="text-[11px] sm:text-xs text-cyan-400/80 font-mono tabular-nums">2:10</span>
                </button>

                <button
                  onClick={shareShowreel}
                  title="Share Master Showreel Link with Client"
                  className="p-3 sm:p-3.5 text-slate-300 hover:text-cyan-300 bg-slate-900/60 hover:bg-cyan-950/40 border border-cyan-500/25 hover:border-cyan-400/50 rounded-xl transition-all cursor-pointer backdrop-blur-md shadow-sm min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
                  aria-label="Share Showreel Link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Featured Showreel Card */}
          <div className="lg:col-span-5" id="showreel">
            <div className="group relative rounded-2xl overflow-hidden glass-card border border-cyan-500/25 hover:border-cyan-400/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.5),0_0_30px_rgba(6,182,212,0.18)] transition-all duration-300 flex flex-col gpu-stabilize">
              
              {/* Media Container with Permanent High-Res Thumbnail */}
              <div 
                onClick={openShowreelVideo}
                className="relative cursor-pointer aspect-video sm:aspect-[16/10] lg:aspect-[4/3] overflow-hidden bg-[#060D17]"
              >
                {/* Fallback film gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#040812] via-[#081525] to-[#0d223a] flex flex-col items-center justify-center p-6 text-center pointer-events-none">
                  <Film className="w-8 h-8 text-cyan-500/40 animate-pulse mb-2" />
                </div>

                {/* Real Showreel Thumbnail Image */}
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

                {/* Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-black/35 to-black/30 pointer-events-none" />

                {/* Centered Glowing Play Button */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-cyan-400 to-[#00F0FF] flex items-center justify-center text-black shadow-xl shadow-cyan-400/50 group-hover:scale-105 transition-transform duration-200">
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-black translate-x-0.5" />
                  </div>
                </div>

                {/* Top Floating Badges */}
                <div className="absolute top-2.5 inset-x-2.5 sm:top-3 sm:inset-x-3 flex items-center justify-between text-xs pointer-events-none">
                  <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider bg-black/85 backdrop-blur-md border border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                    4K UHD · MASTER REEL
                  </span>
                  <span className="px-2 py-0.5 sm:px-2 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-mono bg-black/85 backdrop-blur-md text-white border border-white/10 tabular-nums">
                    2:10 MIN
                  </span>
                </div>

                {/* Subtitle Cue inside overlay */}
                <div className="absolute bottom-2.5 inset-x-2.5 sm:bottom-3 sm:inset-x-3 pointer-events-none">
                  <div className="p-2.5 sm:p-3 rounded-xl bg-[#050D17]/90 backdrop-blur-md border border-cyan-500/20 gpu-stabilize">
                    <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-cyan-400 font-semibold mb-0.5">
                      Director & Video Editor Showreel
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                      Rayhan Gazi — Master Director & Editing Showreel
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-slate-400 mt-1 font-mono flex items-center justify-between mb-1">
                      <span className="truncate">DaVinci Resolve Studio · Premiere Pro</span>
                      <span className="text-cyan-400 font-semibold shrink-0 ml-1">Click to Play 🎬</span>
                    </div>
                    <AnalyticsMetricBar percentage={100} delayMs={150} heightPx={2} color="cyan" />
                  </div>
                </div>
              </div>

              {/* Bottom Quick Bar: Actions */}
              <div className="p-3 bg-[#060D17] border-t border-cyan-500/20 flex items-center justify-between text-xs">
                <button
                  onClick={() => navigateTo('showreel')}
                  className="text-slate-300 hover:text-cyan-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
                >
                  <Film className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Showreel Breakdown & Specs</span>
                </button>

                <button
                  onClick={shareShowreel}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/60 hover:bg-cyan-950/50 text-slate-300 hover:text-cyan-300 border border-cyan-500/25 flex items-center gap-1.5 transition-colors cursor-pointer font-mono text-[11px]"
                >
                  <Share2 className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>Share Reel</span>
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Full-width KPI / Metrics Strip - 2x2 on Mobile, 4 columns on Desktop */}
        <div className="mt-10 sm:mt-16 pt-6 sm:pt-10 border-t border-cyan-500/15 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          <AnimatedKpiCard
            value={settings.totalViews}
            label="Total Impressions"
            sublabel="Global & BD Campaigns"
            percentage={100}
            delayMs={0}
            color="cyan"
          />
          <AnimatedKpiCard
            value={settings.projectsDelivered}
            label="Projects Shipped"
            sublabel="Commercial & Ads"
            percentage={100}
            delayMs={150}
            color="cyan"
          />
          <AnimatedKpiCard
            value={settings.turnaroundHours}
            label="Rough Cut Delivery"
            sublabel="Express Pacing"
            percentage={100}
            delayMs={300}
            color="cyan"
          />
          <AnimatedKpiCard
            value={settings.clientRetention}
            label="Client Retention"
            sublabel="Verified Repeat Clients"
            percentage={99.4}
            delayMs={450}
            color="cyan"
          />
        </div>

      </div>
    </section>
  );
};
