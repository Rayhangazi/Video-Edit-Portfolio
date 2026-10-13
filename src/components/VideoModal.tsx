import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { getEmbedUrl } from '../utils/videoUtils';
import { X, Film, Smartphone, Loader2, Sparkles } from 'lucide-react';

export const VideoModal: React.FC = () => {
  const { activeVideo, closeVideoModal } = usePortfolio();
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state whenever active video changes
  useEffect(() => {
    if (activeVideo?.isOpen) {
      setIsLoading(true);
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
      document.body.style.overflow = 'auto';
    };
  }, [activeVideo?.isOpen, closeVideoModal]);

  if (!activeVideo || !activeVideo.isOpen) return null;

  const isVertical = activeVideo.aspectRatio === '9:16';
  const embedUrl = getEmbedUrl(activeVideo.videoUrl, activeVideo.source);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md transition-opacity duration-300">
      
      {/* Click outside backdrop */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={closeVideoModal} 
        aria-label="Close modal overlay"
      />

      {/* Modal Dialog Card with smooth pop-in animation */}
      <div className={`relative z-10 w-full glass-panel border border-cyan-500/30 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.8),0_0_35px_rgba(6,182,212,0.2)] overflow-hidden flex flex-col max-h-[94vh] transform-gpu transition-all duration-300 ease-out animate-in fade-in zoom-in-95 ${
        isVertical ? 'max-w-md' : 'max-w-5xl'
      }`}>
        
        {/* Header Bar */}
        <div className="px-4 sm:px-5 py-3 border-b border-cyan-500/20 flex items-center justify-between gap-3 bg-[#060D17]/90 backdrop-blur-xl">
          <div className="flex items-center gap-2.5 min-w-0">
            {isVertical ? (
              <Smartphone className="w-4 h-4 text-cyan-400 shrink-0" />
            ) : (
              <Film className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400 font-mono shrink-0">
                  {activeVideo.source === 'youtube' ? 'YouTube' : activeVideo.source === 'gdrive' ? 'Google Drive' : 'Direct Stream'}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.25)]">
                  HD 1080p
                </span>
                <span className="text-slate-600 hidden sm:inline">·</span>
                <h3 className="text-xs sm:text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-md">
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

          <button
            onClick={closeVideoModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] active:scale-95 transition-all shrink-0 cursor-pointer"
            aria-label="Close video player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Frame with smooth loading overlay */}
        <div className={`relative w-full bg-black flex items-center justify-center overflow-hidden ${
          isVertical ? 'aspect-[9/16] max-h-[65vh]' : 'aspect-video w-full'
        }`}>
          {/* Smooth Video Loading State Indicator */}
          {isLoading && (
            <div className="absolute inset-0 z-20 bg-[#060D17] flex flex-col items-center justify-center gap-3 transition-opacity duration-300">
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

            <div className="flex flex-row sm:flex-col sm:items-end justify-between sm:justify-start gap-1.5 shrink-0 text-xs font-mono border-t sm:border-t-0 pt-2 sm:pt-0 border-cyan-500/15">
              {activeVideo.metrics && (
                <div className="text-emerald-400 font-semibold text-[11px] sm:text-xs">
                  {activeVideo.metrics}
                </div>
              )}
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
