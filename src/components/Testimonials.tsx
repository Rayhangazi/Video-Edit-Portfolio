import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { AnalyticsMetricBar } from './AnalyticsMetricBar';
import { Star, TrendingUp } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const { testimonials } = usePortfolio();

  return (
    <section id="testimonials" className="py-24 border-b border-cyan-500/15 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-2 drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]">
            Client Impact & Bangladeshi Brand Reviews
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Trusted by Leading Bangladesh Brands & Creators
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            From Prime Living to premier fashion and hospitality ventures in Dhaka, every edit is engineered for high retention and measurable commercial conversions.
          </p>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={item.id}
              className="p-8 rounded-2xl glass-card flex flex-col justify-between"
            >
              <div>
                {/* Metric Highlight Header */}
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

                  {/* Thin loading bar under the info that loads when appearing in view */}
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
                  <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                    {item.projectReference}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
