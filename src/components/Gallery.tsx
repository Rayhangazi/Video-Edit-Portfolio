import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project, ProjectCategory } from '../types/portfolio';
import { getYouTubeThumbnail, getGoogleDriveThumbnail } from '../utils/videoUtils';
import { BestVideosSection } from './BestVideosSection';
import { AnalyticsMetricBar } from './AnalyticsMetricBar';
import { ProjectThumbnail } from './ProjectThumbnail';
import { Play, Youtube, HardDrive, Smartphone, Film, Search, X, Sparkles, Leaf, Star, ChevronRight, Share2, MessageCircle, Check, Filter } from 'lucide-react';

// =========================================================================
// PROJECT CARD
// =========================================================================
interface ProjectCardProps {
  project: Project;
  onSelect: (p: Project) => void;
  onShare: (p: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect, onShare }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const ytThumb = project.videoSource === 'youtube' ? getYouTubeThumbnail(project.videoUrl) : null;
  const driveThumb = project.videoSource === 'gdrive' ? getGoogleDriveThumbnail(project.videoUrl) : null;
  const displayImage = project.thumbnailUrl || ytThumb || driveThumb;

  const isShortForm = project.aspectRatio === '9:16' || project.category === 'short_form';
  const isHerbal = project.tools.includes('Herbal Formula') || project.title.toLowerCase().includes('herbal');

  const getCategoryLabel = (cat: ProjectCategory) => {
    switch (cat) {
      case 'commercial': return 'Commercial';
      case 'youtube': return 'YouTube Cut';
      case 'music_video': return 'Music Video';
      case 'short_form': return '9:16 Reel';
      default: return 'Production';
    }
  };

