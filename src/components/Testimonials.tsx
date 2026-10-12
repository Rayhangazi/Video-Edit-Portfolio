import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { AnalyticsMetricBar } from './AnalyticsMetricBar';
import { Star, TrendingUp } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const { testimonials } = usePortfolio();

  return (
    <section id="testimonials" className="py-24 border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="text-xs uppercase tracking-widest text-[#E5A93C] font-semibold mb-2">
            Client Impact & Bangladeshi Brand Reviews
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Trusted by Leading Bangladesh Brands & Creators
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            From Prime Living to premier fashion and hospitality ventures in Dhaka, every edit is engineered for high retention and measurable commercial conversions.
          </p>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={item.id}
              className="p-8 rounded-2xl bg-[#0F121C] border border-white/[0.08] flex flex-col justify-between hover:border-white/[0.15] transition-colors"
            >
              <div>
                {/* Metric Highlight Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#E5A93C]">
                      <TrendingUp className="w-4 h-4 text-[#E5A93C]" />
                      <span>{item.metricHighlight}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#E5A93C]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#E5A93C] text-[#E5A93C]" />
                      ))}
                    </div>
                  </div>

                  {/* Thin loading bar under the info that loads when appearing in view */}
                  <AnalyticsMetricBar percentage={100} delayMs={idx * 150} heightPx={2} />
                </div>

                {/* Quote Body */}
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-8">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Client Attributions Footer */}
              <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between">
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
                  <span className="text-[11px] font-mono text-[#E5A93C] bg-[#E5A93C]/10 border border-[#E5A93C]/20 px-2.5 py-1 rounded-md">
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
