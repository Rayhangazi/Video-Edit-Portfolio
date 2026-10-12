import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Testimonial, SiteSettings, ProjectCategory, AspectRatio, VideoSourceType } from '../types/portfolio';
import { DEFAULT_PROJECTS, DEFAULT_TESTIMONIALS, DEFAULT_SITE_SETTINGS } from '../data/defaultData';

interface ActiveVideoState {
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
}

interface PortfolioContextType {
  projects: Project[];
  testimonials: Testimonial[];
  settings: SiteSettings;
  activeCategory: ProjectCategory | 'all';
  setActiveCategory: (cat: ProjectCategory | 'all') => void;
  activeVideo: ActiveVideoState | null;
  openProjectVideo: (project: Project) => void;
  openShowreelVideo: () => void;
  closeVideoModal: () => void;
  
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

const STORAGE_KEY_PROJECTS = 'rayhan_gazi_projects_v9';
const STORAGE_KEY_TESTIMONIALS = 'rayhan_gazi_testimonials_v9';
const STORAGE_KEY_SETTINGS = 'rayhan_gazi_settings_v9';

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (saved) return JSON.parse(saved);
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
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load settings from localStorage', e);
    }
    return DEFAULT_SITE_SETTINGS;
  });

  const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'all'>('all');
  const [activeVideo, setActiveVideo] = useState<ActiveVideoState | null>(null);

  // Admin CMS Modal
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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
      category: project.category
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
      metrics: '180M+ Combined Views · 2026 Reel'
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
    const id = `proj-${Date.now()}`;
    const projectWithId: Project = { ...newProj, id };
    setProjects(prev => [projectWithId, ...prev]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const addTestimonial = (newTest: Omit<Testimonial, 'id'>) => {
    const id = `test-${Date.now()}`;
    const itemWithId: Testimonial = { ...newTest, id };
    setTestimonials(prev => [itemWithId, ...prev]);
  };

  const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    setTestimonials(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
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
    localStorage.removeItem(STORAGE_KEY_PROJECTS);
    localStorage.removeItem(STORAGE_KEY_TESTIMONIALS);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
  };

  const exportDataToJson = (): string => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      projects,
      testimonials
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
