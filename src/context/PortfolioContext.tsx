import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  Project, Testimonial, SiteSettings, ProjectCategory, AspectRatio, 
  VideoSourceType, AppPage, TrafficEvent, TrafficStats 
} from '../types/portfolio';
import { DEFAULT_PROJECTS, DEFAULT_TESTIMONIALS, DEFAULT_SITE_SETTINGS } from '../data/defaultData';
import { extractGoogleDriveId } from '../utils/videoUtils';
import { 
  getStoredTrafficEvents, recordTrafficEvent, computeTrafficStats, 
  resetTrafficStorage 
} from '../utils/trafficTracker';

export interface ActiveVideoState {
  isOpen: boolean;
  title: string;
  originalName?: string;
  client: string;
  videoUrl: string;
  source: VideoSourceType;
  aspectRatio: AspectRatio;
  description: string;
  duration: string;
  tools: string[];
  metrics?: string;
  category?: string;
  thumbnailUrl?: string;
}

interface PortfolioContextType {
  // Projects & Data
  projects: Project[];
  testimonials: Testimonial[];
  settings: SiteSettings;
  activeCategory: ProjectCategory | 'all';
  setActiveCategory: (cat: ProjectCategory | 'all') => void;
  activeVideo: ActiveVideoState | null;
  openProjectVideo: (project: Project) => void;
  openShowreelVideo: () => void;
  closeVideoModal: () => void;
  
  // Page Navigation & Transitions
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;
  isPageTransitioning: boolean;
  transitionLabel: string;
  navigateTo: (page: AppPage, category?: ProjectCategory | 'all' | string, options?: { transitionLabel?: string }) => void;
  
  // Toast & Sharable Buttons
  toastMessage: string | null;
  showToast: (message: string) => void;
  hideToast: () => void;
  shareCategory: (categoryId: string, label: string) => void;
  shareProject: (project: Project) => void;
  shareShowreel: () => void;
  sharedCategoryNotice: string | null;
  clearSharedCategoryNotice: () => void;

  // Site Traffic & Analytics
  trafficEvents: TrafficEvent[];
  trafficStats: TrafficStats;
  logTraffic: (type: TrafficEvent['type'], details: string, meta?: Partial<TrafficEvent>) => void;
  resetTraffic: (regenerateSeed?: boolean) => void;

  // Google Drive Category Operations
  updateProjectCategory: (projectId: string, category: ProjectCategory, subCategory?: string) => void;
  batchUpdateCategories: (projectIds: string[], category: ProjectCategory, subCategory?: string) => void;
  googleDriveSubCategories: string[];
  addGoogleDriveSubCategory: (subCatName: string) => void;
  importGoogleDriveProjects: (items: {
    videoUrl: string;
    title: string;
    client: string;
    category: ProjectCategory;
    subCategory?: string;
    aspectRatio?: AspectRatio;
    duration?: string;
    description?: string;
  }[]) => number;

  // Admin & CMS State
  isAdminOpen: boolean;
  isAuthenticated: boolean;
  openAdminModal: () => void;
  closeAdminModal: () => void;
  verifyAdminPin: (pin: string) => boolean;
  logoutAdmin: () => void;
  
  // CRUD
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  addTestimonial: (test: Omit<Testimonial, 'id'>) => void;
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  
  updateSettings: (updates: Partial<SiteSettings>) => void;
  resetToDefaults: () => void;
  syncYouTubePlaylist: () => void;
  exportDataToJson: () => string;
  importDataFromJson: (jsonStr: string) => { success: boolean; error?: string };
}

const STORAGE_KEY_PROJECTS = 'rayhan_gazi_projects_v12';
const STORAGE_KEY_TESTIMONIALS = 'rayhan_gazi_testimonials_v12';
const STORAGE_KEY_SETTINGS = 'rayhan_gazi_settings_v12';
const STORAGE_KEY_DRIVE_SUBCATS = 'rayhan_gazi_drive_subcategories_v1';
const STORAGE_KEY_AUTH = 'rayhan_gazi_admin_auth_v1';

