import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types/portfolio';
import { AnalyticsMetricBar } from './AnalyticsMetricBar';
import { ProjectThumbnail } from './ProjectThumbnail';
import { Play, Star, ChevronRight } from 'lucide-react';

interface BestVideoCardProps {
  project: Project;
  onSelect: (p: Project) => void;
  index: number;
}

export const BestVideoCard: React.FC<BestVideoCardProps> = ({ project, onSelect, index }) => {
  const isShort = project.aspectRatio === '9:16' || project.category === 'short_form';

  return (
    <div
      onClick={() => onSelect(project)}
      className="group relative rounded-2xl overflow-hidden border border-white/[0.08] hover:border-[#E5A93C]/50 bg-[#0F121C] cursor-pointer transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] flex flex-col justify-between shadow-xl shadow-black/40"
    >
      {/* Media Thumbnail Container with Guaranteed Persistent Loading */}
      <div className="relative w-full overflow-hidden">
        <ProjectThumbnail
          project={project}
          bestIndex={index}
          aspectClassName="aspect-video sm:aspect-[16/10]"
          alt={project.title}
        />

        {/* Play Icon on Hover / Active */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#E5A93C] text-black flex items-center justify-center shadow-lg shadow-[#E5A93C]/40 scale-90 group-hover:scale-100 transition-transform duration-200">
            <Play className="w-5 h-5 fill-black translate-x-0.5" />
          </div>
        </div>

        {/* Badges on Thumbnail */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between text-xs pointer-events-none">
          <div className="flex items-center gap-1">
            <span className="w-5 h-5 rounded-full bg-[#E5A93C] text-black font-extrabold text-[10px] flex items-center justify-center font-mono shadow-md">
              #{index}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md border border-[#E5A93C]/40 text-[#E5A93C]">
              HD 1080p
            </span>
          </div>

          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/80 backdrop-blur-md text-white/90 border border-white/10 tabular-nums">
            {project.duration}
          </span>
        </div>
      </div>

      {/* Slight Details with Thin Loading Bar Underneath */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-display font-bold text-xs sm:text-sm text-white group-hover:text-[#E5A93C] transition-colors leading-snug line-clamp-2">
            {project.title}
          </h3>

          {project.originalName && (
            <p className="text-[10px] text-slate-500 font-mono tracking-tight mt-1 truncate flex items-center gap-1">
              <span className="text-slate-600 uppercase text-[8px] px-1 py-0.2 rounded bg-white/[0.04] border border-white/[0.06]">RAW</span>
              <span className="text-slate-400 truncate">{project.originalName}</span>
            </p>
          )}
        </div>

        <div className="mt-3 pt-2 border-t border-white/[0.06]">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-2">
            <span className="truncate max-w-[140px] text-slate-300">{project.client}</span>
            <span className="text-[#E5A93C] text-[10px] font-semibold uppercase tracking-wider shrink-0">
              {isShort ? '9:16 Reel' : '16:9 Master'}
            </span>
          </div>

          {/* Thin loading bar under the info that loads when appearing in view */}
          <AnalyticsMetricBar percentage={100} delayMs={index * 150} heightPx={2} />
        </div>
      </div>
    </div>
  );
};

export const BestVideosSection: React.FC<{ showSubtitle?: boolean }> = ({ showSubtitle = true }) => {
  const { projects, openProjectVideo } = usePortfolio();

  const BEST_PROJECT_TITLES = [
    'Prime Living — Ergonomic Bed Topper Commercial',
    'Luxury Quilt Comforter 3 — Premium Bedding Master BD',
    'Serene Nights — All-Season Luxury Comforter',
    'Order-to-Delivery Journey — 1:1 Social Proof Conversion Reel',
    'Tashrif International Academy — Institutional Documentary'
  ];

  const bestVideoProjects = BEST_PROJECT_TITLES.map(title =>
    projects.find(p => p.title.trim().toLowerCase() === title.trim().toLowerCase())
  ).filter((p): p is Project => !!p && !!p.videoUrl);

  if (bestVideoProjects.length === 0) return null;

  return (
    <div className="relative">
      {/* Ambient decorative glow */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[#E5A93C]/5 blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[#E5A93C] text-[10px] sm:text-xs font-semibold tracking-wider uppercase mb-2">
            <Star className="w-3 h-3 fill-[#E5A93C]" />
            <span>Editor&apos;s Best Cuts</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Best Video Releases
          </h2>
          {showSubtitle && (
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Signature commercial masterworks & top-converting social edits in full HD 1080p
            </p>
          )}
        </div>

        {/* Mobile swipe hint */}
        <div className="sm:hidden flex items-center gap-1 text-[11px] text-slate-400 font-mono">
          <span>Swipe cards</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#E5A93C]" />
        </div>
      </div>

      {/* Mobile View: Smooth horizontal touch scroll with snap */}
      <div className="sm:hidden flex overflow-x-auto gap-3.5 pb-3 -mx-4 px-4 no-scrollbar snap-x snap-mandatory">
        {bestVideoProjects.map((project, idx) => (
          <div key={project.id} className="w-[78vw] max-w-[285px] shrink-0 snap-center">
            <BestVideoCard
              project={project}
              onSelect={openProjectVideo}
              index={idx + 1}
            />
          </div>
        ))}
      </div>

      {/* Tablet & Desktop View: Sleek 5-Column Grid */}
      <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
        {bestVideoProjects.map((project, idx) => (
          <BestVideoCard
            key={project.id}
            project={project}
            onSelect={openProjectVideo}
            index={idx + 1}
          />
        ))}
      </div>
    </div>
  );
};
