import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { AnalyticsMetricBar } from '../AnalyticsMetricBar';
import { Star, TrendingUp, Share2, MessageCircle, ArrowRight } from 'lucide-react';

export const ReviewsView: React.FC = () => {
  const { testimonials, showToast, navigateTo } = usePortfolio();

  const shareReviews = () => {
    const url = `${window.location.origin}${window.location.pathname}?page=reviews`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    showToast('🔗 Copied direct link to Client Reviews & Testimonials!');
  };

  const shareToWhatsApp = () => {
    const url = `${window.location.origin}${window.location.pathname}?page=reviews`;
    const text = encodeURIComponent(`Read client reviews & verified results for video editor Rayhan Gazi: ${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="py-12 sm:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-cyan-500/15 pb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
            <Star className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
            <span>99.4% Client Satisfaction · Attributable Proof</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Client Results & Brand Reviews
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            Quantifiable ROI metrics and testimonials from brands, agency founders, and YouTube creators who trust Rayhan Gazi.
          </p>
        </div>

        {/* Share buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={shareReviews}
            className="px-4 py-2.5 rounded-xl bg-slate-900/60 hover:bg-cyan-950/50 text-white border border-cyan-500/25 hover:border-cyan-400/50 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>Copy Reviews Link</span>
          </button>
          <button
            onClick={shareToWhatsApp}
            className="px-4 py-2.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Share via WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Testimonials 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {testimonials.map((item, idx) => (
          <div
            key={item.id}
            className="p-8 rounded-2xl glass-card flex flex-col justify-between"
          >
            <div>
              {/* Metric Highlight Header with thin loading bar underneath */}
              <div className="mb-6">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-cyan-400">
                    <TrendingUp className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]" />
                    <span>{item.metricHighlight}</span>
                  </div>
                  <div className="flex items-center gap-1 text-cyan-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400 drop-shadow-[0_0_4px_rgba(6,182,212,0.5)]" />
                    ))}
                  </div>
                </div>

                {/* Thin loading bar under the info */}
                <AnalyticsMetricBar percentage={100} delayMs={idx * 150} heightPx={2} color="cyan" />
              </div>

              {/* Quote Body */}
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal mb-8">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>

            {/* Client Attributions Footer */}
            <div className="pt-6 border-t border-cyan-500/15 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white text-sm">
                  {item.clientName}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                  <span>{item.clientRole}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-300">{item.companyOrChannel}</span>
                </div>
              </div>

              {item.projectReference && (
                <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md hidden sm:inline-block shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                  {item.projectReference}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTA card */}
      <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-cyan-950/20">
        <div>
          <h3 className="font-display text-2xl font-bold text-white">
            Ready to experience these retention numbers on your projects?
          </h3>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Get your rough cut delivered in 48 hours with full DaVinci color grading & visceral sound design.
          </p>
        </div>

        <button
          onClick={() => navigateTo('contact')}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-[#00F0FF] hover:from-cyan-400 hover:to-cyan-300 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.4)] shrink-0"
        >
          <span>Book Project Inquiry</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
