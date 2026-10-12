import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { AnalyticsMetricBar } from '../AnalyticsMetricBar';
import { resolveAssetUrl } from '../../utils/thumbnailHelper';
import { Play, Share2, Film, ArrowRight, MessageCircle } from 'lucide-react';

export const ShowreelView: React.FC = () => {
  const { settings, openShowreelVideo, shareShowreel, navigateTo } = usePortfolio();

  const showreelThumb = resolveAssetUrl(settings.showreelThumbnailUrl || 'showreel-thumbnail.jpg');

  const shareToWhatsApp = () => {
    const url = `${window.location.origin}${window.location.pathname}?page=showreel`;
    const text = encodeURIComponent(`Watch Rayhan Gazi's Master Director & Editing Showreel: ${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const specs = [
    { title: 'DaVinci Resolve Studio 19', label: 'Color Grading', sub: 'ACES Color Managed Pipeline', delay: 100 },
    { title: 'Adobe Premiere Pro', label: 'Editing & Assembly', sub: 'Rhythmic beat synching & pacing', delay: 200 },
    { title: 'After Effects & Mocha Pro', label: 'Visual FX & Motion', sub: 'Custom rotoscoping & kinetic type', delay: 300 },
    { title: 'Adobe Audition · 5.1 Stereo', label: 'Audio Post', sub: 'Visceral foley & layered sub-bass', delay: 400 },
  ];

  const breakdown = [
    { time: '00:00 – 00:30', tag: 'HOOK', title: 'Commercial Sonic Hook', desc: 'High-velocity intro grabbing attention in under 3 seconds using visceral risers, micro-zooms, and brand reveals.', delay: 150 },
    { time: '00:30 – 01:05', tag: 'PACE', title: 'Velocity & Kinetic Rhythms', desc: 'Seamless match cuts, speed ramps, and rotoscoped product callouts engineered for zero viewer fatigue.', delay: 300 },
    { time: '01:05 – 01:40', tag: 'COLOR', title: 'Cinematic Color & Mood', desc: 'Rich skin tones, accurate textile lighting, and commercial contrast curves mapped across varied camera sensors.', delay: 450 },
    { time: '01:40 – 02:10', tag: 'CLIMAX', title: 'High-Converting Finale', desc: 'Social proof integration, rapid-fire narrative transitions, and compelling call-to-action payoff.', delay: 600 },
  ];

  return (
    <div className="py-12 sm:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[#E5A93C] text-xs font-semibold uppercase tracking-wider mb-3">
            <Film className="w-3.5 h-3.5" />
            <span>Official Cinema Reel 2025 – 2026</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Rayhan Gazi — Master Director & Editing Showreel
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
            A curated showcase of velocity pacing, sound design textures, dynamic VFX rotoscoping, and commercial grade DaVinci color grading delivered for global & Bangladeshi brands.
          </p>
        </div>

        {/* Share buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={shareShowreel}
            className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.12] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Share2 className="w-4 h-4 text-[#E5A93C]" />
            <span>Copy Showreel Link</span>
          </button>
          <button
            onClick={shareToWhatsApp}
            className="px-4 py-2.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Share on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Hero Cinema Player Card */}
      <div className="relative group rounded-3xl overflow-hidden border border-white/[0.12] bg-[#0F121C] shadow-2xl shadow-black/80">
        
        {/* Aspect 16:9 Screen */}
        <div 
          onClick={openShowreelVideo}
          className="relative cursor-pointer aspect-video w-full overflow-hidden bg-black"
        >
          {/* Fallback film gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#090A0F] via-[#121624] to-[#1C2336] flex items-center justify-center pointer-events-none">
            <Film className="w-12 h-12 text-slate-700 animate-pulse" />
          </div>

          {/* Master Thumbnail Image - Guaranteed permanent, never disappears on mouse move */}
          <img
            src={showreelThumb}
            alt="Rayhan Gazi — Master Director & Editing Showreel"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover opacity-100 pointer-events-none select-none"
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 pointer-events-none" />

          {/* Center Play Button with Anamorphic Ripple */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#E5A93C] text-black flex items-center justify-center shadow-2xl shadow-[#E5A93C]/40 group-hover:scale-105 transition-transform duration-200">
              <Play className="w-9 h-9 sm:w-12 sm:h-12 fill-black translate-x-1" />
            </div>
          </div>

          {/* Top Badges */}
          <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-6 flex items-center justify-between text-xs pointer-events-none">
            <span className="px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider bg-black/85 backdrop-blur-md border border-[#E5A93C]/50 text-[#E5A93C] shadow-lg">
              4K UHD · MASTER DIRECTOR REEL
            </span>
            <span className="px-3 py-1.5 rounded-lg text-[11px] font-mono bg-black/85 backdrop-blur-md text-white border border-white/10 tabular-nums">
              DURATION: 02:10
            </span>
          </div>

          {/* Bottom Title Bar with Thin Loading Bar */}
          <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-6 pointer-events-none">
            <div className="p-4 sm:p-5 rounded-2xl bg-black/85 backdrop-blur-md border border-white/10 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-widest text-[#E5A93C] font-semibold">
                    Commercials · High-Retention YouTube · Narrative Pacing
                  </div>
                  <h2 className="font-display text-base sm:text-xl font-bold text-white mt-0.5">
                    Rayhan Gazi — Master Director & Editing Showreel
                  </h2>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#E5A93C] text-black text-xs font-bold uppercase tracking-wider shrink-0 shadow-sm">
                  <span>Play 4K Reel</span>
                  <Play className="w-3.5 h-3.5 fill-black" />
                </div>
              </div>
              {/* Thin loading bar under the info */}
              <AnalyticsMetricBar percentage={100} delayMs={150} heightPx={2} />
            </div>
          </div>
        </div>

        {/* Technical Specs Strip with Thin Loading Bars */}
        <div className="p-6 bg-[#090A0F] border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          {specs.map((spec, i) => (
            <div key={i} className="space-y-1.5">
              <div className="text-slate-400 font-mono text-[11px] uppercase tracking-wider">{spec.label}</div>
              <div className="font-semibold text-white truncate">{spec.title}</div>
              <div className="text-slate-400 text-[11px] truncate">{spec.sub}</div>
              <div className="pt-1">
                <AnalyticsMetricBar percentage={100} delayMs={spec.delay} heightPx={2} />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Showreel Timeline Analysis with Thin Loading Bars */}
      <div className="space-y-6">
        <div>
          <div className="text-xs font-semibold text-[#E5A93C] uppercase tracking-widest font-mono mb-1">
            Reel Breakdown
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            Architecture of the Showreel
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {breakdown.map((item, i) => (
            <div key={i} className="p-5 rounded-2xl bg-[#0F121C] border border-white/[0.08] flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#E5A93C]">
                  <span>{item.time}</span>
                  <span className="px-2 py-0.5 rounded bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[10px]">{item.tag}</span>
                </div>
                <h3 className="font-bold text-white text-sm">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Thin loading bar under the info */}
              <div className="pt-2 border-t border-white/[0.06]">
                <AnalyticsMetricBar percentage={100} delayMs={item.delay} heightPx={2} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to action card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#141824] via-[#0F121C] to-[#1A2234] border border-[#E5A93C]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <h3 className="font-display text-2xl font-bold text-white">
            Need this caliber of pacing for your upcoming commercial?
          </h3>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Book Rayhan Gazi for commercial films, high-retention YouTube series, or full-funnel ad creative suites.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigateTo('contact')}
            className="px-6 py-3.5 rounded-xl bg-[#E5A93C] hover:bg-[#f5b849] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <span>Book Project Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigateTo('projects')}
            className="px-5 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1] font-medium text-xs transition-colors cursor-pointer"
          >
            <span>Browse All Works</span>
          </button>
        </div>
      </div>

    </div>
  );
};