  return (
    <div
      onClick={() => onSelect(project)}
      style={{
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden'
      }}
      className={`group relative rounded-2xl overflow-hidden glass-card cursor-pointer transition-all duration-300 hover:-translate-y-1 active:scale-[0.99] flex flex-col justify-between ${
        isHerbal
          ? 'border-emerald-500/30 hover:border-emerald-400/60 shadow-emerald-950/20'
          : 'border-cyan-500/20 hover:border-cyan-400/50 shadow-black/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]'
      }`}
    >
      {/* Media Thumbnail Container with Guaranteed Persistent Loading */}
      <div 
        className="relative w-full overflow-hidden"
        style={{
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden'
        }}
      >
        <ProjectThumbnail
          project={project}
          aspectClassName={isShortForm ? 'aspect-[9/14] sm:aspect-[9/12]' : 'aspect-video'}
          alt={project.title}
        />

        {/* Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-black shadow-lg scale-90 group-hover:scale-100 transition-transform duration-200 ${
            isHerbal ? 'bg-emerald-400 shadow-emerald-400/30' : 'bg-gradient-to-br from-cyan-400 to-[#00F0FF] shadow-cyan-400/40 text-black'
          }`}>
            <Play className="w-6 h-6 fill-black translate-x-0.5" />
          </div>
        </div>

        {/* Badges on Thumbnail */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between text-xs pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] tracking-wider uppercase border shadow-sm ${
              isHerbal 
                ? 'bg-black/85 text-emerald-300 border-emerald-500/40' 
                : 'bg-black/85 text-cyan-300 border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
            }`}>
              {project.videoSource === 'youtube' ? 'YouTube' : 'Google Drive'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] tracking-wider border shadow-sm ${
              isHerbal
                ? 'bg-black/80 text-emerald-300 border-emerald-500/30'
                : 'bg-black/80 text-cyan-300 border-cyan-500/30'
            }`}>
              HD 1080p
            </span>
            {isShortForm && (
              <span className="px-2 py-0.5 rounded bg-cyan-400 text-black font-bold text-[10px] uppercase tracking-wider">
                9:16
              </span>
            )}
            <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md font-mono text-[11px] tabular-nums border border-white/10 text-white">
              {project.duration}
            </span>
          </div>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-mono">
            <span className={`font-sans font-semibold ${isHerbal ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {getCategoryLabel(project.category)}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{project.client}</span>
            <span aria-hidden="true">·</span>
            <span>{project.year}</span>
          </div>

          {/* Project Title */}
          <h3 className={`font-display font-bold text-base sm:text-lg text-white transition-colors leading-snug ${
            isHerbal ? 'group-hover:text-emerald-400' : 'group-hover:text-cyan-300'
          }`}>
            {project.title}
          </h3>

          {/* Original raw project name */}
          {project.originalName && (
            <p className="text-[11px] text-slate-400 font-mono tracking-tight mt-1 mb-2.5 truncate flex items-center gap-1.5">
              <span className="text-cyan-400 uppercase text-[9px] px-1 py-0.2 rounded bg-cyan-950/40 border border-cyan-500/20">RAW</span>
              <span className="text-slate-400 truncate">{project.originalName}</span>
            </p>
          )}

          {/* Brief description */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {project.description}
          </p>
        </div>

        {/* Bottom Metadata & Actions */}
        <div className="pt-3 border-t border-cyan-500/15 space-y-2">
          <div className="flex items-center justify-between text-xs">
            {project.metrics ? (
              <span className="text-slate-300 font-medium font-mono text-[11px] truncate max-w-[170px] sm:max-w-[200px]">
                {project.metrics}
              </span>
            ) : (
              <span className="text-slate-400 font-mono text-[11px]">
                {project.tools.slice(0, 2).join(' · ')}
              </span>
            )}

            <div className="flex items-center gap-2.5 shrink-0">
              {/* Quick Share Reel Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(project);
                }}
                title="Copy direct share link for this video reel"
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>

              <span className={`text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-0.5 transition-transform ${
                isHerbal ? 'text-emerald-400' : 'text-cyan-400'
              }`}>
                Watch <Play className="w-2.5 h-2.5 fill-current" />
              </span>
            </div>
          </div>

          {/* Thin loading bar under the info that loads when appearing in view */}
          <AnalyticsMetricBar
            percentage={100}
            color={isHerbal ? 'emerald' : 'cyan'}
            heightPx={2}
          />
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// HELPERS
// =========================================================================
const normalizeVideoKey = (val?: string) => {
  if (!val) return '';
  return val
    .toLowerCase()
    .replace(/[—\-_–.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/(v\d+|version \d+|final|edit|cut)/g, '')
    .trim();
};

const isHerbalProject = (p: Project) => {
  const normTitle = (p.title + ' ' + (p.originalName || '') + ' ' + (p.description || '')).toLowerCase();
  return (
    p.tools.includes('Herbal Formula') ||
    p.tools.includes('Direct Video') ||
    normTitle.includes('herbal') ||
    normTitle.includes('shingara') ||
    normTitle.includes('shilajit') ||
    normTitle.includes('natural oil')
  );
};

const isDriveDuplicateOfYouTube = (driveProj: Project, ytProjects: Project[]) => {
  const driveKey = normalizeVideoKey(driveProj.title);
  const driveRawKey = normalizeVideoKey(driveProj.originalName);

  for (const yt of ytProjects) {
    const ytKey = normalizeVideoKey(yt.title);
    const ytRawKey = normalizeVideoKey(yt.originalName);

    if (driveKey && ytKey && (driveKey === ytKey || driveKey.includes(ytKey) || ytKey.includes(driveKey))) {
      return true;
    }
    if (driveRawKey && ytRawKey && driveRawKey === ytRawKey) {
      return true;
    }
  }
  return false;
};

// =========================================================================
// GALLERY COMPONENT
// =========================================================================
export const Gallery: React.FC = () => {
  const { 
    projects, 
    openProjectVideo, 
    shareCategory, 
    shareProject,
    sharedCategoryNotice,
    clearSharedCategoryNotice,
    activeCategory,
    setActiveCategory
  } = usePortfolio();

  // Deduplicate
  const youtubeProjects = projects.filter(p => p.videoSource === 'youtube');
  const driveProjects = projects.filter(
    p => p.videoSource === 'gdrive' && !isDriveDuplicateOfYouTube(p, youtubeProjects)
  );

  // Top level category filter
  type MainCategoryFilter = 'all' | 'commercial' | 'youtube' | 'short_form' | 'gdrive';
  const [mainFilter, setMainFilter] = useState<MainCategoryFilter>(() => {
    if (activeCategory === 'commercial') return 'commercial';
    if (activeCategory === 'youtube') return 'youtube';
    if (activeCategory === 'short_form') return 'short_form';
    return 'all';
  });

  // Google Drive subcategory filter
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
    | 'herbal';

  const [driveFilter, setDriveFilter] = useState<DriveFilterType>('all');
  const [driveSearch, setDriveSearch] = useState('');

  // Handle category change
  const handleSelectCategory = (cat: MainCategoryFilter) => {
    setMainFilter(cat);
    if (cat === 'all') {
      setActiveCategory('all');
    } else if (cat === 'gdrive') {
      setActiveCategory('all');
    } else {
      setActiveCategory(cat as ProjectCategory);
    }
    clearSharedCategoryNotice();
  };

  // Filtered drive projects
  const filteredDriveProjects = driveProjects.filter(p => {
    if (driveFilter === 'all') {
      // pass
    } else if (driveFilter === 'new_2026') {
      if (p.year !== '2026' && p.subCategory !== 'archive_classics') return false;
    } else if (driveFilter === 'archive_classics') {
      if (p.subCategory !== 'archive_classics' && p.year !== '2023') return false;
    } else if (driveFilter === 'herbal') {
      return isHerbalProject(p);
    } else {
      if (p.subCategory !== driveFilter) return false;
    }

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

  const nonHerbalDriveProjects = filteredDriveProjects.filter(p => !isHerbalProject(p));
  const herbalDriveProjects = filteredDriveProjects.filter(p => isHerbalProject(p));
  const displayedDriveProjects = driveFilter === 'herbal'
    ? filteredDriveProjects
    : [...nonHerbalDriveProjects, ...herbalDriveProjects];

  // Projects filtered by main category
  const commercialProjects = projects.filter(p => p.category === 'commercial');
  const shortFormProjects = projects.filter(p => p.category === 'short_form' || p.aspectRatio === '9:16');

  // Share active category helper
  const handleShareCurrentCategory = () => {
    let catId = mainFilter;
    let label = 'Complete Showcase';
    if (mainFilter === 'commercial') label = 'Commercials & Brand Ads';
    if (mainFilter === 'youtube') label = 'YouTube & Retention Cuts';
    if (mainFilter === 'short_form') label = '9:16 Short-Form Reels';
    if (mainFilter === 'gdrive') label = 'Google Drive Client Demos';
    shareCategory(catId, label);
  };

  const handleShareWhatsAppCurrentCategory = () => {
    let label = 'Portfolio';
    if (mainFilter === 'commercial') label = 'Commercials & Brand Ads';
    if (mainFilter === 'youtube') label = 'YouTube & Retention Cuts';
    if (mainFilter === 'short_form') label = '9:16 Short-Form Reels';
    if (mainFilter === 'gdrive') label = 'Google Drive Demos';
    const url = `${window.location.origin}${window.location.pathname}?page=projects&category=${mainFilter}`;
    const text = encodeURIComponent(`Check out Rayhan Gazi's ${label}: ${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <section id="works" className="py-12 sm:py-16 space-y-16 sm:space-y-20 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* 1. Best Videos Section On Top */}
      <BestVideosSection />

      {/* 2. Global Category Selector & Sharable Buttons */}
      <div className="pt-8 border-t border-cyan-500/15 space-y-6">
        
        {/* Header & Share Category Callout */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-2 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
              Curated Client Showcase
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Post-Production Project Portfolio
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Select or share individual categories with your brand stakeholders & creative leads
            </p>
          </div>

          {/* Prominent Share Category Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5 p-1.5 rounded-2xl glass-panel self-start lg:self-auto shadow-lg">
            <button
              onClick={handleShareCurrentCategory}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-[#00F0FF] hover:from-cyan-400 hover:to-cyan-300 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              title="Copy shareable link for currently active category"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share This Category</span>
            </button>

            <button
              onClick={handleShareWhatsAppCurrentCategory}
              className="px-3 py-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Share category directly on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Shared Category Alert Banner (If client came from direct shared link) */}
        {sharedCategoryNotice && (
          <div className="p-3.5 sm:p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between gap-3 text-xs sm:text-sm text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Viewing Curated Category: <strong className="uppercase font-mono text-white">{sharedCategoryNotice}</strong>
              </span>
            </div>
            <button
              onClick={() => handleSelectCategory('all')}
              className="px-3 py-1 rounded-lg bg-black/50 hover:bg-black/70 text-cyan-300 font-medium text-xs border border-cyan-500/30 transition-colors cursor-pointer"
            >
              View All Categories
            </button>
          </div>
        )}

        {/* Master Category Filter Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
          <button
            onClick={() => handleSelectCategory('all')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              mainFilter === 'all'
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                : 'glass-card text-slate-300 hover:text-cyan-200 hover:border-cyan-400/40'
            }`}
          >
            <span>All Works ({projects.length})</span>
          </button>

          <button
            onClick={() => handleSelectCategory('commercial')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              mainFilter === 'commercial'
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                : 'glass-card text-slate-300 hover:text-cyan-200 hover:border-cyan-400/40'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Commercials ({commercialProjects.length})</span>
          </button>

          <button
            onClick={() => handleSelectCategory('youtube')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              mainFilter === 'youtube'
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                : 'glass-card text-slate-300 hover:text-cyan-200 hover:border-cyan-400/40'
            }`}
          >
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            <span>YouTube Showcase ({youtubeProjects.length})</span>
          </button>

          <button
            onClick={() => handleSelectCategory('short_form')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              mainFilter === 'short_form'
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                : 'glass-card text-slate-300 hover:text-cyan-200 hover:border-cyan-400/40'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-300" />
            <span>9:16 Short-Form ({shortFormProjects.length})</span>
          </button>

          <button
            onClick={() => handleSelectCategory('gdrive')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              mainFilter === 'gdrive'
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                : 'glass-card text-slate-300 hover:text-cyan-200 hover:border-cyan-400/40'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5 text-sky-400" />
            <span>Drive Deliverables ({driveProjects.length})</span>
          </button>
        </div>

      </div>

      {/* 3. Projects Display based on Selected Filter */}
      
      {/* (A) When Commercials Filter is Active */}
      {mainFilter === 'commercial' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Showing {commercialProjects.length} Commercial Masterworks</span>
              <span className="font-mono text-cyan-400 font-semibold">16:9 Broadcast Quality</span>
            </div>
            <AnalyticsMetricBar percentage={100} delayMs={100} color="cyan" heightPx={2} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {commercialProjects.map(p => (
              <ProjectCard 
                key={p.id} 
                project={p} 
                onSelect={openProjectVideo} 
                onShare={shareProject} 
              />
            ))}
          </div>
        </div>
      )}

      {/* (B) When YouTube Filter is Active */}
      {mainFilter === 'youtube' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Showing {youtubeProjects.length} YouTube Playlist Mastercuts</span>
              <span className="font-mono text-red-400">Official RG Playlist PLeblsp6_-mB4</span>
            </div>
            <AnalyticsMetricBar percentage={100} delayMs={100} color="red" heightPx={2} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {youtubeProjects.map(p => (
              <ProjectCard 
                key={p.id} 
                project={p} 
                onSelect={openProjectVideo} 
                onShare={shareProject} 
              />
            ))}
          </div>
        </div>
      )}

