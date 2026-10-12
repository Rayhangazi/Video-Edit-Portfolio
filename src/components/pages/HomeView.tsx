import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Hero } from '../Hero';
import { BestVideosSection } from '../BestVideosSection';
import { AnalyticsMetricBar } from '../AnalyticsMetricBar';
import { ArrowUpRight, Share2, Film, Youtube, Smartphone, HardDrive, MessageCircle, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { projects, navigateTo, shareCategory } = usePortfolio();

  const commercialCount = projects.filter(p => p.category === 'commercial').length;
  const youtubeCount = projects.filter(p => p.category === 'youtube').length;
  const shortCount = projects.filter(p => p.category === 'short_form' || p.aspectRatio === '9:16').length;
  const driveCount = projects.filter(p => p.videoSource === 'gdrive').length;

  const categories = [
    {
      id: 'commercial',
      title: 'Commercials & Brand Ads',
      tag: '16:9 4K BROADCAST',
      count: commercialCount,
      icon: Film,
      accent: 'text-[#E5A93C]',
      barColor: 'gold' as const,
      border: 'hover:border-[#E5A93C]/50',
      description: 'Cinematic commercials engineered for high retention, television broadcast, and Facebook Ad conversions in Bangladesh & overseas.'
    },
    {
      id: 'youtube',
      title: 'YouTube & Narrative Retention',
      tag: '16:9 RETENTION PACING',
      count: youtubeCount,
      icon: Youtube,
      accent: 'text-red-400',
      barColor: 'red' as const,
      border: 'hover:border-red-500/50',
      description: 'Documentaries, storytelling series, and long-form YouTube cuts with kinetic sound design and hook-centric pacing.'
    },
    {
      id: 'short_form',
      title: '9:16 Short-Form & Viral Reels',
      tag: 'VERTICAL SOCIAL FUNNELS',
      count: shortCount,
      icon: Smartphone,
      accent: 'text-emerald-400',
      barColor: 'emerald' as const,
      border: 'hover:border-emerald-500/50',
      description: 'Ultra-fast paced TikTok, Instagram Reels, and YouTube Shorts formatted to stop thumbs and maximize completion rate.'
    },
    {
      id: 'gdrive',
      title: 'Google Drive Client Demos & Archives',
      tag: 'RAW CLIENT CUTS & DELIVERABLES',
      count: driveCount,
      icon: HardDrive,
      accent: 'text-blue-400',
      barColor: 'blue' as const,
      border: 'hover:border-blue-500/50',
      description: 'Master deliverables, client drafts, apparel tests, herbal products, and uncompressed production versions.'
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-24 pb-16">
      {/* 1. Hero with Showreel Card */}
      <Hero />

      {/* 2. Best Video Releases */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <BestVideosSection />
      </div>

      {/* 3. Browse & Share Portfolio by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#E5A93C] font-semibold mb-2">
              Curated Post-Production
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Explore Portfolio by Category
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Select or share specific category links directly with your clients & stakeholders
            </p>
          </div>

          <button
            onClick={() => navigateTo('projects')}
            className="text-xs sm:text-sm font-semibold text-[#E5A93C] hover:underline flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>View Complete Showcase ({projects.length} Works)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className={`group p-6 rounded-2xl bg-[#0F121C] border border-white/[0.08] ${cat.border} transition-all duration-300 flex flex-col justify-between shadow-xl`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] ${cat.accent}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
                          {cat.tag}
                        </span>
                        <div className="text-xs font-mono font-semibold text-white">
                          {cat.count} Production Cuts
                        </div>
                        {/* Thin loading bar under the info */}
                        <div className="mt-1 w-24">
                          <AnalyticsMetricBar percentage={100} delayMs={idx * 150} color={cat.barColor} heightPx={2} />
                        </div>
                      </div>
                    </div>

                    {/* Sharable button */}
                    <button
                      onClick={() => shareCategory(cat.id, cat.title)}
                      title={`Share direct link to ${cat.title}`}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-[#E5A93C]/10 text-slate-400 hover:text-[#E5A93C] border border-white/[0.08] hover:border-[#E5A93C]/40 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Link</span>
                    </button>
                  </div>

                  <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-[#E5A93C] transition-colors mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                    {cat.description}
                  </p>
                </div>

                {/* Card footer buttons */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                  <button
                    onClick={() => navigateTo('projects', cat.id)}
                    className="text-xs font-semibold text-[#E5A93C] hover:text-[#f3b544] flex items-center gap-1.5 cursor-pointer group-hover:translate-x-1 transition-transform"
                  >
                    <span>Open Category Gallery</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      const url = `${window.location.origin}${window.location.pathname}?page=projects&category=${cat.id}`;
                      const text = encodeURIComponent(`Check out Rayhan Gazi's ${cat.title} edits: ${url}`);
                      window.open(`https://wa.me/?text=${text}`, '_blank');
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#25D366] hover:bg-[#25D366]/10 transition-colors cursor-pointer"
                    title="Send Category to Client on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Why Global & Dhaka Brands Choose Rayhan Gazi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0F121C] border border-white/[0.08] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-semibold text-[#E5A93C] uppercase tracking-widest font-mono">
              Production Caliber
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Studio grade color, velocity pacing & 48h turnaround
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
              From commercial brand films to high-converting social campaigns, Rayhan Gazi combines Hollywood-standard color grading workflows in DaVinci Resolve Studio with retention-engineered pacing in Premiere Pro.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-[#E5A93C]" />
                  <span>100% On-Time Delivery Guarantee</span>
                </div>
                <AnalyticsMetricBar percentage={100} delayMs={100} heightPx={2} />
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-200">
                  <Clock className="w-4 h-4 text-[#E5A93C]" />
                  <span>48h Standard Rough Cut</span>
                </div>
                <AnalyticsMetricBar percentage={100} delayMs={250} heightPx={2} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
            <button
              onClick={() => navigateTo('contact')}
              className="w-full py-3.5 px-6 rounded-xl bg-[#E5A93C] hover:bg-[#f5b849] text-black font-bold text-xs uppercase tracking-wider text-center transition-all cursor-pointer shadow-lg shadow-[#E5A93C]/10"
            >
              Start Project Inquiry
            </button>
            <button
              onClick={() => navigateTo('showreel')}
              className="w-full py-3.5 px-6 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.1] font-semibold text-xs text-center transition-colors cursor-pointer"
            >
              Watch 4K Showreel Theater
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
