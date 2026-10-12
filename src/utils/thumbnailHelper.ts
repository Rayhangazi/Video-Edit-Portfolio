import { Project } from '../types/portfolio';
import { extractYouTubeId, extractGoogleDriveId } from './videoUtils';

/**
 * Resolves local assets with proper Vite base URL for GitHub Pages compatibility
 */
export function resolveAssetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const clean = path.replace(/^\/+/, '');
  const base = import.meta.env.BASE_URL;
  if (!base || base === './' || base === '/') {
    return `/${clean}`;
  }
  return base.endsWith('/') ? `${base}${clean}` : `${base}/${clean}`;
}

/**
 * Generates an ultra high-definition, cinema-grade SVG poster Data URI.
 * Guaranteed to NEVER fail, require zero network requests, and stay on permanently.
 */
export function generateCinematicPoster(project: Project): string {
  const isVertical = project.aspectRatio === '9:16' || project.category === 'short_form';
  const width = isVertical ? 720 : 1280;
  const height = isVertical ? 1280 : 720;
  
  // Custom theme accents
  const accentColor = project.accentColor || '#E5A93C';
  const clientName = escapeXml(project.client || 'Rayhan Gazi Master Edit');
  const projectTitle = escapeXml(project.title || 'Production Cut');
  const formatTag = isVertical ? '9:16 VERTICAL SOCIAL REEL' : '16:9 4K BROADCAST MASTER';
  const duration = escapeXml(project.duration || 'HD 1080p');

  // Truncate title for clean fit on poster
  const displayTitle = projectTitle.length > 55 ? projectTitle.slice(0, 52) + '...' : projectTitle;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090A0F"/>
      <stop offset="45%" stop-color="#121624"/>
      <stop offset="100%" stop-color="#1A2035"/>
    </linearGradient>
    <radialGradient id="glowGrad" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.18"/>
      <stop offset="70%" stop-color="${accentColor}" stop-opacity="0.03"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="streakGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${accentColor}" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="${accentColor}" stop-opacity="0"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="1" fill="#ffffff" fill-opacity="0.07"/>
    </pattern>
  </defs>

  <!-- Background Base -->
  <rect width="100%" height="100%" fill="url(#bgGrad)"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect width="100%" height="100%" fill="url(#glowGrad)"/>

  <!-- Anamorphic Lens Flare Line -->
  <rect x="0" y="${height * 0.45}" width="100%" height="2" fill="url(#streakGrad)"/>

  <!-- Center Film Camera & Clapper Emblem -->
  <g transform="translate(${width / 2}, ${height * 0.42}) scale(${isVertical ? 1.4 : 1.2})">
    <circle cx="0" cy="0" r="48" fill="#090A0F" stroke="${accentColor}" stroke-width="2.5" stroke-opacity="0.6"/>
    <!-- Film Reel Spool -->
    <circle cx="-16" cy="-8" r="14" fill="none" stroke="${accentColor}" stroke-width="2"/>
    <circle cx="16" cy="-8" r="14" fill="none" stroke="${accentColor}" stroke-width="2"/>
    <circle cx="-16" cy="-8" r="4" fill="${accentColor}"/>
    <circle cx="16" cy="-8" r="4" fill="${accentColor}"/>
    <!-- Cinema Play Triangle -->
    <polygon points="-6,12 10,2 10,22" fill="${accentColor}"/>
  </g>

  <!-- Top Metadata Bar -->
  <g transform="translate(48, 56)">
    <rect x="0" y="0" width="${isVertical ? 220 : 250}" height="28" rx="6" fill="#000000" fill-opacity="0.75" stroke="${accentColor}" stroke-width="1" stroke-opacity="0.4"/>
    <text x="12" y="19" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="${accentColor}" letter-spacing="1.5">
      ${formatTag}
    </text>
  </g>

  <!-- Top Right Duration -->
  <g transform="translate(${width - 120}, 56)">
    <rect x="0" y="0" width="72" height="28" rx="6" fill="#000000" fill-opacity="0.75" stroke="#ffffff" stroke-width="1" stroke-opacity="0.2"/>
    <text x="36" y="19" font-family="monospace, 'Courier New'" font-size="12" font-weight="600" fill="#ffffff" text-anchor="middle">
      ${duration}
    </text>
  </g>

  <!-- Bottom Title Card Container -->
  <g transform="translate(48, ${height - (isVertical ? 220 : 160)})">
    <rect x="0" y="0" width="${width - 96}" height="${isVertical ? 160 : 110}" rx="16" fill="#000000" fill-opacity="0.85" stroke="#ffffff" stroke-width="1" stroke-opacity="0.12"/>
    
    <!-- Client Kicker -->
    <text x="24" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${isVertical ? 16 : 14}" font-weight="600" fill="${accentColor}" letter-spacing="1.2">
      ${clientName.toUpperCase()}
    </text>
    
    <!-- Title -->
    <text x="24" y="${isVertical ? 76 : 70}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${isVertical ? 24 : 22}" font-weight="800" fill="#ffffff">
      ${displayTitle}
    </text>

    <!-- Subtitle / Brand info -->
    <text x="24" y="${isVertical ? 116 : 94}" font-family="monospace, 'Courier New'" font-size="12" fill="#94A3B8">
      Rayhan Gazi · DaVinci Resolve Studio · 1080p Master Deliverable
    </text>
  </g>
</svg>
`.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Returns an ordered array of candidate thumbnail URLs for a project.
 * Ordered by highest priority first.
 */
export function getProjectThumbnailCandidates(project: Project, bestIndex?: number): string[] {
  const candidates: string[] = [];

  // Special verified local posters for the 5 Best Video Releases
  if (bestIndex && bestIndex >= 1 && bestIndex <= 5) {
    candidates.push(resolveAssetUrl(`og-best-${bestIndex}.jpg`));
  } else if (project.title.toLowerCase().includes('prime living') && project.title.toLowerCase().includes('bed topper')) {
    candidates.push(resolveAssetUrl('og-best-1.jpg'));
  } else if (project.title.toLowerCase().includes('comforter 3')) {
    candidates.push(resolveAssetUrl('og-best-2.jpg'));
  } else if (project.title.toLowerCase().includes('serene nights')) {
    candidates.push(resolveAssetUrl('og-best-3.jpg'));
  } else if (project.title.toLowerCase().includes('order-to-delivery') || project.title.toLowerCase().includes('ratul')) {
    candidates.push(resolveAssetUrl('og-best-4.jpg'));
  } else if (project.title.toLowerCase().includes('tashrif international')) {
    candidates.push(resolveAssetUrl('og-best-5.jpg'));
  }

  // Explicit thumbnailUrl on the project
  if (project.thumbnailUrl) {
    candidates.push(resolveAssetUrl(project.thumbnailUrl));
  }

  // YouTube candidates
  if (project.videoSource === 'youtube') {
    const ytId = extractYouTubeId(project.videoUrl);
    if (ytId) {
      candidates.push(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);
      candidates.push(`https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`);
      candidates.push(`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`);
    }
  }

  // Google Drive candidates
  if (project.videoSource === 'gdrive') {
    const driveId = extractGoogleDriveId(project.videoUrl);
    if (driveId) {
      candidates.push(`https://lh3.googleusercontent.com/d/${driveId}=w800`);
      candidates.push(`https://drive.google.com/thumbnail?id=${driveId}&sz=w800`);
    }
  }

  // Default global cover
  candidates.push(resolveAssetUrl('og-cover.jpg'));

  // Guaranteed permanent SVG poster (Zero network requests, never fails)
  candidates.push(generateCinematicPoster(project));

  // Deduplicate preserving order
  return Array.from(new Set(candidates));
}