      {/* (C) When Short-Form (9:16) Filter is Active */}
      {mainFilter === 'short_form' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Showing {shortFormProjects.length} Vertical Social & TikTok Funnel Cuts</span>
              <span className="font-mono text-emerald-400">9:16 Social Retention</span>
            </div>
            <AnalyticsMetricBar percentage={100} delayMs={100} color="emerald" heightPx={2} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {shortFormProjects.map(p => (
              <ProjectCard 
                key={p.id} 
                project={p} 
                onSelect={openProjectVideo} 
                onShare={shareProject} 
              />
            ))}
          </div>
        </div>
      )}

      {/* (D) When Google Drive Filter is Active */}
      {mainFilter === 'gdrive' && (
        <div className="space-y-8" id="drive-demos">
          {/* Subcategories & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search drive projects by brand or title..."
                value={driveSearch}
                onChange={(e) => setDriveSearch(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/60 transition-colors"
              />
              {driveSearch && (
                <button
                  onClick={() => setDriveSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Subcategory Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => setDriveFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-colors cursor-pointer ${
                  driveFilter === 'all'
                    ? 'bg-blue-500 text-white font-bold'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white'
                }`}
              >
                All Drive ({driveProjects.length})
              </button>
              <button
                onClick={() => setDriveFilter('clothing')}
                className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-colors cursor-pointer ${
                  driveFilter === 'clothing'
                    ? 'bg-blue-500 text-white font-bold'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white'
                }`}
              >
                Clothing
              </button>
              <button
                onClick={() => setDriveFilter('bedding')}
                className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-colors cursor-pointer ${
                  driveFilter === 'bedding'
                    ? 'bg-blue-500 text-white font-bold'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white'
                }`}
              >
                Bedding
              </button>
              <button
                onClick={() => setDriveFilter('skit')}
                className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-colors cursor-pointer ${
                  driveFilter === 'skit'
                    ? 'bg-blue-500 text-white font-bold'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white'
                }`}
              >
                Skits
              </button>
              <button
                onClick={() => setDriveFilter('herbal')}
                className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-colors cursor-pointer ${
                  driveFilter === 'herbal'
                    ? 'bg-emerald-500 text-white font-bold'
                    : 'bg-white/[0.04] text-emerald-400 hover:text-emerald-300'
                }`}
              >
                🌿 Herbal Products
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {displayedDriveProjects.map(p => (
              <ProjectCard 
                key={p.id} 
                project={p} 
                onSelect={openProjectVideo} 
                onShare={shareProject} 
              />
            ))}
          </div>
        </div>
      )}

      {/* (E) When All Works is Active (Default) */}
      {mainFilter === 'all' && (
        <div className="space-y-16">
          
          {/* YouTube Masterworks */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-red-400 font-semibold">
                  <Youtube className="w-4 h-4 text-red-500" />
                  <span>YouTube Commercial & Narrative Showcase ({youtubeProjects.length})</span>
                </div>
                <button
                  onClick={() => handleSelectCategory('youtube')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer font-medium"
                >
                  View Only YouTube
                </button>
              </div>
              <AnalyticsMetricBar percentage={100} delayMs={100} color="red" heightPx={2} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {youtubeProjects.map(p => (
                <ProjectCard 
                  key={p.id} 
                  project={p} 
                  onSelect={openProjectVideo} 
                  onShare={shareProject} 
                />
              ))}
            </div>
          </div>

          {/* Google Drive Deliverables */}
          <div className="space-y-6 pt-12 border-t border-white/[0.08]">
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-blue-400 font-semibold">
                  <HardDrive className="w-4 h-4 text-blue-400" />
                  <span>Google Drive Client Deliverables & Raw Cuts ({driveProjects.length})</span>
                </div>

                {/* Quick search */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Filter drive deliverables..."
                    value={driveSearch}
                    onChange={(e) => setDriveSearch(e.target.value)}
                    className="w-full pl-8 pr-4 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>
              <AnalyticsMetricBar percentage={100} delayMs={100} color="blue" heightPx={2} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {displayedDriveProjects.map(p => (
                <ProjectCard 
                  key={p.id} 
                  project={p} 
                  onSelect={openProjectVideo} 
                  onShare={shareProject} 
                />
              ))}
            </div>
          </div>

        </div>
      )}

    </section>
  );
};
