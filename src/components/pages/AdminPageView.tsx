import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project, ProjectCategory, AspectRatio, VideoSourceType } from '../../types/portfolio';
import { AnalyticsMetricBar } from '../AnalyticsMetricBar';
import { 
  getDailyTrafficData, 
  getRealPageBreakdown, 
  getRealLocationBreakdown, 
  getRealDeviceBreakdown, 
  getRealReferrerBreakdown,
  detectRealDevice,
  detectRealLocation 
} from '../../utils/trafficTracker';
import { extractGoogleDriveId, getGoogleDriveThumbnail } from '../../utils/videoUtils';
import { 
  Lock, Unlock, Eye, EyeOff, BarChart3, HardDrive, Film, FolderGit2, 
  Settings, Users, Plus, Trash2, Edit3, Save, RefreshCw, Check, 
  AlertCircle, Share2, Play, ExternalLink, ArrowLeft, Download, 
  Upload, Layers, Sparkles, Smartphone, Globe, Monitor, Search, 
  Filter, CheckSquare, Square, Zap, Activity
} from 'lucide-react';

export const AdminPageView: React.FC = () => {
  const {
    isAuthenticated,
    verifyAdminPin,
    logoutAdmin,
    navigateTo,
    projects,
    updateProject,
    addProject,
    deleteProject,
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    settings,
    updateSettings,
    resetToDefaults,
    trafficEvents,
    trafficStats,
    resetTraffic,
    logTraffic,
    updateProjectCategory,
    batchUpdateCategories,
    googleDriveSubCategories,
    addGoogleDriveSubCategory,
    importGoogleDriveProjects,
    openProjectVideo,
    exportDataToJson,
    importDataFromJson
  } = usePortfolio();

  // Authentication State
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  // Active Admin Tab
  type AdminTab = 'traffic' | 'gdrive' | 'projects' | 'testimonials' | 'settings';
  const [activeTab, setActiveTab] = useState<AdminTab>('traffic');

  // Traffic Date Range Filter
  const [trafficDays, setTrafficDays] = useState<7 | 14 | 30>(7);

  // Google Drive Hub State
  const [driveSearch, setDriveSearch] = useState('');
  const [driveSubCatFilter, setDriveSubCatFilter] = useState<string>('all');
  const [selectedDriveIds, setSelectedDriveIds] = useState<string[]>([]);
  const [batchCategory, setBatchCategory] = useState<ProjectCategory>('commercial');
  const [batchSubCat, setBatchSubCat] = useState<string>('clothing');
  const [newSubCatName, setNewSubCatName] = useState('');

  // Google Drive Import State
  const [importLinksText, setImportLinksText] = useState('');
  const [importClient, setImportClient] = useState('');
  const [importCategory, setImportCategory] = useState<ProjectCategory>('commercial');
  const [importSubCat, setImportSubCat] = useState('clothing');
  const [importAspect, setImportAspect] = useState<AspectRatio>('16:9');
  const [importDuration, setImportDuration] = useState('1:00');

  // JSON Import State
  const [jsonInput, setJsonInput] = useState('');
  const [jsonFeedback, setJsonFeedback] = useState<string | null>(null);

  // Handle PIN Unlock
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

  // Google Drive Projects
  const driveProjects = useMemo(() => {
    return projects.filter(p => p.videoSource === 'gdrive');
  }, [projects]);

  const filteredDriveProjects = useMemo(() => {
    return driveProjects.filter(p => {
      if (driveSubCatFilter !== 'all' && p.subCategory !== driveSubCatFilter) return false;
      if (driveSearch.trim()) {
        const q = driveSearch.trim().toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchClient = p.client.toLowerCase().includes(q);
        const matchRaw = p.originalName ? p.originalName.toLowerCase().includes(q) : false;
        if (!matchTitle && !matchClient && !matchRaw) return false;
      }
      return true;
    });
  }, [driveProjects, driveSubCatFilter, driveSearch]);

  // Traffic Points for Chart
  const dailyPoints = useMemo(() => {
    return getDailyTrafficData(trafficEvents, trafficDays);
  }, [trafficEvents, trafficDays]);

  const maxDailyVisitors = useMemo(() => {
    return Math.max(...dailyPoints.map(p => p.visitors), 1);
  }, [dailyPoints]);

  // Real Dynamic Telemetry Breakdowns derived directly from trafficEvents
  const pageBreakdown = useMemo(() => getRealPageBreakdown(trafficEvents), [trafficEvents]);
  const locationBreakdown = useMemo(() => getRealLocationBreakdown(trafficEvents), [trafficEvents]);
  const deviceBreakdown = useMemo(() => getRealDeviceBreakdown(trafficEvents), [trafficEvents]);
  const referrerBreakdown = useMemo(() => getRealReferrerBreakdown(trafficEvents), [trafficEvents]);

  // Instant Real-Time Test Simulation for Admin
  const handleSimulateRealEvent = () => {
    logTraffic('video_play', 'Live Admin Test: Streamed "Prime Living — Commercial"', {
      videoTitle: 'Prime Living — Ergonomic Bed Topper Commercial',
      category: 'commercial'
    });
  };

  // Handle Select All Drive Projects
  const handleToggleSelectAllDrive = () => {
    if (selectedDriveIds.length === filteredDriveProjects.length) {
      setSelectedDriveIds([]);
    } else {
      setSelectedDriveIds(filteredDriveProjects.map(p => p.id));
    }
  };

  const handleToggleDriveSelect = (id: string) => {
    setSelectedDriveIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Execute Batch Category Update
  const handleApplyBatchUpdate = () => {
    if (selectedDriveIds.length === 0) return;
    batchUpdateCategories(selectedDriveIds, batchCategory, batchSubCat);
    setSelectedDriveIds([]);
  };

  // Execute Google Drive Link Import
  const handleImportDriveLinks = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importLinksText.trim()) return;

    const lines = importLinksText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    const itemsToImport = lines.map((line, idx) => {
      // Support comma or pipe separated: URL | Title | Client
      const parts = line.split(/[|;]/).map(p => p.trim());
      const url = parts[0];
      const title = parts[1] || `${importClient || 'Client'} Release #${idx + 1}`;
      const client = parts[2] || importClient || 'Client Deliverable';

      return {
        videoUrl: url,
        title,
        client,
        category: importCategory,
        subCategory: importSubCat,
        aspectRatio: importAspect,
        duration: importDuration
      };
    });

    importGoogleDriveProjects(itemsToImport);
    setImportLinksText('');
  };

  // Add Custom Subcategory
  const handleAddSubCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubCatName.trim()) return;
    addGoogleDriveSubCategory(newSubCatName);
    setNewSubCatName('');
  };

  // ---------------------------------------------------------------------------
  // RENDER: LOCKED / AUTHENTICATION VIEW
  // ---------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-[#0F121C] border border-white/[0.1] shadow-2xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-gradient-to-r from-cyan-500 to-cyan-400/10 blur-2xl pointer-events-none" />

          {/* Icon Header */}
          <div className="flex flex-col items-center text-center mb-8 relative">
            <div className="w-16 h-16 rounded-2xl bg-[#1A2035] border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4 shadow-lg shadow-cyan-400/10">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">
              Studio Admin Authentication
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
              Protected area for Rayhan Gazi to view real-time site traffic and manage Google Drive categories.
            </p>
          </div>

          {/* PIN Form */}
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Master Security PIN
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  maxLength={10}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    if (pinError) setPinError(false);
                  }}
                  placeholder="Enter PIN (6463)..."
                  autoFocus
                  className={`w-full pl-4 pr-11 py-3 rounded-xl bg-black/60 border text-center font-mono text-lg tracking-[0.3em] text-white placeholder-slate-600 focus:outline-none transition-colors ${
                    pinError ? 'border-rose-500/80 ring-1 ring-rose-500/30' : 'border-white/[0.12] focus:border-cyan-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                  aria-label={showPin ? "Hide PIN" : "Show PIN"}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mt-1.5 px-1">
                <span>Default Security PIN:</span>
                <span className="text-cyan-400 font-bold tracking-wider">6463</span>
              </div>

              {pinError && (
                <div className="flex items-center gap-1.5 text-rose-400 text-xs mt-2 font-mono">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Invalid security PIN. Please try again.</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 active:scale-[0.99] text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/20 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          {/* Quick return button */}
          <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
            <button
              onClick={() => navigateTo('home')}
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Showcase</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: AUTHENTICATED SEPARATED ADMIN PANEL
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
      
      {/* 1. Admin Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-cyan-400 tracking-wider mb-1">
            <span className="relative flex h-2 w-2 isolate shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span>Authenticated Admin Session · RG Multimedia</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Separated Admin & Traffic Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time visitor telemetry, Google Drive category mapping, and complete portfolio control.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigateTo('home')}
            className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.1] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock & Sign Out</span>
          </button>
        </div>
      </div>

      {/* 2. Admin Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 border-b border-white/[0.06] no-scrollbar">
        <button
          onClick={() => setActiveTab('traffic')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'traffic'
              ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black shadow-md'
              : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Site Traffic & Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('gdrive')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'gdrive'
              ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black shadow-md'
              : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
          }`}
        >
          <HardDrive className="w-4 h-4 text-blue-400" />
          <span>Google Drive & Categories ({driveProjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'projects'
              ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black shadow-md'
              : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>All Projects CMS ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('testimonials')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'testimonials'
              ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black shadow-md'
              : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Client Reviews ({testimonials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black shadow-md'
              : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings & Backups</span>
        </button>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* TAB 1: SITE TRAFFIC & ANALYTICS                                       */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'traffic' && (
        <div className="space-y-10 animate-in fade-in duration-300">
          
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <span>Site Traffic Telemetry</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Audience engagement, video streaming completion rates, and shared category link clicks.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/[0.08] text-xs">
                <button
                  onClick={() => setTrafficDays(7)}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-mono ${
                    trafficDays === 7 ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setTrafficDays(14)}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-mono ${
                    trafficDays === 14 ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  14 Days
                </button>
                <button
                  onClick={() => setTrafficDays(30)}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-mono ${
                    trafficDays === 30 ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  30 Days
                </button>
              </div>

              {/* Real-time simulation test button */}
              <button
                onClick={handleSimulateRealEvent}
                title="Test real-time event tracking immediately"
                className="px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-cyan-950/20"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Test Live Event</span>
              </button>

              <button
                onClick={() => resetTraffic(true)}
                title="Restore sensible benchmark telemetry"
                className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => resetTraffic(false)}
                title="Clear all recorded events for raw fresh tracking"
                className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 transition-colors cursor-pointer text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Log</span>
              </button>
            </div>
          </div>

          {/* KPI Cards Strip with Real Metrics and Thin Progress Bars */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-2xl bg-[#0F121C] border border-cyan-500/20 shadow-lg shadow-cyan-950/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Total Visitors</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                </div>
                <div className="font-display text-2xl font-extrabold text-white mt-1 tabular-nums">
                  {trafficStats.totalVisitors.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Unique sessions</span>
              </div>
              <div className="mt-3">
                <AnalyticsMetricBar percentage={100} delayMs={50} color="cyan" heightPx={2} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0F121C] border border-cyan-500/20 shadow-lg shadow-cyan-950/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Page Views</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>
                <div className="font-display text-2xl font-extrabold text-cyan-400 mt-1 tabular-nums">
                  {trafficStats.totalPageViews.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Live verified hits</span>
              </div>
              <div className="mt-3">
                <AnalyticsMetricBar percentage={100} delayMs={100} color="cyan" heightPx={2} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0F121C] border border-cyan-500/20 shadow-lg shadow-cyan-950/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Video Streams</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                </div>
                <div className="font-display text-2xl font-extrabold text-red-400 mt-1 tabular-nums">
                  {trafficStats.totalVideoPlays.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Completed plays</span>
              </div>
              <div className="mt-3">
                <AnalyticsMetricBar percentage={100} delayMs={150} color="red" heightPx={2} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0F121C] border border-cyan-500/20 shadow-lg shadow-cyan-950/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Today Visitors</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="font-display text-2xl font-extrabold text-emerald-400 mt-1 tabular-nums">
                  +{trafficStats.todayVisitors}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Past 24 hours</span>
              </div>
              <div className="mt-3">
                <AnalyticsMetricBar percentage={85} delayMs={200} color="emerald" heightPx={2} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0F121C] border border-cyan-500/20 shadow-lg shadow-cyan-950/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Avg Session</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                </div>
                <div className="font-display text-2xl font-extrabold text-sky-400 mt-1 tabular-nums">
                  {Math.floor(trafficStats.avgSessionSeconds / 60)}m {trafficStats.avgSessionSeconds % 60}s
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Active dwell time</span>
              </div>
              <div className="mt-3">
                <AnalyticsMetricBar percentage={92} delayMs={250} color="blue" heightPx={2} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0F121C] border border-cyan-500/20 shadow-lg shadow-cyan-950/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Bounce Rate</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                </div>
                <div className="font-display text-2xl font-extrabold text-violet-400 mt-1 tabular-nums">
                  {trafficStats.bounceRatePercent}%
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Single page exits</span>
              </div>
              <div className="mt-3">
                <AnalyticsMetricBar percentage={trafficStats.bounceRatePercent} delayMs={300} color="gold" heightPx={2} />
              </div>
            </div>
          </div>

          {/* Interactive Daily Visitor Chart */}
          <div className="p-6 rounded-3xl bg-[#0F121C] border border-cyan-500/20 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Daily Traffic & Video Views</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">True visitor telemetry over the past {trafficDays} days</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-cyan-500 to-cyan-400" /> Visitors
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-red-400" /> Video Plays
                </span>
              </div>
            </div>

            {/* Visual Bar Columns - Mobile horizontal scrollable with min-width */}
            <div className="overflow-x-auto no-scrollbar -mx-2 px-2 pb-2">
              <div 
                className="pt-6 pb-2 grid gap-3 min-w-[480px] sm:min-w-0" 
                style={{ gridTemplateColumns: `repeat(${dailyPoints.length}, minmax(0, 1fr))` }}
              >
                {dailyPoints.map((pt, i) => {
                  const visitorHeightPercent = Math.max(12, Math.round((pt.visitors / maxDailyVisitors) * 100));
                  const videoHeightPercent = Math.max(8, Math.round((pt.videoPlays / maxDailyVisitors) * 75));

                  return (
                    <div key={i} className="flex flex-col items-center gap-2 group gpu-stabilize">
                      <div className="w-full h-44 bg-white/[0.02] rounded-xl flex items-end justify-center gap-1.5 p-1 relative border border-white/[0.04] group-hover:border-cyan-500/30 transition-colors">
                        {/* Tooltip on Hover */}
                        <div className="absolute -top-10 bg-black/90 text-white text-[10px] font-mono px-2 py-1 rounded border border-white/20 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                          {pt.visitors} visitors · {pt.videoPlays} plays · {pt.pageViews} views
                        </div>

                        {/* Bar 1: Visitors */}
                        <div
                          className="w-1/2 bg-gradient-to-t from-[#00F0FF]/40 to-[#00F0FF] rounded-t-md transition-all duration-700 ease-out shadow-sm shadow-cyan-500/20"
                          style={{ height: `${visitorHeightPercent}%` }}
                        />

                        {/* Bar 2: Video Plays */}
                        <div
                          className="w-1/2 bg-gradient-to-t from-red-500/40 to-red-400 rounded-t-md transition-all duration-700 ease-out shadow-sm shadow-red-500/20"
                          style={{ height: `${videoHeightPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 text-center truncate w-full">
                        {pt.dateLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detailed Telemetry Grid: Page Traffic, Geolocation, Device Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 1. Traffic By Page - DYNAMIC REAL DATA */}
            <div className="p-6 rounded-3xl bg-[#0F121C] border border-cyan-500/20 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-cyan-400" />
                  <span>Traffic by Page View</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Real hits</span>
              </div>

              <div className="space-y-3 text-xs">
                {pageBreakdown.map((item, idx) => {
                  const colors: ('cyan' | 'blue' | 'emerald' | 'gold' | 'red')[] = ['cyan', 'blue', 'emerald', 'gold', 'red'];
                  const barColor = colors[idx % colors.length];
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-mono truncate">{item.label}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-semibold text-white">{item.count} views</span>
                          <span className="text-[10px] font-mono text-cyan-400 font-bold">({item.percent}%)</span>
                        </div>
                      </div>
                      <AnalyticsMetricBar percentage={item.percent} delayMs={idx * 60} color={barColor} heightPx={2} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Top Geolocation Traffic - DYNAMIC REAL DATA */}
            <div className="p-6 rounded-3xl bg-[#0F121C] border border-cyan-500/20 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Audience Origin Cities</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Live origins</span>
              </div>

              <div className="space-y-3 text-xs">
                {locationBreakdown.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="truncate">{item.label}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-emerald-400 font-semibold">{item.count}</span>
                        <span className="text-[10px] font-mono text-slate-400">({item.percent}%)</span>
                      </div>
                    </div>
                    <AnalyticsMetricBar percentage={item.percent} delayMs={idx * 60} color="emerald" heightPx={2} />
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Device & Referrer Breakdown - DYNAMIC REAL DATA */}
            <div className="p-6 rounded-3xl bg-[#0F121C] border border-cyan-500/20 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-sky-400" />
                  <span>Device & Referral Source</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Real telemetry</span>
              </div>

              <div className="space-y-4 text-xs">
                {/* Devices */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Platform Split</span>
                  <div className="flex items-center justify-between text-slate-300 font-mono text-[11px]">
                    <span>Mobile ({deviceBreakdown.mobilePct}%) · {deviceBreakdown.mobileCount}</span>
                    <span>Desktop ({deviceBreakdown.desktopPct}%) · {deviceBreakdown.desktopCount}</span>
                    <span>Tablet ({deviceBreakdown.tabletPct}%) · {deviceBreakdown.tabletCount}</span>
                  </div>
                  <AnalyticsMetricBar percentage={deviceBreakdown.mobilePct || 50} color="blue" heightPx={2.5} />
                </div>

                {/* Referrers */}
                <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Inbound Channels</span>
                  {referrerBreakdown.map((r, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="truncate">{r.label}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-cyan-400 font-semibold">{r.count}</span>
                          <span className="text-[10px] font-mono text-slate-400">({r.percent}%)</span>
                        </div>
                      </div>
                      <AnalyticsMetricBar percentage={r.percent} delayMs={i * 60} color="cyan" heightPx={1.5} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Real-Time Live Activity Event Log */}
          <div className="p-6 rounded-3xl bg-[#0F121C] border border-cyan-500/20 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-sm font-bold text-white flex items-center gap-2 gpu-stabilize">
                  <span className="relative flex h-2.5 w-2.5 isolate shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                  </span>
                  <span>Real-Time Visitor Activity Stream</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">Live events logged across visitor sessions</span>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-semibold">
                {trafficEvents.length} total events · {Math.min(trafficEvents.length, 30)} showing
              </span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {trafficEvents.slice(0, 30).map((ev) => {
                const dateStr = new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                
                let badgeColor = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
                if (ev.type === 'video_play') badgeColor = 'bg-red-500/10 text-red-400 border-red-500/30';
                if (ev.type === 'category_filter') badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
                if (ev.type === 'share_link') badgeColor = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
                if (ev.type === 'inquiry_submit') badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

                return (
                  <div
                    key={ev.id}
                    style={{
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden'
                    }}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:border-cyan-500/30 transition-colors gpu-stabilize"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border shrink-0 ${badgeColor}`}>
                        {ev.type.replace('_', ' ')}
                      </span>
                      <span className="text-white font-medium truncate">{ev.details}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 shrink-0 self-end sm:self-auto">
                      <span className="text-slate-400">{ev.device}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-300">{ev.location}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-cyan-400/80">{dateStr}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 2: GOOGLE DRIVE & CATEGORIES HUB                                  */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'gdrive' && (
        <div className="space-y-10 animate-in fade-in duration-300">
          
          {/* Header & Overview */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-blue-400" />
                <span>Google Drive Deliverables & Categories Hub</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage, update, and batch-assign categories for Google Drive cloud client archives and deliverables.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                {driveProjects.length} Drive Releases
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300">
                {googleDriveSubCategories.length} Categories
              </span>
            </div>
          </div>

          {/* Quick Subcategory Filter Pills */}
          <div className="p-5 rounded-2xl bg-[#0F121C] border border-white/[0.08] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-mono uppercase text-slate-400">Filter By Google Drive Subcategory</span>
              
              {/* Add Custom Subcategory Tag Form */}
              <form onSubmit={handleAddSubCategory} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="New subcategory name..."
                  value={newSubCatName}
                  onChange={(e) => setNewSubCatName(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-black/50 border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-black text-xs font-bold transition-colors cursor-pointer"
                >
                  Add Tag
                </button>
              </form>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setDriveSubCatFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  driveSubCatFilter === 'all'
                    ? 'bg-blue-500 text-white font-bold'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white'
                }`}
              >
                All Subcategories ({driveProjects.length})
              </button>

              {googleDriveSubCategories.map(cat => {
                const count = driveProjects.filter(p => p.subCategory === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setDriveSubCatFilter(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      driveSubCatFilter === cat
                        ? 'bg-blue-500 text-white font-bold'
                        : 'bg-white/[0.04] text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Batch Category Reassignment Action Bar (When items are checked) */}
          {selectedDriveIds.length > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/30 to-[#121624] border border-blue-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in slide-in-from-top duration-200">
              <div className="flex items-center gap-3">
                <CheckSquare className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-xs font-bold text-white">
                    {selectedDriveIds.length} Google Drive Projects Selected
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Batch update category and subcategory for all selected cuts at once
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={batchCategory}
                  onChange={(e) => setBatchCategory(e.target.value as ProjectCategory)}
                  className="px-3 py-1.5 rounded-lg bg-black/80 border border-white/20 text-xs text-white focus:outline-none"
                >
                  <option value="commercial">Commercial</option>
                  <option value="youtube">YouTube Cut</option>
                  <option value="short_form">9:16 Short-Form</option>
                  <option value="music_video">Music Video</option>
                </select>

                <select
                  value={batchSubCat}
                  onChange={(e) => setBatchSubCat(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-black/80 border border-white/20 text-xs text-white focus:outline-none"
                >
                  {googleDriveSubCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <button
                  onClick={handleApplyBatchUpdate}
                  className="px-4 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Apply to Selected
                </button>

                <button
                  onClick={() => setSelectedDriveIds([])}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-slate-300 text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Quick Search & Select All Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleSelectAllDrive}
                className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-mono flex items-center gap-2 border border-white/[0.08] cursor-pointer"
              >
                {selectedDriveIds.length === filteredDriveProjects.length && filteredDriveProjects.length > 0 ? (
                  <CheckSquare className="w-4 h-4 text-blue-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500" />
                )}
                <span>Select All ({filteredDriveProjects.length})</span>
              </button>

              <span className="text-xs text-slate-400 font-mono">
                Showing {filteredDriveProjects.length} cuts
              </span>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search drive projects by title or client..."
                value={driveSearch}
                onChange={(e) => setDriveSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Table / List of Google Drive Projects with Instant Category Updaters */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0F121C] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#090A0F] text-slate-400 font-mono text-[11px] uppercase border-b border-white/[0.08]">
                  <tr>
                    <th className="py-3 px-4 w-10"></th>
                    <th className="py-3 px-4">Preview</th>
                    <th className="py-3 px-4">Title & Client</th>
                    <th className="py-3 px-4">Main Category</th>
                    <th className="py-3 px-4">Drive Subcategory</th>
                    <th className="py-3 px-4">Ratio</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredDriveProjects.map((project) => {
                    const isSelected = selectedDriveIds.includes(project.id);
                    const driveThumb = getGoogleDriveThumbnail(project.videoUrl) || project.thumbnailUrl || '/og-cover.jpg';

                    return (
                      <tr 
                        key={project.id} 
                        className={`hover:bg-white/[0.02] transition-colors ${isSelected ? 'bg-blue-500/5' : ''}`}
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleDriveSelect(project.id)}
                            className="text-slate-400 hover:text-white cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-blue-400" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-600" />
                            )}
                          </button>
                        </td>

                        {/* Thumbnail Preview */}
                        <td className="py-3 px-4">
                          <div 
                            onClick={() => openProjectVideo(project)}
                            className="w-16 h-10 rounded-lg overflow-hidden bg-black relative cursor-pointer group shrink-0 border border-white/10"
                          >
                            <img
                              src={driveThumb}
                              alt={project.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="w-3.5 h-3.5 fill-white text-white" />
                            </div>
                          </div>
                        </td>

                        {/* Title & Client */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white truncate max-w-xs sm:max-w-sm">
                            {project.title}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-xs">
                            {project.client} · {project.year}
                          </div>
                        </td>

                        {/* Category Selector (Instant Update) */}
                        <td className="py-3 px-4">
                          <select
                            value={project.category}
                            onChange={(e) => updateProjectCategory(project.id, e.target.value as ProjectCategory)}
                            className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/[0.12] text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                          >
                            <option value="commercial">Commercial</option>
                            <option value="youtube">YouTube Cut</option>
                            <option value="short_form">9:16 Short-Form</option>
                            <option value="music_video">Music Video</option>
                          </select>
                        </td>

                        {/* Subcategory Selector (Instant Update) */}
                        <td className="py-3 px-4">
                          <select
                            value={project.subCategory || 'clothing'}
                            onChange={(e) => updateProjectCategory(project.id, project.category, e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/[0.12] text-xs text-blue-300 font-mono focus:outline-none focus:border-blue-400 cursor-pointer"
                          >
                            {googleDriveSubCategories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </td>

                        {/* Aspect Ratio */}
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                          {project.aspectRatio}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openProjectVideo(project)}
                              title="Test Video Stream"
                              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>

                            <a
                              href={project.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              title="Open in Google Drive"
                              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Import New Projects from Google Drive Links */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0F121C] border border-white/[0.08] space-y-6">
            <div>
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-400" />
                <span>Import & Categorize New Google Drive Links</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Paste Google Drive video links to automatically extract high-resolution thumbnails, assign categories, and sync into your portfolio.
              </p>
            </div>

            <form onSubmit={handleImportDriveLinks} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                  Google Drive URLs (One per line, or URL | Title | Client)
                </label>
                <textarea
                  rows={4}
                  value={importLinksText}
                  onChange={(e) => setImportLinksText(e.target.value)}
                  placeholder="https://drive.google.com/file/d/1Y_U3teTHTIIyrounWxJyiB-azZ6-n2yR/view | Winter Hoodie Commercial | Dhaka Streetwear&#10;https://drive.google.com/file/d/1E7JsB43s9XsDBfK_LjnJhIiHOIHrlZy4/view | Silk Collection Reel | Dhaka Fashion"
                  className="w-full p-4 rounded-xl bg-black/60 border border-white/[0.12] text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-mono mb-1">Default Client</label>
                  <input
                    type="text"
                    value={importClient}
                    onChange={(e) => setImportClient(e.target.value)}
                    placeholder="e.g. Prime Living BD"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/[0.1] text-xs text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 font-mono mb-1">Assign Category</label>
                  <select
                    value={importCategory}
                    onChange={(e) => setImportCategory(e.target.value as ProjectCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/[0.1] text-xs text-white focus:outline-none"
                  >
                    <option value="commercial">Commercial</option>
                    <option value="youtube">YouTube Cut</option>
                    <option value="short_form">9:16 Short-Form</option>
                    <option value="music_video">Music Video</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 font-mono mb-1">Drive Subcategory</label>
                  <select
                    value={importSubCat}
                    onChange={(e) => setImportSubCat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/[0.1] text-xs text-white focus:outline-none"
                  >
                    {googleDriveSubCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 font-mono mb-1">Aspect Ratio</label>
                  <select
                    value={importAspect}
                    onChange={(e) => setImportAspect(e.target.value as AspectRatio)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/[0.1] text-xs text-white focus:outline-none"
                  >
                    <option value="16:9">16:9 Landscape</option>
                    <option value="9:16">9:16 Vertical Reel</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={!importLinksText.trim()}
                  className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Import Google Drive Cuts</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 3: ALL PROJECTS CMS                                               */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'projects' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-white">Full Portfolio Projects List</h2>
              <p className="text-xs text-slate-400">Total {projects.length} commercial, YouTube, and vertical reel projects</p>
            </div>
            <button
              onClick={() => {
                const title = prompt('Enter project title:');
                if (!title) return;
                const client = prompt('Enter client name:') || 'Client';
                const videoUrl = prompt('Enter video URL (YouTube or Google Drive):') || '';
                addProject({
                  title,
                  client,
                  category: 'commercial',
                  aspectRatio: '16:9',
                  videoSource: videoUrl.includes('drive.google.com') ? 'gdrive' : 'youtube',
                  videoUrl,
                  duration: '1:00',
                  tools: ['Premiere Pro', 'DaVinci Resolve Studio'],
                  description: 'Commercial video cut for brand client.',
                  year: '2026',
                  accentColor: '#00F0FF'
                });
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#0F121C] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#090A0F] text-slate-400 font-mono text-[11px] uppercase border-b border-white/[0.08]">
                  <tr>
                    <th className="py-3 px-4">Title & Client</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Ratio</th>
                    <th className="py-3 px-4">Year</th>
                    <th className="py-3 px-4 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{p.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{p.client}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${
                          p.videoSource === 'youtube' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {p.videoSource}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {p.category}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {p.aspectRatio}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {p.year}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${p.title}"?`)) {
                              deleteProject(p.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 4: CLIENT TESTIMONIALS                                            */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-white">Client Testimonials & Outcomes</h2>
              <p className="text-xs text-slate-400">Verified social proof and performance metrics for brands</p>
            </div>
            <button
              onClick={() => {
                const clientName = prompt('Enter client name:');
                if (!clientName) return;
                const companyOrChannel = prompt('Enter brand / company:') || 'Brand';
                const quote = prompt('Enter review quote:') || 'Excellent editing quality.';
                const metricHighlight = prompt('Enter metric highlight (e.g. +34% Retention):') || '+30% Retention';
                addTestimonial({
                  clientName,
                  clientRole: 'Creative Director',
                  companyOrChannel,
                  quote,
                  metricHighlight
                });
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Testimonial</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map(t => (
              <div key={t.id} className="p-6 rounded-2xl bg-[#0F121C] border border-white/[0.08] flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">{t.metricHighlight}</span>
                    <button
                      onClick={() => {
                        if (confirm(`Delete review from ${t.clientName}?`)) {
                          deleteTestimonial(t.id);
                        }
                      }}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] text-xs">
                  <div className="font-semibold text-white">{t.clientName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{t.clientRole} · {t.companyOrChannel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 5: SETTINGS & BACKUPS                                             */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'settings' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div>
            <h2 className="font-display text-xl font-bold text-white">Studio Profile & Portfolio Settings</h2>
            <p className="text-xs text-slate-400">Configure editor metadata, showreel links, PIN security, and JSON backups.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Profile Config */}
            <div className="p-6 rounded-2xl bg-[#0F121C] border border-white/[0.08] space-y-4">
              <h3 className="text-sm font-bold text-white">Editor Credentials</h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-mono block mb-1">Editor Name</label>
                  <input
                    type="text"
                    value={settings.editorName}
                    onChange={(e) => updateSettings({ editorName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/[0.1] text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-mono block mb-1">Role Title</label>
                  <input
                    type="text"
                    value={settings.roleTitle}
                    onChange={(e) => updateSettings({ roleTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/[0.1] text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-mono block mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSettings({ email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/[0.1] text-white focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-400 font-mono">Admin Security PIN</label>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">Current: {settings.adminPin}</span>
                  </div>
                  <input
                    type="text"
                    maxLength={10}
                    value={settings.adminPin}
                    onChange={(e) => updateSettings({ adminPin: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/[0.1] font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Showreel Config */}
            <div className="p-6 rounded-2xl bg-[#0F121C] border border-white/[0.08] space-y-4">
              <h3 className="text-sm font-bold text-white">4K Master Showreel Links</h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-mono block mb-1">Showreel Video URL (Google Drive / YouTube)</label>
                  <input
                    type="text"
                    value={settings.showreelUrl}
                    onChange={(e) => updateSettings({ showreelUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/[0.1] text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-mono block mb-1">Showreel Thumbnail URL</label>
                  <input
                    type="text"
                    value={settings.showreelThumbnailUrl || ''}
                    onChange={(e) => updateSettings({ showreelThumbnailUrl: e.target.value })}
                    placeholder="/showreel-thumbnail.jpg"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/[0.1] text-white font-mono focus:outline-none"
                  />
                </div>

                {/* Backup export & reset */}
                <div className="pt-4 border-t border-white/[0.06] flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      const json = exportDataToJson();
                      const blob = new Blob([json], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `rayhan-gazi-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Backup</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Reset portfolio to initial data? All changes will be replaced.')) {
                        resetToDefaults();
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset to Initial Data</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