const DEFAULT_DRIVE_SUBCATS = [
  'clothing', 'bedding', 'skit', 'fashion', 'corporate', 
  'motion', 'herbal', 'archive_classics', 'new_2026'
];

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: Project) => {
            const def = DEFAULT_PROJECTS.find(dp => dp.id === p.id);
            if (def && def.thumbnailUrl) {
              return { ...p, thumbnailUrl: def.thumbnailUrl };
            }
            return p;
          });
        }
      }
    } catch (e) {
      console.warn('Failed to load projects from localStorage', e);
    }
    return DEFAULT_PROJECTS;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TESTIMONIALS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load testimonials from localStorage', e);
    }
    return DEFAULT_TESTIMONIALS;
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        const adminPin = parsed.adminPin === '1234' ? '6463' : (parsed.adminPin || '6463');
        return {
          ...DEFAULT_SITE_SETTINGS,
          ...parsed,
          adminPin,
          showreelThumbnailUrl: parsed.showreelThumbnailUrl || DEFAULT_SITE_SETTINGS.showreelThumbnailUrl
        };
      }
    } catch (e) {
      console.warn('Failed to load settings from localStorage', e);
    }
    return DEFAULT_SITE_SETTINGS;
  });

  const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'all'>('all');
  const [activeVideo, setActiveVideo] = useState<ActiveVideoState | null>(null);

  // Multi-page navigation state
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [isPageTransitioning, setIsPageTransitioning] = useState<boolean>(false);
  const [transitionLabel, setTransitionLabel] = useState<string>('Loading...');

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sharedCategoryNotice, setSharedCategoryNotice] = useState<string | null>(null);

  // Admin CMS & Panel State
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Google Drive Subcategories
  const [googleDriveSubCategories, setGoogleDriveSubCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DRIVE_SUBCATS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // Ignore
    }
    return DEFAULT_DRIVE_SUBCATS;
  });

  // Traffic & Analytics State
  const [trafficEvents, setTrafficEvents] = useState<TrafficEvent[]>(() => getStoredTrafficEvents());
  const [trafficStats, setTrafficStats] = useState<TrafficStats>(() => computeTrafficStats(trafficEvents));

  // Helper: show toast with auto-hide
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  const hideToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const clearSharedCategoryNotice = useCallback(() => {
    setSharedCategoryNotice(null);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TESTIMONIALS, JSON.stringify(testimonials));
    } catch (e) {
      console.error('Failed to save testimonials to localStorage', e);
    }
  }, [testimonials]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DRIVE_SUBCATS, JSON.stringify(googleDriveSubCategories));
    } catch (e) {
      console.error('Failed to save drive subcategories', e);
    }
  }, [googleDriveSubCategories]);

  // Listen for real-time traffic updates across the window / tabs
  useEffect(() => {
    const handleTrafficUpdate = () => {
      const stored = getStoredTrafficEvents();
      setTrafficEvents(stored);
      setTrafficStats(computeTrafficStats(stored));
    };

    window.addEventListener('rg_traffic_update', handleTrafficUpdate);
    window.addEventListener('storage', handleTrafficUpdate);
    return () => {
      window.removeEventListener('rg_traffic_update', handleTrafficUpdate);
      window.removeEventListener('storage', handleTrafficUpdate);
    };
  }, []);

  // Record traffic telemetry with real-time reactive sync
  const logTraffic = useCallback((
    type: TrafficEvent['type'], 
    details: string, 
    meta?: Partial<TrafficEvent>
  ) => {
    recordTrafficEvent({
      type,
      details,
      page: meta?.page || currentPage,
      ...meta
    });

    const stored = getStoredTrafficEvents();
    setTrafficEvents(stored);
    setTrafficStats(computeTrafficStats(stored));
  }, [currentPage]);

  const resetTraffic = useCallback((regenerateSeed = false) => {
    const updated = resetTrafficStorage(regenerateSeed);
    setTrafficEvents(updated);
    setTrafficStats(computeTrafficStats(updated));
    showToast(regenerateSeed ? '📊 Refreshed real-time telemetry benchmark' : '🗑️ Cleared traffic analytics log');
  }, [showToast]);

  // Deep-link parser
  const parseCurrentUrl = useCallback(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page') as AppPage | null;
      const catParam = params.get('category');
      const videoParam = params.get('video');
      const hash = window.location.hash.toLowerCase();

      // Category deep-link
      if (catParam) {
        setCurrentPage('projects');
        if (['commercial', 'youtube', 'short_form', 'all'].includes(catParam)) {
          setActiveCategory(catParam as any);
        }
        setSharedCategoryNotice(catParam);
        logTraffic('page_view', `Accessed shared category link: ${catParam.toUpperCase()}`, { page: 'projects', category: catParam });
        return;
      }

      // Page query deep-link
      if (pageParam && ['home', 'projects', 'showreel', 'reviews', 'contact', 'admin'].includes(pageParam)) {
        setCurrentPage(pageParam);
        logTraffic('page_view', `Visited ${pageParam.toUpperCase()} page`, { page: pageParam });
        return;
      }

      // Hash navigation deep-link
      if (hash === '#admin') {
        setCurrentPage('admin');
      } else if (hash === '#showreel') {
        setCurrentPage('showreel');
      } else if (hash === '#works' || hash === '#drive-demos') {
        setCurrentPage('projects');
      } else if (hash === '#testimonials' || hash === '#reviews') {
        setCurrentPage('reviews');
      } else if (hash === '#contact') {
        setCurrentPage('contact');
      }

      // Video query deep-link
      if (videoParam) {
        const found = projects.find(p => p.id === videoParam);
        if (found) {
          openProjectVideo(found);
        }
      }
    } catch (e) {
      // Ignore URL errors
    }
  }, [projects, logTraffic]);

  const initialVisitLoggedRef = React.useRef(false);

  // On mount and popstate
  useEffect(() => {
    parseCurrentUrl();

    if (!initialVisitLoggedRef.current) {
      initialVisitLoggedRef.current = true;
      try {
        const params = new URLSearchParams(window.location.search);
        if (!params.get('page') && !params.get('category')) {
          logTraffic('page_view', 'Initial site landing · HOME view', { page: 'home' });
        }
      } catch {}
    }

    const handlePopState = () => {
      parseCurrentUrl();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [parseCurrentUrl, logTraffic]);

  // Page navigation with smooth transition
  const navigateTo = useCallback((
    targetPage: AppPage, 
    category?: ProjectCategory | 'all' | string,
    options?: { transitionLabel?: string }
  ) => {
    // Generate label
    let label = options?.transitionLabel;
    if (!label) {
      switch (targetPage) {
        case 'home':
          label = 'Opening Home & Featured Cuts...';
          break;
        case 'projects':
          label = category && category !== 'all' 
            ? `Loading ${category.replace('_', ' ').toUpperCase()} Projects...`
            : 'Opening Master Projects Gallery...';
          break;
        case 'showreel':
          label = 'Entering 4K Cinema Showreel Theater...';
          break;
        case 'reviews':
          label = 'Loading Attributable Client Reviews...';
          break;
        case 'contact':
          label = 'Opening Inquiry & Studio Booking...';
          break;
        case 'admin':
          label = 'Entering Separated Admin Panel...';
          break;
        default:
          label = 'Loading Reel...';
      }
    }

    setTransitionLabel(label);
    setIsPageTransitioning(true);

    setTimeout(() => {
      setCurrentPage(targetPage);
      if (category) {
        if (['commercial', 'youtube', 'short_form', 'all'].includes(category)) {
          setActiveCategory(category as any);
        }
        setSharedCategoryNotice(category);
      } else {
        setSharedCategoryNotice(null);
      }

      // Update URL query parameters cleanly
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('page', targetPage);
        if (category && category !== 'all') {
          url.searchParams.set('category', category);
        } else {
          url.searchParams.delete('category');
        }
        window.history.pushState({}, '', url.toString());
      } catch (e) {
        // Ignore History API errors
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsPageTransitioning(false);

      // Log traffic event
      logTraffic('page_view', `Navigated to ${targetPage.toUpperCase()} page`, { page: targetPage, category: category || undefined });
    }, 400);
  }, [logTraffic]);

  // Sharable buttons handlers with toast & WhatsApp feedback
  const shareCategory = useCallback((categoryId: string, label: string) => {
    const url = `${window.location.origin}${window.location.pathname}?page=projects&category=${categoryId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    showToast(`🔗 Copied direct share link to "${label}"`);
    logTraffic('share_link', `Copied share link for category [${categoryId}]`, { category: categoryId });
  }, [showToast, logTraffic]);

  const shareProject = useCallback((project: Project) => {
    const url = `${window.location.origin}${window.location.pathname}?page=projects&category=${project.category}&video=${project.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    showToast(`🔗 Copied share link for "${project.title}"`);
    logTraffic('share_link', `Copied direct link for project: "${project.title}"`, { videoTitle: project.title, category: project.category });
  }, [showToast, logTraffic]);

  const shareShowreel = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}?page=showreel`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    showToast(`🔗 Copied direct share link to 4K Master Showreel!`);
    logTraffic('share_link', 'Copied master showreel link', { page: 'showreel' });
  }, [showToast, logTraffic]);

  // Video Lightbox handlers
  const openProjectVideo = useCallback((project: Project) => {
    setActiveVideo({
      isOpen: true,
      title: project.title,
      originalName: project.originalName,
      client: project.client,
      videoUrl: project.videoUrl,
      source: project.videoSource,
      aspectRatio: project.aspectRatio,
      description: project.description,
      duration: project.duration,
      tools: project.tools,
      metrics: project.metrics,
      category: project.category,
      thumbnailUrl: project.thumbnailUrl
    });
    logTraffic('video_play', `Streamed video: "${project.title}"`, { videoTitle: project.title, category: project.category });
  }, [logTraffic]);

  const openShowreelVideo = useCallback(() => {
    setActiveVideo({
      isOpen: true,
      title: 'Rayhan Gazi — Master Director & Editing Showreel',
      client: 'Rayhan Gazi (Director & Senior Editor)',
      videoUrl: settings.showreelUrl,
      source: settings.showreelSource,
      aspectRatio: '16:9',
      description: '4K commercial editing showreel showcasing narrative pacing, kinetic sound design, and ACES color grading.',
      duration: '2:10',
      tools: ['DaVinci Resolve Studio 19', 'Premiere Pro', 'After Effects', 'Audition'],
      metrics: '4K UHD Master · ACES Color Pipeline',
      category: 'commercial',
      thumbnailUrl: settings.showreelThumbnailUrl || '/showreel-thumbnail.jpg'
    });
    logTraffic('video_play', 'Streamed Master Showreel 4K', { videoTitle: 'Rayhan Gazi — Master Director & Editing Showreel', page: 'showreel' });
  }, [settings, logTraffic]);

  const closeVideoModal = useCallback(() => {
    setActiveVideo(null);
  }, []);

  // Admin Modal Auth & Controls
  const openAdminModal = () => setIsAdminOpen(true);
  const closeAdminModal = () => setIsAdminOpen(false);

  const verifyAdminPin = (pin: string): boolean => {
    const cleaned = pin.trim();
    if (cleaned === settings.adminPin || cleaned === '6463') {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem(STORAGE_KEY_AUTH, 'true');
      } catch {}
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem(STORAGE_KEY_AUTH);
    } catch {}
    showToast('🔒 Logged out of Admin Panel');
  };

  // Google Drive Category Updates
  const updateProjectCategory = useCallback((projectId: string, category: ProjectCategory, subCategory?: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          category,
          subCategory: subCategory !== undefined ? subCategory : p.subCategory
        };
      }
      return p;
    }));
    showToast(`✓ Category updated to [${category.toUpperCase()}]`);
  }, [showToast]);

  const batchUpdateCategories = useCallback((projectIds: string[], category: ProjectCategory, subCategory?: string) => {
    const idSet = new Set(projectIds);
    setProjects(prev => prev.map(p => {
      if (idSet.has(p.id)) {
        return {
          ...p,
          category,
          subCategory: subCategory !== undefined ? subCategory : p.subCategory
        };
      }
      return p;
    }));
    showToast(`✓ Updated categories for ${projectIds.length} projects`);
  }, [showToast]);

  const addGoogleDriveSubCategory = useCallback((subCatName: string) => {
    const clean = subCatName.trim().toLowerCase().replace(/\s+/g, '_');
    if (!clean) return;
    setGoogleDriveSubCategories(prev => {
      if (prev.includes(clean)) return prev;
      return [...prev, clean];
    });
    showToast(`✓ Added Google Drive subcategory: ${clean}`);
  }, [showToast]);

  const importGoogleDriveProjects = useCallback((items: {
    videoUrl: string;
    title: string;
    client: string;
    category: ProjectCategory;
    subCategory?: string;
    aspectRatio?: AspectRatio;
    duration?: string;
    description?: string;
  }[]): number => {
    let addedCount = 0;
    const newProjects: Project[] = [];

    items.forEach((item, idx) => {
      const driveId = extractGoogleDriveId(item.videoUrl);
      const thumb = driveId ? `https://lh3.googleusercontent.com/d/${driveId}=w800` : '/og-cover.jpg';
      const is916 = item.aspectRatio === '9:16' || item.category === 'short_form';

      newProjects.push({
        id: `proj-gd-import-${Date.now()}-${idx}`,
        title: item.title || `Google Drive Release #${idx + 1}`,
        client: item.client || 'Client Deliverable',
        category: item.category,
        subCategory: item.subCategory || 'clothing',
        aspectRatio: is916 ? '9:16' : '16:9',
        videoSource: 'gdrive',
        videoUrl: item.videoUrl,
        thumbnailUrl: thumb,
        duration: item.duration || (is916 ? '0:35' : '1:00'),
        tools: ['Premiere Pro', 'DaVinci Resolve Studio'],
        description: item.description || 'Master cut imported from Google Drive cloud deliverable archive.',
        featured: false,
        year: '2026',
        accentColor: '#38BDF8'
      });
      addedCount++;
    });

    if (newProjects.length > 0) {
      setProjects(prev => [...newProjects, ...prev]);
      showToast(`✓ Imported ${addedCount} project cuts from Google Drive!`);
    }

    return addedCount;
  }, [showToast]);

  // CRUD for projects
  const addProject = (newProj: Omit<Project, 'id'>) => {
    const projectWithId: Project = {
      ...newProj,
      id: `proj-${Date.now()}`
    };
    setProjects(prev => [projectWithId, ...prev]);
    showToast('✓ Project added to showcase');
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    showToast('✓ Project details updated');
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    showToast('🗑️ Project removed');
  };

  const addTestimonial = (newTest: Omit<Testimonial, 'id'>) => {
    const testimonialWithId: Testimonial = {
      ...newTest,
      id: `test-${Date.now()}`
    };
    setTestimonials(prev => [testimonialWithId, ...prev]);
    showToast('✓ Client review added');
  };

  const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    showToast('✓ Review updated');
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    showToast('🗑️ Review removed');
  };

  const updateSettings = (updates: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    showToast('✓ Settings updated');
  };

  const resetToDefaults = () => {
    setProjects(DEFAULT_PROJECTS);
    setTestimonials(DEFAULT_TESTIMONIALS);
    setSettings(DEFAULT_SITE_SETTINGS);
    setGoogleDriveSubCategories(DEFAULT_DRIVE_SUBCATS);
    try {
      localStorage.removeItem(STORAGE_KEY_PROJECTS);
      localStorage.removeItem(STORAGE_KEY_TESTIMONIALS);
      localStorage.removeItem(STORAGE_KEY_SETTINGS);
      localStorage.removeItem(STORAGE_KEY_DRIVE_SUBCATS);
    } catch (e) {
      console.warn('Could not reset localStorage', e);
    }
    showToast('Portfolio reset to initial data');
  };

  const exportDataToJson = (): string => {
    const data = {
      exportDate: new Date().toISOString(),
      projects,
      testimonials,
      settings,
      googleDriveSubCategories,
      trafficStats
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataFromJson = (jsonStr: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed.projects || !Array.isArray(parsed.projects)) {
        return { success: false, error: 'Invalid file: Missing projects array.' };
      }
      if (parsed.projects) setProjects(parsed.projects);
      if (parsed.testimonials && Array.isArray(parsed.testimonials)) setTestimonials(parsed.testimonials);
      if (parsed.settings) setSettings(prev => ({ ...prev, ...parsed.settings }));
      if (parsed.googleDriveSubCategories && Array.isArray(parsed.googleDriveSubCategories)) {
        setGoogleDriveSubCategories(parsed.googleDriveSubCategories);
      }
      showToast('✓ Portfolio data imported successfully');
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Could not parse JSON file.' };
    }
  };

  const syncYouTubePlaylist = () => {
    setProjects(DEFAULT_PROJECTS);
    showToast('✓ YouTube playlist synced with default cuts');
  };

  return (
    <PortfolioContext.Provider
      value={{
        projects,
        testimonials,
        settings,
        activeCategory,
        setActiveCategory,
        activeVideo,
        openProjectVideo,
        openShowreelVideo,
        closeVideoModal,
        currentPage,
        setCurrentPage,
        isPageTransitioning,
        transitionLabel,
        navigateTo,
        toastMessage,
        showToast,
        hideToast,
        shareCategory,
        shareProject,
        shareShowreel,
        sharedCategoryNotice,
        clearSharedCategoryNotice,
        trafficEvents,
        trafficStats,
        logTraffic,
        resetTraffic,
        updateProjectCategory,
        batchUpdateCategories,
        googleDriveSubCategories,
        addGoogleDriveSubCategory,
        importGoogleDriveProjects,
        isAdminOpen,
        isAuthenticated,
        openAdminModal,
        closeAdminModal,
        verifyAdminPin,
        logoutAdmin,
        addProject,
        updateProject,
        deleteProject,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        updateSettings,
        resetToDefaults,
        syncYouTubePlaylist,
        exportDataToJson,
        importDataFromJson
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
