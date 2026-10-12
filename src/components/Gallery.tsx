import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project, ProjectCategory } from '../types/portfolio';
import { getYouTubeThumbnail, getGoogleDriveThumbnail } from '../utils/videoUtils';
import { Play, Youtube, HardDrive, Smartphone, Film, Search, X, Sparkles, Leaf, Star, ChevronRight } from 'lucide-react';

// =========================================================================
// BEST VIDEO CARD (Top Minimalist Section: Thumbnails + Slight Details Only)
// =========================================================================
interface BestVideoCardProps {
  project: Project;
  onSelect: (p: Project) => void;
  index: number;
}

const BestVideoCard: React.FC<BestVideoCardProps> = ({ project, onSelect, index }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const ytThumb = project.videoSource === 'youtube' ? getYouTubeThumbnail(project.videoUrl) : null;
  const driveThumb = project.videoSource === 'gdrive' ? getGoogleDriveThumbnail(project.videoUrl) : null;
  const displayImage = project.thumbnailUrl || ytThumb || driveThumb;
  const isShort = project.aspectRatio === '9:16' || project.category === 'short_form';

  return (
    <div
      onClick={() => onSelect(project)}
      className="group relative rounded-2xl overflow-hidden border border-white/[0.08] hover:border-[#E5A93C]/50 bg-[#0F121C] cursor-pointer transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] flex flex-col justify-between shadow-xl shadow-black/40"
    >
      {/* Media Thumbnail Container */}
      <div className="relative w-full aspect-video sm:aspect-[16/10] overflow-hidden bg-[#141824]">
        {/* Fallback & Loading Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#090A0F] via-[#121624] to-[#1A2234] flex items-center justify-center pointer-events-none">
          <Film className="w-5 h-5 text-slate-700 animate-pulse" />
        </div>

        {displayImage ? (
          <img
            src={displayImage}
            alt={project.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : null}

        {/* Gradient Scrim for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F121C] via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />

        {/* Play Icon on Hover / Active */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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

      {/* Slight Details Only: Title, Raw Name, Client */}
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

        <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span className="truncate max-w-[140px] text-slate-300">{project.client}</span>
          <span className="text-[#E5A93C] text-[10px] font-semibold uppercase tracking-wider shrink-0">
            {isShort ? '9:16 Reel' : '16:9 Master'}
          </span>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// STANDARD PROJECT CARD (Full Metadata)
// =========================================================================
interface ProjectCardProps {
  project: Project;
  onSelect: (p: Project) => void;
  isHerbal?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect, isHerbal }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const isShortForm = project.aspectRatio === '9:16' || project.category === 'short_form';
  const ytThumb = project.videoSource === 'youtube' ? getYouTubeThumbnail(project.videoUrl) : null;
  const driveThumb = project.videoSource === 'gdrive' ? getGoogleDriveThumbnail(project.videoUrl) : null;
  const displayImage = project.thumbnailUrl || ytThumb || driveThumb;

  const getCategoryLabel = (cat: ProjectCategory) => {
    switch (cat) {
      case 'commercial': return 'Commercial';
      case 'youtube': return 'YouTube Docu';
      case 'music_video': return 'Music Video';
      case 'short_form': return 'Short-Form Reel';
    }
  };

  return (
    <div
      onClick={() => onSelect(project)}
      className={`group relative rounded-2xl overflow-hidden border bg-[#0F121C] cursor-pointer transition-all duration-300 flex flex-col justify-between active:scale-[0.99] ${
        isHerbal
          ? 'border-emerald-500/20 hover:border-emerald-400/60 hover:-translate-y-1'
          : 'border-white/[0.08] hover:border-[#E5A93C]/40 hover:-translate-y-1'
      }`}
    >
      {/* Media Thumbnail Container */}
      <div className={`relative w-full overflow-hidden bg-[#141824] ${
        isShortForm ? 'aspect-[4/5]' : 'aspect-video'
      }`}>
        {displayImage ? (
          <img
            src={displayImage}
            alt={project.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : null}

        {/* Styled Fallback Cinematic Canvas */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#090A0F] via-[#121624] to-[#1A2234] flex flex-col items-center justify-center p-6 text-center pointer-events-none -z-10 group-hover:z-0 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center mb-3">
            {isShortForm ? (
              <Smartphone className="w-5 h-5 text-[#E5A93C]" />
            ) : project.videoSource === 'gdrive' ? (
              <HardDrive className="w-5 h-5 text-[#E5A93C]" />
            ) : (
              <Film className="w-5 h-5 text-[#E5A93C]" />
            )}
          </div>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">
            {project.client}
          </span>
        </div>

        {/* Gradient Scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F121C] via-[#0F121C]/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Play Button Indicator Overlay on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className={`w-14 h-14 rounded-full text-black flex items-center justify-center shadow-lg scale-90 group-hover:scale-100 transition-transform duration-200 ${
            isHerbal
              ? 'bg-emerald-400 shadow-emerald-400/30'
              : 'bg-[#E5A93C] shadow-[#E5A93C]/30'
          }`}>
            <Play className="w-6 h-6 fill-black translate-x-0.5" />
          </div>
        </div>

        {/* Top Badges: Source + Duration & HD */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between text-xs text-white/90 pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 backdrop-blur-md border ${
              project.videoSource === 'youtube'
                ? 'bg-red-500/80 text-white border-red-500/30'
                : isHerbal
                ? 'bg-emerald-500/80 text-white border-emerald-500/30'
                : 'bg-blue-500/80 text-white border-blue-500/30'
            }`}>
              {project.videoSource === 'youtube' ? (
                <>
                  <Youtube className="w-3 h-3" />
                  <span>YouTube</span>
                </>
              ) : isHerbal ? (
                <>
                  <Leaf className="w-3 h-3" />
                  <span>Herbal Drive</span>
                </>
              ) : (
                <>
                  <HardDrive className="w-3 h-3" />
                  <span>Google Drive</span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] tracking-wider border shadow-sm ${
              isHerbal
                ? 'bg-black/80 text-emerald-300 border-emerald-500/30'
                : 'bg-black/80 text-[#E5A93C] border-[#E5A93C]/30'
            }`}>
              HD 1080p
            </span>
            {isShortForm && (
              <span className="px-2 py-0.5 rounded bg-[#E5A93C]/90 text-black font-semibold text-[10px] uppercase tracking-wider">
                9:16 Vertical
              </span>
            )}
            <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md font-mono text-[11px] tabular-nums border border-white/10">
              {project.duration}
            </span>
          </div>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Quiet Unboxed Metadata with Typographic Separators */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-mono">
            <span className={`font-sans font-semibold ${isHerbal ? 'text-emerald-400' : 'text-[#E5A93C]'}`}>
              {getCategoryLabel(project.category)}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{project.client}</span>
            <span aria-hidden="true">·</span>
            <span>{project.year}</span>
          </div>

          {/* Professional Project Title */}
          <h3 className={`font-display font-bold text-lg text-white transition-colors leading-snug ${
            isHerbal ? 'group-hover:text-emerald-400' : 'group-hover:text-[#E5A93C]'
          }`}>
            {project.title}
          </h3>

          {/* Original raw project name smaller right under it */}
          {project.originalName && (
            <p className="text-[11px] text-slate-500 font-mono tracking-tight mt-1 mb-2.5 truncate flex items-center gap-1.5">
              <span className="text-slate-600 uppercase text-[9px] px-1 py-0.2 rounded bg-white/[0.04] border border-white/[0.06]">RAW</span>
              <span className="text-slate-400 truncate">{project.originalName}</span>
            </p>
          )}

          {/* Brief description */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {project.description}
          </p>
        </div>

        {/* Bottom Metadata & Quantitative Performance */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
          {project.metrics ? (
            <span className="text-slate-300 font-medium font-mono text-[11px] truncate max-w-[200px]">
              {project.metrics}
            </span>
          ) : (
            <span className="text-slate-500 font-mono text-[11px]">
              {project.tools.slice(0, 2).join(' · ')}
            </span>
          )}

          <span className={`text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0 ${
            isHerbal ? 'text-emerald-400' : 'text-[#E5A93C]'
          }`}>
            Watch <Play className="w-2.5 h-2.5 fill-current" />
          </span>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// DEDUPLICATION & HERBAL HELPERS
// =========================================================================

// Normalize string for duplicate detection across sources
const normalizeVideoKey = (val?: string) => {
  if (!val) return '';
  return val
    .toLowerCase()
    .replace(/\.mp4|\.mov|\.mkv|\.webm/g, '')
    .replace(/[^a-z0-9]/g, '');
};

// Check if a Google Drive video is a duplicate of any video in the YouTube section
const isDriveDuplicateOfYouTube = (driveProject: Project, ytList: Project[]): boolean => {
  const gOrig = normalizeVideoKey(driveProject.originalName);
  const gTitle = normalizeVideoKey(driveProject.title);

  for (const yt of ytList) {
    const yOrig = normalizeVideoKey(yt.originalName);
    const yTitle = normalizeVideoKey(yt.title);

    // Exact or substring match on original filenames
    if (gOrig && yOrig) {
      if (gOrig === yOrig || gOrig.includes(yOrig) || yOrig.includes(gOrig)) {
        return true;
      }
    }
    // Specific Bed Topper project matching
    if (gOrig.includes('bedtopper') && (yOrig.includes('bedtopper') || yTitle.includes('bedtopper'))) {
      return true;
    }
    // Match on titles
    if (gTitle && yTitle && (gTitle === yTitle || (gTitle.length > 10 && yTitle.includes(gTitle)))) {
      return true;
    }
  }
  return false;
};

// Check if a project is categorized as herbal/healthcare
const isHerbalProject = (project: Project): boolean => {
  if (project.subCategory === 'herbal') return true;
  const text = `${project.title} ${project.originalName || ''} ${project.description} ${project.client}`.toLowerCase();
  return text.includes('herbal') || text.includes('ecodor') || text.includes('orgavet') || text.includes('organic mart');
};

// The curated list of best videos requested by the user
const BEST_VIDEO_TITLES: string[] = [
  'Prime Living — Ergonomic Bed Topper Commercial',
  'Luxury Quilt Comforter 3 — Premium Bedding Master BD',
  'Serene Nights — All-Season Luxury Comforter',
  'Order-to-Delivery Journey — 1:1 Social Proof Conversion Reel',
  'Tashrif International Academy — Institutional Documentary'
];

export const Gallery: React.FC = () => {
  const { projects, openProjectVideo } = usePortfolio();

  // Find the exact projects for the Best Videos section on top
  const bestVideoProjects = BEST_VIDEO_TITLES.map(title => {
    return projects.find(p => p.title.toLowerCase().trim() === title.toLowerCase().trim());
  }).filter((p): p is Project => p !== undefined);

  // Separate YouTube projects and Google Drive projects
  const youtubeProjects = projects.filter(p => p.videoSource === 'youtube');

  // HIDE DUPLICATES: If there is a video in the YouTube section, hide its Google Drive counterpart
  const driveProjects = projects.filter(
    p => p.videoSource === 'gdrive' && !isDriveDuplicateOfYouTube(p, youtubeProjects)
  );

  // Filter state for YouTube section
  const [ytFilter, setYtFilter] = useState<'all' | 'commercial' | 'short_form'>('all');

  // Filter & search state for Google Drive section
  type DriveFilterType = 
    | 'all' 
    | 'new_2026' 
    | 'archive_classics' 
    | 'clothing' 
    | 'bedding' 
    | 'skit' 
    | 'fashion' 
    | 'corporate' 
    | 'motion'
    | 'herbal'; // Listed at the last!

  const [driveFilter, setDriveFilter] = useState<DriveFilterType>('all');
  const [driveSearch, setDriveSearch] = useState('');

  // Filtered YouTube projects
  const filteredYtProjects = ytFilter === 'all'
    ? youtubeProjects
    : youtubeProjects.filter(p => p.category === ytFilter);

  // Filtered Google Drive projects
  const filteredDriveProjects = driveProjects.filter(p => {
    // Subcategory matching
    if (driveFilter === 'all') {
      // pass through
    } else if (driveFilter === 'new_2026') {
      if (p.year !== '2026' && p.subCategory === 'archive_classics') return false;
    } else if (driveFilter === 'archive_classics') {
      if (p.subCategory !== 'archive_classics' && p.year !== '2023') return false;
    } else if (driveFilter === 'herbal') {
      return isHerbalProject(p);
    } else {
      if (p.subCategory !== driveFilter) return false;
    }

    // Search query matching
    if (driveSearch.trim()) {
      const q = driveSearch.trim().toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchRaw = p.originalName ? p.originalName.toLowerCase().includes(q) : false;
      const matchClient = p.client.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchTitle && !matchRaw && !matchClient && !matchDesc) return false;
    }

    return true;
  });

  // GROUP ALL HERBAL VIDEOS TOGETHER AND LIST THEM AT THE LAST
  const nonHerbalDriveProjects = filteredDriveProjects.filter(p => !isHerbalProject(p));
  const herbalDriveProjects = filteredDriveProjects.filter(p => isHerbalProject(p));
  const displayedDriveProjects = driveFilter === 'herbal'
    ? filteredDriveProjects
    : [...nonHerbalDriveProjects, ...herbalDriveProjects];

  const driveSubcategoryCounts: Record<DriveFilterType, number> = {
    all: driveProjects.length,
    new_2026: driveProjects.filter(p => p.year === '2026' || p.subCategory !== 'archive_classics').length,
    archive_classics: driveProjects.filter(p => p.subCategory === 'archive_classics' || p.year === '2023').length,
    clothing: driveProjects.filter(p => p.subCategory === 'clothing').length,
    bedding: driveProjects.filter(p => p.subCategory === 'bedding').length,
    skit: driveProjects.filter(p => p.subCategory === 'skit').length,
    fashion: driveProjects.filter(p => p.subCategory === 'fashion').length,
    corporate: driveProjects.filter(p => p.subCategory === 'corporate').length,
    motion: driveProjects.filter(p => p.subCategory === 'motion').length,
    herbal: driveProjects.filter(isHerbalProject).length,
  };

  return (
    <section id="works" className="py-20 sm:py-24 border-b border-white/[0.08] space-y-24 sm:space-y-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-20 sm:space-y-24">
        
        {/* ======================================================== */}
        {/* SECTION 0: BEST VIDEO SECTION ON TOP                    */}
        {/* ======================================================== */}
        {bestVideoProjects.length > 0 && (
          <div className="relative">
            {/* Ambient decorative glow */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[#E5A93C]/5 blur-3xl pointer-events-none" />

            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[#E5A93C] text-[10px] sm:text-xs font-semibold tracking-wider uppercase mb-2">
                  <Star className="w-3 h-3 fill-[#E5A93C]" />
                  <span>Editor&apos;s Best Cuts</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                  Best Video Releases
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  Signature commercial masterworks & top-converting social edits in full HD 1080p
                </p>
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
        )}

        {/* ======================================================== */}
        {/* SECTION 1: YOUTUBE & SOCIAL SHOWCASES                    */}
        {/* ======================================================== */}
        <div>
          {/* Header & Category Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="text-xs uppercase tracking-widest text-red-400 font-semibold mb-2 flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-500" />
                <span>YouTube & Social Video Works</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                YouTube Commercials & Social Ad Cuts
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Official cuts from RG Multimedia playlist (PLeblsp6_-mB4) · Primary showcase
              </p>
            </div>

            {/* YouTube Categories */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl self-start md:self-auto">
              <button
                onClick={() => setYtFilter('all')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  ytFilter === 'all'
                    ? 'bg-[#E5A93C] text-black shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                All YouTube ({youtubeProjects.length})
              </button>
              <button
                onClick={() => setYtFilter('commercial')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  ytFilter === 'commercial'
                    ? 'bg-[#E5A93C] text-black shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                Commercials ({youtubeProjects.filter(p => p.category === 'commercial').length})
              </button>
              <button
                onClick={() => setYtFilter('short_form')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  ytFilter === 'short_form'
                    ? 'bg-[#E5A93C] text-black shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                Social 4:5 & 9:16 ({youtubeProjects.filter(p => p.category === 'short_form').length})
              </button>
            </div>
          </div>

          {/* YouTube Grid */}
          {filteredYtProjects.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/[0.08]">
              <p className="text-slate-400 text-sm">No YouTube projects found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredYtProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSelect={openProjectVideo}
                />
              ))}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* SECTION 2: GOOGLE DRIVE CLIENT DEMOS & ARCHIVES           */}
        {/* Separated directly under YouTube link items with badges   */}
        {/* ======================================================== */}
        <div className="pt-16 border-t border-white/[0.08]">
          {/* Header & Subcategory Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-2 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-blue-400" />
                <span>Client Drive Deliverables · Categorized Master Cuts</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Google Drive Client Demos & Releases
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                High-definition direct drive deliverables across Bangladesh brands (Deduplicated against YouTube)
              </p>
            </div>

            {/* Quick Search in Drive Deliverables */}
            <div className="relative min-w-[260px] sm:min-w-[320px]">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search raw name, brand, or title..."
                value={driveSearch}
                onChange={(e) => setDriveSearch(e.target.value)}
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/60 transition-colors"
              />
              {driveSearch && (
                <button
                  onClick={() => setDriveSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Primary Drive Category Filter Bar */}
          {/* NOTICE: Herbal & Health is deliberately grouped and placed at the very LAST position! */}
          <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 border-b border-white/[0.06]">
            {/* All */}
            <button
              onClick={() => setDriveFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                driveFilter === 'all'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span>All Drive Works</span>
              <span className="text-[10px] opacity-75 font-mono">({driveSubcategoryCounts.all})</span>
            </button>

            {/* 2026 New Releases */}
            <button
              onClick={() => setDriveFilter('new_2026')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                driveFilter === 'new_2026'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#E5A93C]" />
              <span>2026 New Releases</span>
              <span className="text-[10px] opacity-75 font-mono">({driveSubcategoryCounts.new_2026})</span>
            </button>

            {/* 2023 Classic Archive */}
            <button
              onClick={() => setDriveFilter('archive_classics')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                driveFilter === 'archive_classics'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span>2023 Classic Archive</span>
              <span className="text-[10px] opacity-75 font-mono">({driveSubcategoryCounts.archive_classics})</span>
            </button>

            <span className="text-slate-700 hidden sm:inline">|</span>

            {/* Clothing & Apparel */}
            <button
              onClick={() => setDriveFilter('clothing')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                driveFilter === 'clothing'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span>Fashion & Streetwear</span>
              <span className="text-[10px] opacity-75 font-mono">({driveSubcategoryCounts.clothing})</span>
            </button>

            {/* Bedding & Prime Living */}
            <button
              onClick={() => setDriveFilter('bedding')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                driveFilter === 'bedding'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span>Bedding & Home Living</span>
              <span className="text-[10px] opacity-75 font-mono">({driveSubcategoryCounts.bedding})</span>
            </button>

            {/* Social Skits & E-Commerce Drama */}
            <button
              onClick={() => setDriveFilter('skit')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                driveFilter === 'skit'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span>Social Skits & Drama BD</span>
              <span className="text-[10px] opacity-75 font-mono">({driveSubcategoryCounts.skit})</span>
            </button>

            {/* Fashion Runway & Model */}
            <button
              onClick={() => setDriveFilter('fashion')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                driveFilter === 'fashion'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span>Model Films</span>
              <span className="text-[10px] opacity-75 font-mono">({driveSubcategoryCounts.fashion})</span>
            </button>

            {/* Corporate & Institutional */}
            <button
              onClick={() => setDriveFilter('corporate')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                driveFilter === 'corporate'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span>Corporate & Real Estate</span>
              <span className="text-[10px] opacity-75 font-mono">({driveSubcategoryCounts.corporate})</span>
            </button>

            {/* Motion Graphics */}
            <button
              onClick={() => setDriveFilter('motion')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                driveFilter === 'motion'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span>2D/3D Motion</span>
              <span className="text-[10px] opacity-75 font-mono">({driveSubcategoryCounts.motion})</span>
            </button>

            <span className="text-slate-700 hidden sm:inline">|</span>

            {/* Herbal & Health Products — LISTED AT THE LAST */}
            <button
              onClick={() => setDriveFilter('herbal')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                driveFilter === 'herbal'
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                  : 'text-emerald-400 hover:text-white hover:bg-emerald-500/10 border border-emerald-500/20'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>Herbal & Health</span>
              <span className="text-[10px] opacity-75 font-mono">({driveSubcategoryCounts.herbal})</span>
            </button>
          </div>

          {/* Drive Grid with Herbal Grouped at the Last */}
          {displayedDriveProjects.length === 0 ? (
            <div className="p-16 text-center rounded-2xl bg-white/[0.02] border border-white/[0.08]">
              <p className="text-slate-300 text-sm font-medium mb-1">
                No Google Drive projects match your criteria.
              </p>
              <p className="text-slate-500 text-xs">
                Try selecting &ldquo;All Drive Works&rdquo; or clearing the search keyword.
              </p>
              {driveSearch && (
                <button
                  onClick={() => setDriveSearch('')}
                  className="mt-4 px-4 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-semibold hover:bg-blue-500/30 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              {/* If viewing 'all' or 'new_2026' and there are non-herbal projects, render them first */}
              {driveFilter !== 'herbal' && nonHerbalDriveProjects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {nonHerbalDriveProjects.map(project => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onSelect={openProjectVideo}
                      isHerbal={false}
                    />
                  ))}
                </div>
              )}

              {/* Grouped Herbal Section at the Last */}
              {herbalDriveProjects.length > 0 && (
                <div className="pt-8 border-t border-emerald-500/20 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <Leaf className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                          <span>Herbal & Natural Healthcare Range</span>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Grouped Deliverables ({herbalDriveProjects.length})
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400">
                          Pharmaceutical motion design, therapeutic gels, and organic health products · Listed last as requested
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {herbalDriveProjects.map(project => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onSelect={openProjectVideo}
                        isHerbal={true}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Fallback if only viewing herbal filter */}
              {driveFilter === 'herbal' && herbalDriveProjects.length === 0 && (
                <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                  <p className="text-slate-400 text-sm">No herbal projects match the search filter.</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
