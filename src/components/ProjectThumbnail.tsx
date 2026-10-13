import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Project } from '../types/portfolio';
import { getProjectThumbnailCandidates, generateCinematicPoster } from '../utils/thumbnailHelper';

// Module-level permanent cache: once an image URL is verified working for a project,
// it is permanently retained across any renders, navigations, or hover states.
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
  const currentProjectIdRef = useRef(project.id);

  // Compute thumbnail candidate URLs in order of preference
  const candidates = useMemo(
    () => getProjectThumbnailCandidates(project, bestIndex),
    [project.id, project.videoUrl, project.thumbnailUrl, bestIndex]
  );

  // High-definition SVG fallback poster with glowing cyan glass styling
  const fallbackPoster = useMemo(
    () => generateCinematicPoster(project),
    [project.id, project.title, project.client, project.aspectRatio, project.category, project.duration]
  );

  // Check if we have a previously resolved working URL in cache
  const cachedUrl = resolvedThumbnailCache.get(project.id);
  const initialIndex = cachedUrl ? Math.max(0, candidates.indexOf(cachedUrl)) : 0;

  const [candidateIdx, setCandidateIdx] = useState<number>(initialIndex);
  const [imgLoaded, setImgLoaded] = useState<boolean>(Boolean(cachedUrl));

  // Only reset if the project ID genuinely changed to a different project
  useEffect(() => {
    if (currentProjectIdRef.current !== project.id) {
      currentProjectIdRef.current = project.id;
      const cached = resolvedThumbnailCache.get(project.id);
      if (cached) {
        const idx = candidates.indexOf(cached);
        setCandidateIdx(idx >= 0 ? idx : 0);
        setImgLoaded(true);
      } else {
        setCandidateIdx(0);
        setImgLoaded(false);
      }
    }
  }, [project.id, candidates]);

  const currentSrc = candidates[candidateIdx] || fallbackPoster;

  const handleLoad = () => {
    setImgLoaded(true);
    if (currentSrc) {
      resolvedThumbnailCache.set(project.id, currentSrc);
    }
  };

  const handleError = () => {
    // If the current candidate fails, try next candidate immediately
    if (candidateIdx < candidates.length - 1) {
      setCandidateIdx(prev => prev + 1);
    } else {
      // Reached end of candidates, mark as loaded so the SVG fallback stays firmly on
      setImgLoaded(true);
      resolvedThumbnailCache.set(project.id, fallbackPoster);
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#060D17] select-none ${aspectClassName} ${className}`}
      style={{
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden'
      }}
    >
      {/* 
        LAYER 1: Permanent Base Poster Layer (Zero network latency, 100% visible, never disappears on mouse move)
        Rendered immediately so the user NEVER sees a black/blank card even before images load.
      */}
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

      {/* 
        LAYER 2: Resolved Video Thumbnail (Eagerly preloaded, pointer-events disabled to prevent mouse glitches)
        Once loaded, it stays permanently on and will never flicker on hover or mouse movement.
      */}
      {currentSrc !== fallbackPoster && (
        <img
          src={currentSrc}
          alt={alt || project.title}
          loading="eager"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none select-none transition-opacity duration-200 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        />
      )}

      {/* 
        LAYER 3: Cinematic Glass Vignette - Adds contrast for text and badges without hiding thumbnails
      */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#060D17]/90 via-transparent to-black/20 pointer-events-none select-none"
        style={{
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      />
    </div>
  );
};
