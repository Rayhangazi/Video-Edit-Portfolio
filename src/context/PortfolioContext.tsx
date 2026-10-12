import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Project, Testimonial, SiteSettings, ProjectCategory, AspectRatio, VideoSourceType, AppPage } from '../types/portfolio';
import { DEFAULT_PROJECTS, DEFAULT_TESTIMONIALS, DEFAULT_SITE_SETTINGS } from '../data/defaultData';

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

const STORAGE_KEY_PROJECTS = 'rayhan_gazi_projects_v11';
const STORAGE_KEY_TESTIMONIALS = 'rayhan_gazi_testimonials_v11';
const STORAGE_KEY_SETTINGS = 'rayhan_gazi_settings_v11';

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
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
        return {
          ...DEFAULT_SITE_SETTINGS,
          ...parsed,
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

  // Admin CMS Modal
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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
        return;
      }

      // Page query deep-link
      if (pageParam && ['home', 'projects', 'showreel', 'reviews', 'contact'].includes(pageParam)) {
        setCurrentPage(pageParam);
        return;
      }

      // Hash navigation deep-link
      if (hash === '#showreel') {
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
  }, [projects]);

  // On mount and popstate
  useEffect(() => {
    parseCurrentUrl();

    const handlePopState = () => {
      parseCurrentUrl();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [parseCurrentUrl]);

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
        url.searchParams.delete('video');
        window.history.pushState({ page: targetPage, category }, '', url.toString());
      } catch (e) {
        // Fallback for isolated environments
      }

      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 220);

    setTimeout(() => {
      setIsPageTransitioning(false);
    }, 450);
  }, []);

  // Clipboard copy helper
  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) {
      // Fallback below
    }

    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    } catch (err) {
      return false;
    }
  };

  // Sharable button for categories
  const shareCategory = useCallback((categoryId: string, label: string) => {
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const shareUrl = `${baseUrl}?page=projects&category=${encodeURIComponent(categoryId)}`;

    copyToClipboard(shareUrl);
    showToast(`🔗 Copied direct link to "${label}"! Share with clients.`);

    // If mobile native share is available and user initiated
    if (navigator.share && window.innerWidth < 768) {
      navigator.share({
        title: `Rayhan Gazi — ${label} Portfolio`,
        text: `View Rayhan Gazi's ${label} video editing reel & commercial deliverables:`,
        url: shareUrl,
      }).catch(() => {});
    }
  }, [showToast]);

  // Sharable button for individual project
  const shareProject = useCallback((project: Project) => {
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const shareUrl = `${baseUrl}?page=projects&video=${encodeURIComponent(project.id)}`;

    copyToClipboard(shareUrl);
    showToast(`🔗 Copied direct link for "${project.title}"!`);

    if (navigator.share && window.innerWidth < 768) {
      navigator.share({
        title: project.title,
        text: `Watch Rayhan Gazi's edit: ${project.title} (${project.client})`,
        url: shareUrl,
      }).catch(() => {});
    }
  }, [showToast]);

  // Sharable button for master showreel
  const shareShowreel = useCallback(() => {
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const shareUrl = `${baseUrl}?page=showreel`;

    copyToClipboard(shareUrl);
    showToast('🔗 Copied direct link to Rayhan Gazi Master Showreel!');

    if (navigator.share && window.innerWidth < 768) {
      navigator.share({
        title: 'Rayhan Gazi — Master Director & Editing Showreel',
        text: 'Watch Rayhan Gazi Master 2026 Director & Video Editing Showreel:',
        url: shareUrl,
      }).catch(() => {});
    }
  }, [showToast]);

  const openProjectVideo = (project: Project) => {
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
  };

  const openShowreelVideo = () => {
    setActiveVideo({
      isOpen: true,
      title: 'Rayhan Gazi — Master Director & Editing Showreel',
      client: 'Commercials, High-Retention YouTube & Narrative',
      videoUrl: settings.showreelUrl,
      source: settings.showreelSource,
      aspectRatio: '16:9',
      description: 'A curated showcase of velocity pacing, sound design textures, dynamic VFX rotoscoping, and commercial grade coloring delivered for global clients.',
      duration: '2:10',
      tools: ['Premiere Pro', 'DaVinci Resolve Studio', 'After Effects'],
      metrics: '180M+ Combined Views · 2026 Reel',
      thumbnailUrl: settings.showreelThumbnailUrl || '/showreel-thumbnail.jpg'
    });
  };

  const closeVideoModal = () => {
    setActiveVideo(null);
  };

  const openAdminModal = () => {
    setIsAdminOpen(true);
  };

  const closeAdminModal = () => {
    setIsAdminOpen(false);
  };

  const verifyAdminPin = (pin: string): boolean => {
    if (pin.trim() === settings.adminPin.trim()) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAuthenticated(false);
  };

  const addProject = (newProj: Omit<Project, 'id'>) => {
    const projectWithId: Project = {
      ...newProj,
      id: `proj-${Date.now()}`
    };
    setProjects(prev => [projectWithId, ...prev]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const addTestimonial = (newTest: Omit<Testimonial, 'id'>) => {
    const testimonialWithId: Testimonial = {
      ...newTest,
      id: `test-${Date.now()}`
    };
    setTestimonials(prev => [testimonialWithId, ...prev]);
  };

  const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  const updateSettings = (updates: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetToDefaults = () => {
    setProjects(DEFAULT_PROJECTS);
    setTestimonials(DEFAULT_TESTIMONIALS);
    setSettings(DEFAULT_SITE_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_KEY_PROJECTS);
      localStorage.removeItem(STORAGE_KEY_TESTIMONIALS);
      localStorage.removeItem(STORAGE_KEY_SETTINGS);
    } catch (e) {
      console.warn('Could not reset localStorage', e);
    }
  };

  const exportDataToJson = (): string => {
    const data = {
      exportDate: new Date().toISOString(),
      projects,
      testimonials,
      settings
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
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Could not parse JSON file.' };
    }
  };

  const syncYouTubePlaylist = () => {
    setProjects(DEFAULT_PROJECTS);
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
