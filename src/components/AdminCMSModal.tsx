import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project, Testimonial, ProjectCategory, AspectRatio, VideoSourceType } from '../types/portfolio';
import { detectVideoSource, getEmbedUrl, isValidVideoUrl } from '../utils/videoUtils';
import { 
  X, Lock, Unlock, Plus, Edit2, Trash2, Save, Download, Upload, 
  RotateCcw, Eye, Check, AlertCircle, Film, Smartphone, Sparkles, Youtube
} from 'lucide-react';

export const AdminCMSModal: React.FC = () => {
  const {
    isAdminOpen,
    closeAdminModal,
    isAuthenticated,
    verifyAdminPin,
    logoutAdmin,
    projects,
    addProject,
    updateProject,
    deleteProject,
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    settings,
    updateSettings,
    resetToDefaults,
    syncYouTubePlaylist,
    exportDataToJson,
    importDataFromJson
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'projects' | 'testimonials' | 'settings'>('projects');
  
  // PIN lock state
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Project Editor State
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectForm, setProjectForm] = useState<Omit<Project, 'id'>>({
    title: '',
    originalName: '',
    client: '',
    category: 'commercial',
    aspectRatio: '16:9',
    videoSource: 'youtube',
    videoUrl: '',
    thumbnailUrl: '',
    duration: '1:00',
    tools: ['Premiere Pro', 'DaVinci Resolve'],
    metrics: '',
    description: '',
    featured: false,
    year: '2026',
    accentColor: '#00F0FF',
    subCategory: ''
  });
  const [toolsInput, setToolsInput] = useState('Premiere Pro, DaVinci Resolve');
  const [previewTestUrl, setPreviewTestUrl] = useState<string | null>(null);

  // Testimonial Editor State
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState<Omit<Testimonial, 'id'>>({
    clientName: '',
    clientRole: '',
    companyOrChannel: '',
    metricHighlight: '',
    quote: '',
    projectReference: ''
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isAdminOpen) return null;

  // Handle PIN verification
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyAdminPin(pinInput);
    if (success) {
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  // Start adding a new project
  const handleStartAddProject = () => {
    setEditingProjectId(null);
    setProjectForm({
      title: '',
      originalName: '',
      client: '',
      category: 'commercial',
      aspectRatio: '16:9',
      videoSource: 'youtube',
      videoUrl: '',
      thumbnailUrl: '',
      duration: '1:00',
      tools: ['Premiere Pro', 'DaVinci Resolve'],
      metrics: '',
      description: '',
      featured: false,
      year: new Date().getFullYear().toString(),
      accentColor: '#00F0FF',
      subCategory: ''
    });
    setToolsInput('Premiere Pro, DaVinci Resolve');
    setPreviewTestUrl(null);
    setIsAddingProject(true);
  };

  // Start editing an existing project
  const handleStartEditProject = (p: Project) => {
    setIsAddingProject(false);
    setEditingProjectId(p.id);
    setProjectForm({
      title: p.title,
      originalName: p.originalName || '',
      client: p.client,
      category: p.category,
      aspectRatio: p.aspectRatio,
      videoSource: p.videoSource,
      videoUrl: p.videoUrl,
      thumbnailUrl: p.thumbnailUrl || '',
      duration: p.duration,
      tools: p.tools,
      metrics: p.metrics || '',
      description: p.description,
      featured: p.featured || false,
      year: p.year,
      accentColor: p.accentColor || '#00F0FF',
      subCategory: p.subCategory || ''
    });
    setToolsInput(p.tools.join(', '));
    setPreviewTestUrl(null);
  };

  // Save project (Create or Update)
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.videoUrl) return;

    const parsedTools = toolsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const detected = detectVideoSource(projectForm.videoUrl);

    const projectPayload = {
      ...projectForm,
      videoSource: projectForm.videoSource || detected,
      tools: parsedTools.length > 0 ? parsedTools : ['Premiere Pro']
    };

    if (isAddingProject) {
      addProject(projectPayload);
      setIsAddingProject(false);
    } else if (editingProjectId) {
      updateProject(editingProjectId, projectPayload);
      setEditingProjectId(null);
    }
  };

  // Start adding testimonial
  const handleStartAddTestimonial = () => {
    setEditingTestimonialId(null);
    setTestimonialForm({
      clientName: '',
      clientRole: '',
      companyOrChannel: '',
      metricHighlight: '',
      quote: '',
      projectReference: ''
    });
    setIsAddingTestimonial(true);
  };

  // Start editing testimonial
  const handleStartEditTestimonial = (t: Testimonial) => {
    setIsAddingTestimonial(false);
    setEditingTestimonialId(t.id);
    setTestimonialForm({
      clientName: t.clientName,
      clientRole: t.clientRole,
      companyOrChannel: t.companyOrChannel,
      metricHighlight: t.metricHighlight,
      quote: t.quote,
      projectReference: t.projectReference || ''
    });
  };

  // Save testimonial
  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.clientName || !testimonialForm.quote) return;

    if (isAddingTestimonial) {
      addTestimonial(testimonialForm);
      setIsAddingTestimonial(false);
    } else if (editingTestimonialId) {
      updateTestimonial(editingTestimonialId, testimonialForm);
      setEditingTestimonialId(null);
    }
  };

  // Save settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  // Handle Export Download
  const handleDownloadBackup = () => {
    const jsonStr = exportDataToJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rayhan-gazi-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle Import
  const handleImportJson = () => {
    if (!importJsonText.trim()) return;
    const res = importDataFromJson(importJsonText);
    if (res.success) {
      setImportStatus('Portfolio backup successfully restored!');
      setImportJsonText('');
      setTimeout(() => setImportStatus(null), 3000);
    } else {
      setImportStatus(`Import failed: ${res.error}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={closeAdminModal} />

      <div className="relative z-10 w-full max-w-4xl bg-[#0F121C] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between gap-4 bg-[#090A0F]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400/10 text-cyan-400">
              {isAuthenticated ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Portfolio Content Management System
              </h2>
              <p className="text-xs text-slate-400">
                {isAuthenticated ? "Live Admin Mode Active" : "Authentication Required"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={logoutAdmin}
                className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                Lock CMS
              </button>
            )}
            <button
              onClick={closeAdminModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Authenticated: PIN Verification View */}
        {!isAuthenticated ? (
          <div className="p-10 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-400/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-display text-xl font-bold text-white">
                Enter Admin PIN
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Protected area for Rayhan Gazi to manage projects, video links, client testimonials, and settings.
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  autoFocus
                  placeholder="Enter 4-digit PIN..."
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl bg-[#090A0F] border text-center text-lg tracking-[0.3em] font-mono text-white focus:outline-none transition-colors ${
                    pinError ? 'border-rose-500' : 'border-white/[0.1] focus:border-cyan-500'
                  }`}
                />
                {pinError && (
                  <p className="text-xs text-rose-400 mt-2 font-mono">
                    Incorrect PIN. Please try again.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-black font-semibold text-xs uppercase tracking-wider transition-all"
              >
                Authenticate & Unlock
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated: CMS Dashboard Views */
          <div className="flex flex-col flex-1 overflow-hidden">
            
            {/* Tabs Navigation */}
            <div className="px-6 py-2.5 border-b border-white/[0.08] bg-[#090A0F]/60 flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab('projects');
                  setIsAddingProject(false);
                  setEditingProjectId(null);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'projects'
                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                Projects ({projects.length})
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('testimonials');
                  setIsAddingTestimonial(false);
                  setEditingTestimonialId(null);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'testimonials'
                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                Testimonials ({testimonials.length})
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                Settings & Backup
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1: PROJECTS */}
              {activeTab === 'projects' && (
                <div>
                  {isAddingProject || editingProjectId ? (
                    /* Project Add/Edit Form */
                    <form onSubmit={handleSaveProject} className="space-y-5 bg-[#090A0F] p-6 rounded-xl border border-white/[0.08]">
                      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                        <h4 className="text-sm font-bold text-white font-mono">
                          {isAddingProject ? 'Add New Project' : 'Edit Project'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingProject(false);
                            setEditingProjectId(null);
                            setPreviewTestUrl(null);
                          }}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-slate-300 font-medium">Project Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Aura GT Commercial"
                            value={projectForm.title}
                            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-slate-300 font-medium">Client / Channel Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Prime Living Bangladesh"
                            value={projectForm.client}
                            onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-300 font-medium">
                          Original Raw File / Project Name (displayed smaller below professional title)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Honeycomb omor RAW V1.mp4 or T shirt Main 4 5 v1"
                          value={projectForm.originalName}
                          onChange={(e) => setProjectForm({ ...projectForm, originalName: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-slate-300 font-medium">Category</label>
                          <select
                            value={projectForm.category}
                            onChange={(e) => {
                              const cat = e.target.value as ProjectCategory;
                              setProjectForm({ 
                                ...projectForm, 
                                category: cat,
                                aspectRatio: cat === 'short_form' ? '9:16' : projectForm.aspectRatio
                              });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-500"
                          >
                            <option value="commercial">Commercial</option>
                            <option value="youtube">YouTube</option>
                            <option value="music_video">Music Video</option>
                            <option value="short_form">Short-Form</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-slate-300 font-medium">Aspect Ratio</label>
                          <select
                            value={projectForm.aspectRatio}
                            onChange={(e) => setProjectForm({ ...projectForm, aspectRatio: e.target.value as AspectRatio })}
                            className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-500"
                          >
                            <option value="16:9">16:9 Landscape (Standard)</option>
                            <option value="9:16">9:16 Vertical (Reel / Shorts)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-slate-300 font-medium">Video Source</label>
                          <select
                            value={projectForm.videoSource}
                            onChange={(e) => setProjectForm({ ...projectForm, videoSource: e.target.value as VideoSourceType })}
                            className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-500"
                          >
                            <option value="youtube">YouTube</option>
                            <option value="gdrive">Google Drive</option>
                            <option value="direct">Direct MP4 / WebM</option>
                          </select>
                        </div>
                      </div>

                      {/* Google Drive Subcategory selection */}
                      {projectForm.videoSource === 'gdrive' && (
                        <div className="space-y-1">
                          <label className="text-xs text-slate-300 font-medium">
                            Google Drive Subcategory Section
                          </label>
                          <select
                            value={projectForm.subCategory || ''}
                            onChange={(e) => setProjectForm({ ...projectForm, subCategory: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-blue-400"
                          >
                            <option value="">General Drive Deliverable</option>
                            <option value="clothing">Fashion & Streetwear (Hoodies, Trousers)</option>
                            <option value="food">Food & Culinary BD (Pickles, Mustard Oil, Gourmet)</option>
                            <option value="bedding">Bedding & Home Living (Comforters, Mattresses)</option>
                            <option value="skit">Social Skits & Drama BD (Shamim Bhai, Comedy Natok)</option>
                            <option value="fashion">Model & Runway Films (Silk, Editorial)</option>
                            <option value="corporate">Corporate & Real Estate (Sagor, Honeycomb, HGP)</option>
                            <option value="motion">2D/3D Kinetic Motion & Bumpers</option>
                            <option value="archive_classics">2023 Classic & Corporate Archive</option>
                            <option value="herbal">Herbal & Healthcare (Ecodor, Orgavet, Organic Mart)</option>
                          </select>
                        </div>
                      )}

                      {/* Video URL with Live Test Button */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-slate-300 font-medium">
                            Video URL (YouTube link, Google Drive share link, or MP4) *
                          </label>
                          {projectForm.videoUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                const detected = detectVideoSource(projectForm.videoUrl);
                                setProjectForm({ ...projectForm, videoSource: detected });
                                setPreviewTestUrl(projectForm.videoUrl);
                              }}
                              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                            >
                              <Eye className="w-3 h-3" /> Test Video Stream
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="https://www.youtube.com/watch?v=... or Google Drive / MP4 URL"
                          value={projectForm.videoUrl}
                          onChange={(e) => {
                            const val = e.target.value;
                            const detected = detectVideoSource(val);
                            setProjectForm({ 
                              ...projectForm, 
                              videoUrl: val,
                              videoSource: detected
                            });
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      {/* Live Video Preview Box in Editor if requested */}
                      {previewTestUrl && (
                        <div className="p-3 rounded-lg bg-black border border-white/[0.1]">
                          <div className="text-[11px] text-slate-400 font-mono mb-2 flex items-center justify-between">
                            <span>Live Player Preview ({projectForm.videoSource})</span>
                            <button 
                              type="button" 
                              onClick={() => setPreviewTestUrl(null)} 
                              className="text-slate-400 hover:text-white"
                            >
                              Close Preview
                            </button>
                          </div>
                          <div className={`relative bg-neutral-900 mx-auto ${
                            projectForm.aspectRatio === '9:16' ? 'aspect-[9/16] max-w-[220px]' : 'aspect-video max-w-md'
                          }`}>
                            {projectForm.videoSource === 'direct' ? (
                              <video src={previewTestUrl} controls className="w-full h-full object-contain" />
                            ) : (
                              <iframe
                                src={getEmbedUrl(previewTestUrl, projectForm.videoSource)}
                                className="w-full h-full border-0"
                                allowFullScreen
                              />
                            )}
                          </div>
                        </div>
                      )}

                      {/* Custom Thumbnail URL (Optional) */}
                      <div className="space-y-1">
                        <label className="text-xs text-slate-300 font-medium">
                          Custom Thumbnail Image URL (Optional — auto-generated for YouTube)
                        </label>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={projectForm.thumbnailUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, thumbnailUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-slate-300 font-medium">Duration</label>
                          <input
                            type="text"
                            placeholder="e.g. 0:45 or 12:30"
                            value={projectForm.duration}
                            onChange={(e) => setProjectForm({ ...projectForm, duration: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-slate-300 font-medium">Year</label>
                          <input
                            type="text"
                            value={projectForm.year}
                            onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-slate-300 font-medium">Key Metric / Highlight</label>
                          <input
                            type="text"
                            placeholder="e.g. 3.4M Views · Broadcast TV"
                            value={projectForm.metrics}
                            onChange={(e) => setProjectForm({ ...projectForm, metrics: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-300 font-medium">Editing Software / Tools (comma separated)</label>
                        <input
                          type="text"
                          value={toolsInput}
                          onChange={(e) => setToolsInput(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-300 font-medium">Project Narrative / Scope</label>
                        <textarea
                          rows={3}
                          value={projectForm.description}
                          onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-500 resize-none"
                        />
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingProject(false);
                            setEditingProjectId(null);
                          }}
                          className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-lg text-xs font-bold text-black bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{isAddingProject ? 'Save Project' : 'Update Project'}</span>
                        </button>
                      </div>

                    </form>
                  ) : (
                    /* Projects List */
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-400 font-mono">
                            Total Projects: {projects.length}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('Re-sync all 7 videos from your YouTube playlist (PLeblsp6_-mB4)?')) {
                                syncYouTubePlaylist();
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.1] flex items-center gap-1.5 transition-colors"
                            title="Reload videos from YouTube playlist PLeblsp6_-mB4"
                          >
                            <Youtube className="w-3.5 h-3.5 text-red-500" />
                            <span>Sync Playlist (PLeblsp6_-mB4)</span>
                          </button>
                        </div>

                        <button
                          onClick={handleStartAddProject}
                          className="px-4 py-2 rounded-lg text-xs font-semibold text-black bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 flex items-center gap-1.5 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add New Project</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {projects.map(p => (
                          <div
                            key={p.id}
                            className="p-3.5 rounded-xl bg-[#090A0F] border border-white/[0.08] flex items-center justify-between gap-4 hover:border-white/[0.15] transition-colors"
                          >
                            <div className="flex items-center gap-3 truncate">
                              <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0 text-slate-400 font-mono text-xs">
                                {p.aspectRatio === '9:16' ? (
                                  <Smartphone className="w-4 h-4 text-cyan-400" />
                                ) : (
                                  <Film className="w-4 h-4 text-cyan-400" />
                                )}
                              </div>
                              <div className="truncate">
                                <div className="text-xs font-semibold text-white truncate">
                                  {p.title}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono truncate">
                                  {p.client} · {p.category} · {p.videoSource} · {p.duration}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => handleStartEditProject(p)}
                                className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                                title="Edit project"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete project "${p.title}"?`)) {
                                    deleteProject(p.id);
                                  }
                                }}
                                className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-white/[0.05] transition-colors"
                                title="Delete project"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: TESTIMONIALS */}
              {activeTab === 'testimonials' && (
                <div>
                  {isAddingTestimonial || editingTestimonialId ? (
                    <form onSubmit={handleSaveTestimonial} className="space-y-4 bg-[#090A0F] p-6 rounded-xl border border-white/[0.08]">
                      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                        <h4 className="text-sm font-bold text-white font-mono">
                          {isAddingTestimonial ? 'Add Testimonial' : 'Edit Testimonial'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingTestimonial(false);
                            setEditingTestimonialId(null);
                          }}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-slate-300 font-medium">Client Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Marcus Sterling"
                            value={testimonialForm.clientName}
                            onChange={(e) => setTestimonialForm({ ...testimonialForm, clientName: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-slate-300 font-medium">Client Role</label>
                          <input
                            type="text"
                            placeholder="e.g. Creative Director"
                            value={testimonialForm.clientRole}
                            onChange={(e) => setTestimonialForm({ ...testimonialForm, clientRole: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-slate-300 font-medium">Company or Channel Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Modern Mindset (1.8M Subs)"
                            value={testimonialForm.companyOrChannel}
                            onChange={(e) => setTestimonialForm({ ...testimonialForm, companyOrChannel: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-slate-300 font-medium">Quantifiable Metric Highlight</label>
                          <input
                            type="text"
                            placeholder="e.g. +42% Retention & Cannes Shortlist"
                            value={testimonialForm.metricHighlight}
                            onChange={(e) => setTestimonialForm({ ...testimonialForm, metricHighlight: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-300 font-medium">Testimonial Quote *</label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Client statement..."
                          value={testimonialForm.quote}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-500 resize-none"
                        />
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingTestimonial(false);
                            setEditingTestimonialId(null);
                          }}
                          className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-lg text-xs font-bold text-black bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{isAddingTestimonial ? 'Save Testimonial' : 'Update Testimonial'}</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-mono">
                          Client Reviews ({testimonials.length})
                        </span>
                        <button
                          onClick={handleStartAddTestimonial}
                          className="px-4 py-2 rounded-lg text-xs font-semibold text-black bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 flex items-center gap-1.5 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Testimonial</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {testimonials.map(t => (
                          <div
                            key={t.id}
                            className="p-3.5 rounded-xl bg-[#090A0F] border border-white/[0.08] flex items-center justify-between gap-4"
                          >
                            <div className="truncate">
                              <div className="text-xs font-semibold text-white">
                                {t.clientName} · <span className="text-slate-400 font-normal">{t.companyOrChannel}</span>
                              </div>
                              <div className="text-[11px] text-cyan-400 font-mono truncate">
                                {t.metricHighlight}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => handleStartEditTestimonial(t)}
                                className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.05]"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete testimonial from ${t.clientName}?`)) {
                                    deleteTestimonial(t.id);
                                  }
                                }}
                                className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-white/[0.05]"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SETTINGS & BACKUP */}
              {activeTab === 'settings' && (
                <div className="space-y-8">
                  {/* General Site Config */}
                  <form onSubmit={handleSaveSettings} className="space-y-4 bg-[#090A0F] p-6 rounded-xl border border-white/[0.08]">
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                      <h4 className="text-sm font-bold text-white font-mono">
                        Site Branding & Headline Metrics
                      </h4>
                      {settingsSaved && (
                        <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Saved!
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-300 font-medium">Editor Name</label>
                        <input
                          type="text"
                          value={settingsForm.editorName}
                          onChange={(e) => setSettingsForm({ ...settingsForm, editorName: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-300 font-medium">Contact Email</label>
                        <input
                          type="email"
                          value={settingsForm.email}
                          onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-300 font-medium">Total Views</label>
                        <input
                          type="text"
                          value={settingsForm.totalViews}
                          onChange={(e) => setSettingsForm({ ...settingsForm, totalViews: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-300 font-medium">Projects Shipped</label>
                        <input
                          type="text"
                          value={settingsForm.projectsDelivered}
                          onChange={(e) => setSettingsForm({ ...settingsForm, projectsDelivered: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-300 font-medium">Rough Turnaround</label>
                        <input
                          type="text"
                          value={settingsForm.turnaroundHours}
                          onChange={(e) => setSettingsForm({ ...settingsForm, turnaroundHours: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-300 font-medium">Admin PIN</label>
                        <input
                          type="text"
                          value={settingsForm.adminPin}
                          onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-300 font-medium">Master Showreel Video URL</label>
                      <input
                        type="text"
                        value={settingsForm.showreelUrl}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSettingsForm({ 
                            ...settingsForm, 
                            showreelUrl: val,
                            showreelSource: detectVideoSource(val)
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-300 font-medium">Master Showreel Thumbnail URL / Path</label>
                      <input
                        type="text"
                        placeholder="/showreel-thumbnail.jpg or custom image URL"
                        value={settingsForm.showreelThumbnailUrl || ''}
                        onChange={(e) => {
                          setSettingsForm({ 
                            ...settingsForm, 
                            showreelThumbnailUrl: e.target.value
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs font-mono"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg text-xs font-bold text-black bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Update Settings</span>
                      </button>
                    </div>
                  </form>

                  {/* 1-Click JSON Backup & Import */}
                  <div className="bg-[#090A0F] p-6 rounded-xl border border-white/[0.08] space-y-4">
                    <h4 className="text-sm font-bold text-white font-mono">
                      Data Portability & JSON Backups
                    </h4>
                    <p className="text-xs text-slate-400">
                      Export your entire portfolio state as a JSON file to keep an offline archive or transfer across browsers.
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleDownloadBackup}
                        className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download JSON Backup</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Reset portfolio back to default showreel and projects? Any unsaved edits will be replaced.')) {
                            resetToDefaults();
                            setSettingsForm(settings);
                          }
                        }}
                        className="px-4 py-2 rounded-lg text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 flex items-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset to Initial Portfolio Data</span>
                      </button>
                    </div>

                    {/* Import JSON textarea */}
                    <div className="pt-3 border-t border-white/[0.06] space-y-2">
                      <label className="text-xs text-slate-300 font-medium block">
                        Restore from JSON:
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Paste exported portfolio JSON text here..."
                        value={importJsonText}
                        onChange={(e) => setImportJsonText(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.1] text-white text-xs font-mono resize-none"
                      />
                      {importStatus && (
                        <p className="text-xs text-cyan-400 font-mono">{importStatus}</p>
                      )}
                      {importJsonText && (
                        <button
                          type="button"
                          onClick={handleImportJson}
                          className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-cyan-400 text-black hover:from-cyan-400 hover:to-cyan-300"
                        >
                          Apply Restored Data
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
