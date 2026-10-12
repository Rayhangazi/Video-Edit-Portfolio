import React, { useState, useEffect, useMemo } from 'react';
import { Project } from '../types/portfolio';
import { getProjectThumbnailCandidates, generateCinematicPoster } from '../utils/thumbnailHelper';

// Module-level permanent cache so thumbnails once resolved stay resolved across re-renders
const resolvedThumbnailCache = new Map<string, string>();

interface ProjectThumbnailProps {
  project: Project;
  bestIndex?: number;
  className?: string;
  aspectClassName?: string;
  alt?: string;
}

export const ProjectThumbnail: React.FC<ProjectThumbnailProps> = ({
  project,
  bestIndex,
  className = '',
  aspectClassName = 'aspect-video',
  alt
}) => {
  const candidates = useMemo(
    () => getProjectThumbnailCandidates(project, bestIndex),
    [project.id, project.videoUrl, project.thumbnailUrl, bestIndex]
  );

  const fallbackPoster = useMemo(
    () => generateCinematicPoster(project),
    [project.id, project.title, project.client, project.aspectRatio, project.category]
  );

  // Check if we already have a successfully resolved URL for this project
  const cachedUrl = resolvedThumbnailCache.get(project.id);
  const initialIdx = cachedUrl ? candidates.indexOf(cachedUrl) : 0;
  const [candidateIdx, setCandidateIdx] = useState<number>(initialIdx >= 0 ? initialIdx : 0);
  const [imgLoaded, setImgLoaded] = useState<boolean>(Boolean(cachedUrl));

  useEffect(() => {
    // If project changes, reset index based on cache or start at 0
    const cached = resolvedThumbnailCache.get(project.id);
    if (cached) {
      const idx = candidates.indexOf(cached);
      setCandidateIdx(idx >= 0 ? idx : 0);
      setImgLoaded(true);
    } else {
      setCandidateIdx(0);
      setImgLoaded(false);
    }
  }, [project.id, candidates]);

  const currentSrc = candidates[candidateIdx] || fallbackPoster;

  const handleLoad = () => {
    setImgLoaded(true);
    if (currentSrc && !currentSrc.startsWith('data:')) {
      resolvedThumbnailCache.set(project.id, currentSrc);
    }
  };

  const handleError = () => {
    if (candidateIdx < candidates.length - 1) {
      setCandidateIdx(prev => prev + 1);
    } else {
      // Reached end of candidates, use fallback poster
      setImgLoaded(true);
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#0A0D16] select-none ${aspectClassName} ${className}`}
      style={{
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden'
      }}
    >
      {/* Permanent Base Layer: Instant High-Res SVG Poster (Zero network latency, never blanks out) */}
      <img
        src={fallbackPoster}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        style={{
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden'
        }}
      />

      {/* Primary Thumbnail Image - Preloaded, persistent, never disappears on mouse move */}
      {currentSrc !== fallbackPoster && (
        <img
          src={currentSrc}
          alt={alt || project.title}
          loading="eager"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none select-none transition-opacity duration-300 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        />
      )}

      {/* Subtle Cinematic Vignette for clean contrast - Static, never flickers on mouse move */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#0A0D16]/90 via-black/20 to-transparent pointer-events-none select-none"
        style={{
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      />
    </div>
  );
};
