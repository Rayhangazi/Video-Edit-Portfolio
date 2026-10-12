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
}

export interface InquiryFormData {
  name: string;
  email: string;
  category: ProjectCategory | 'general';
  budget: string;
  timeline: string;
  projectBrief: string;
}
