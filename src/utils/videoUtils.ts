import { VideoSourceType } from '../types/portfolio';

/**
 * Extracts a YouTube video ID from various YouTube URL formats (standard, short, embed, shorts)
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  
  // Standard watch URL: youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }
  
  // If user entered just the 11 character ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  
  return null;
}

/**
 * Extracts Google Drive File ID from shared links
 */
export function extractGoogleDriveId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  
  // Format: drive.google.com/file/d/FILE_ID/view...
  const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (fileMatch && fileMatch[1]) {
    return fileMatch[1];
  }
  
  // Format: drive.google.com/open?id=FILE_ID
  const openMatch = trimmed.match(/drive\.google\.com\/.*[?&]id=([a-zA-Z0-9_-]+)/i);
  if (openMatch && openMatch[1]) {
    return openMatch[1];
  }
  
  return null;
}

/**
 * Determines the most likely video source based on URL content
 */
export function detectVideoSource(url: string): VideoSourceType {
  if (!url) return 'youtube';
  const trimmed = url.trim().toLowerCase();
  
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    return 'youtube';
  }
  
  if (trimmed.includes('drive.google.com')) {
    return 'gdrive';
  }
  
  return 'direct';
}

/**
 * Resolves embeddable playback URL for modal viewing
 */
export function getEmbedUrl(url: string, source: VideoSourceType): string {
  if (!url) return '';
  const trimmed = url.trim();
  
  if (source === 'youtube') {
    const ytId = extractYouTubeId(trimmed);
    if (ytId) {
      // &vq=hd1080&hd=1 requests highest available HD definition
      return `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&vq=hd1080&hd=1`;
    }
    return trimmed;
  }
  
  if (source === 'gdrive') {
    const driveId = extractGoogleDriveId(trimmed);
    if (driveId) {
      return `https://drive.google.com/file/d/${driveId}/preview`;
    }
    // If it's already an embed/preview link
    if (trimmed.includes('/preview')) {
      return trimmed;
    }
    return trimmed;
  }
  
  return trimmed;
}

/**
 * Generates high quality YouTube thumbnail URL if applicable
 */
export function getYouTubeThumbnail(url: string): string | null {
  const ytId = extractYouTubeId(url);
  if (!ytId) return null;
  return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
}

/**
 * Generates Google Drive thumbnail URL using high-speed direct LH3 CDN
 */
export function getGoogleDriveThumbnail(url: string): string | null {
  const driveId = extractGoogleDriveId(url);
  if (!driveId) return null;
  return `https://drive.google.com/thumbnail?id=${driveId}&sz=w800`;
}

/**
 * Validates whether a video URL has proper syntax
 */
export function isValidVideoUrl(url: string, source: VideoSourceType): boolean {
  if (!url || url.trim().length === 0) return false;
  
  if (source === 'youtube') {
    return extractYouTubeId(url) !== null;
  }
  
  if (source === 'gdrive') {
    return extractGoogleDriveId(url) !== null || url.includes('drive.google.com');
  }
  
  // Direct video URL validation (basic URL pattern)
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
