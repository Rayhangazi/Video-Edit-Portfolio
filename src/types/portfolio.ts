export type ProjectCategory = 'commercial' | 'youtube' | 'music_video' | 'short_form';

export type AspectRatio = '16:9' | '9:16';

export type VideoSourceType = 'youtube' | 'gdrive' | 'direct';

export interface Project {
  id: string;
  title: string;
  client: string;
  category: ProjectCategory;
  aspectRatio: AspectRatio;
  videoSource: VideoSourceType;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: string;
  tools: string[];
  metrics?: string;
  description: string;
  featured?: boolean;
  year: string;
  accentColor?: string;
  subCategory?: string;
  originalName?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  companyOrChannel: string;
  metricHighlight: string;
  quote: string;
  projectReference?: string;
}

export type AppPage = 'home' | 'projects' | 'showreel' | 'reviews' | 'contact' | 'admin';

export interface TrafficEvent {
  id: string;
  timestamp: number;
  type: 'page_view' | 'video_play' | 'category_filter' | 'share_link' | 'inquiry_submit';
  page?: AppPage;
  details: string;
  category?: string;
  videoTitle?: string;
  device: 'Mobile' | 'Desktop' | 'Tablet';
  location: string;
  sessionId?: string;
  referrer?: string;
  browser?: string;
  durationSeconds?: number;
}

export interface TrafficStats {
  totalVisitors: number;
  totalPageViews: number;
  totalVideoPlays: number;
  avgSessionSeconds: number;
  bounceRatePercent: number;
  todayVisitors: number;
  weeklyVisitors: number;
  activeNow?: number;
  uniqueSessions?: number;
}

export interface SiteSettings {
  editorName: string;
  roleTitle: string;
  bio: string;
  totalViews: string;
  projectsDelivered: string;
  turnaroundHours: string;
  clientRetention: string;
  email: string;
  adminPin: string;
  showreelUrl: string;
  showreelSource: VideoSourceType;
  showreelThumbnailUrl?: string;
}

export interface InquiryFormData {
  name: string;
  email: string;
  category: ProjectCategory | 'general';
  budget: string;
  timeline: string;
  projectBrief: string;
}
