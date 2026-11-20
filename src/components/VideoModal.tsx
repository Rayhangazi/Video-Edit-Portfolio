import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { getEmbedUrl, getDirectWatchUrl, buildPortfolioUrl, copyToClipboard } from '../utils/videoUtils';
import { X, Film, Smartphone, Loader2, ExternalLink, Share2 } from 'lucide-react';

export const VideoModal: React.FC = () => {
  const { activeVideo, closeVideoModal, showToast, logTraffic } = usePortfolio();
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state whenever active video changes, with a safety timeout so spinner never hangs
  useEffect(() => {
    if (activeVideo?.isOpen) {
      setIsLoading(true);
      const fallbackTimer = setTimeout(() => {
        setIsLoading(false);
      }, 2400);
      return () => clearTimeout(fallbackTimer);
    }
  }, [activeVideo?.videoUrl, activeVideo?.isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeVideoModal();
      }
    };
    if (activeVideo?.isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeVideo?.isOpen, closeVideoModal]);

  if (!activeVideo || !activeVideo.isOpen) return null;

  const isVertical = activeVideo.aspectRatio === '9:16';
  const embedUrl = getEmbedUrl(activeVideo.videoUrl, activeVideo.source);
  const directWatchUrl = getDirectWatchUrl(activeVideo.videoUrl, activeVideo.source);
  const sourceLabel = activeVideo.source === 'youtube' ? 'YouTube' : activeVideo.source === 'gdrive' ? 'Google Drive' : 'Direct Stream';

  const handleCopyModalVideoLink = () => {
    const shareUrl = activeVideo.id === 'showreel-master'
      ? buildPortfolioUrl({ page: 'showreel' })
      : buildPortfolioUrl({
          page: 'projects',
          category: activeVideo.category || undefined,
          video: activeVideo.id || undefined
        });
    copyToClipboard(shareUrl);
    showToast(`🔗 Copied share link for "${activeVideo.title}"`);
    logTraffic('share_link', `Copied modal video link: "${activeVideo.title}"`, { videoTitle: activeVideo.title });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md transition-opacity duration-300"
    >
      
      {/* Click outside backdrop */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={closeVideoModal} 
        aria-hidden="true"
      />

      {/* Modal Dialog Card with smooth pop-in animation */}
      <div 
        style={{
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden'
        }}
        className={`relative z-10 w-full glass-panel border border-cyan-500/30 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.8),0_0_35px_rgba(6,182,212,0.2)] overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[94vh] transform-gpu transition-all duration-300 ease-out animate-in fade-in zoom-in-95 gpu-stabilize ${
          isVertical ? 'max-w-md' : 'max-w-5xl'
        }`}
      >
        
        {/* Header Bar */}
        <div className="px-3.5 sm:px-5 py-2.5 sm:py-3 border-b border-cyan-500/20 flex items-center justify-between gap-2.5 bg-[#060D17]/90 backdrop-blur-xl gpu-stabilize">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            {isVertical ? (
              <Smartphone className="w-4 h-4 text-cyan-400 shrink-0" />
            ) : (
              <Film className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400 font-mono shrink-0">
                  {sourceLabel}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[9px] sm:text-[10px] font-mono font-bold shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.25)]">
                  HD 1080p
                </span>
                <span className="text-slate-600 hidden sm:inline">·</span>
                <h3 id="video-modal-title" className="text-xs sm:text-sm font-semibold text-white truncate max-w-[140px] xs:max-w-[190px] sm:max-w-md">
                  {activeVideo.title}
                </h3>
              </div>
              {activeVideo.originalName && (
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-mono truncate mt-0.5">
                  Raw File: <span className="text-cyan-300">{activeVideo.originalName}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleCopyModalVideoLink}
              title="Copy shareable link to this video"
              className="p-2 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden md:inline">Share</span>
            </button>

            {directWatchUrl && (
              <a
                href={directWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Open directly on ${sourceLabel}`}
                className="px-2.5 py-2 rounded-xl text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Open in {sourceLabel}</span>
              </a>
            )}

            <button
              type="button"
              onClick={closeVideoModal}
              className="min-h-[40px] min-w-[40px] p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.08] active:scale-95 transition-all shrink-0 cursor-pointer flex items-center justify-center"
              aria-label="Close video player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Frame with smooth loading overlay */}
        <div className={`relative w-full bg-black flex items-center justify-center overflow-hidden ${
          isVertical ? 'aspect-[9/16] max-h-[65vh]' : 'aspect-video w-full'
        }`}>
          {/* Smooth Video Loading State Indicator */}
          {isLoading && (
            <div className="absolute inset-0 z-20 bg-[#060D17] flex flex-col items-center justify-center gap-3 transition-opacity duration-300 pointer-events-none">
              <div className="relative">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                <div className="absolute inset-0 rounded-full blur-sm bg-cyan-400/30" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-mono text-cyan-300 tracking-wider">
                  Loading HD Stream...
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Buffering master deliverable in 1080p
                </span>
              </div>
            </div>
          )}

          {activeVideo.source === 'direct' ? (
            <video
              src={activeVideo.videoUrl}
              controls
              autoPlay
              playsInline
              onLoadedData={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
              className="w-full h-full object-contain"
            >
              Your browser does not support HTML5 video playback.
            </video>
          ) : (
            <iframe
              src={embedUrl}
              title={activeVideo.title}
              onLoad={() => setIsLoading(false)}
              className={`w-full h-full border-0 transition-opacity duration-300 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>

        {/* Metadata & Project Insights Bar */}
        <div className="p-4 sm:p-5 border-t border-cyan-500/20 bg-[#060D17]/95 backdrop-blur-xl overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
            
            <div className="space-y-1">
              <div className="text-xs text-cyan-400 font-mono">
                Client: <span className="text-white font-medium">{activeVideo.client}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl line-clamp-3 sm:line-clamp-none">
                {activeVideo.description}
              </p>
            </div>

            <div className="flex flex-col sm:items-end justify-start gap-2 shrink-0 text-xs font-mono border-t sm:border-t-0 pt-2 sm:pt-0 border-cyan-500/15">
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full">
                {activeVideo.metrics && (
                  <div className="text-emerald-400 font-semibold text-[11px] sm:text-xs">
                    {activeVideo.metrics}
                  </div>
                )}
                {directWatchUrl && (
                  <a
                    href={directWatchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sm:hidden inline-flex items-center gap-1 text-[11px] text-cyan-300 hover:text-white underline"
                  >
                    <span>Watch on {sourceLabel}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              {activeVideo.tools && activeVideo.tools.length > 0 && (
                <div className="text-slate-400 text-[10px] sm:text-[11px]">
                  {activeVideo.tools.join(' · ')}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
