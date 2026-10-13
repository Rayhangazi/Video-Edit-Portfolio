import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { AppPage } from '../types/portfolio';
import { Lock, SlidersHorizontal, Menu, X, Film, FolderGit2, Star, Mail, Home, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { isAuthenticated, currentPage, navigateTo } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { page: AppPage; label: string; icon: any }[] = [
    { page: 'home', label: 'Home', icon: Home },
    { page: 'projects', label: 'Projects', icon: FolderGit2 },
    { page: 'showreel', label: 'Showreel', icon: Film },
    { page: 'reviews', label: 'Reviews', icon: Star },
    { page: 'contact', label: 'Contact', icon: Mail },
  ];

  const handleNavClick = (page: AppPage) => {
    navigateTo(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#050B14]/80 border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.6),0_1px_15px_rgba(6,182,212,0.12)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-4">
        
        {/* Brand Zone */}
        <button
          onClick={() => handleNavClick('home')}
          className="group font-display text-lg sm:text-xl font-extrabold tracking-tight text-white hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="tracking-wider">RAYHAN GAZI</span>
          <span className="text-xs font-mono text-cyan-400/70 hidden sm:inline-block">/ Video Editor</span>
        </button>

        {/* Desktop Page Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 p-1.5 bg-slate-950/60 border border-cyan-500/20 rounded-2xl text-xs font-medium backdrop-blur-md shadow-[inset_0_1px_4px_rgba(0,0,0,0.4)]">
          {navItems.map(item => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap font-medium ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold shadow-[0_0_18px_rgba(6,182,212,0.5)]'
                    : 'text-slate-300 hover:text-cyan-200 hover:bg-cyan-500/10'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('admin')}
            title={isAuthenticated ? "Admin Hub Active" : "Open Admin Panel"}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border flex items-center gap-1.5 cursor-pointer ${
              currentPage === 'admin'
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold border-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.5)]'
                : isAuthenticated 
                  ? 'bg-cyan-950/50 border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/60 shadow-[0_0_12px_rgba(6,182,212,0.2)]' 
                  : 'bg-slate-900/40 border-cyan-500/20 text-slate-300 hover:text-cyan-300 hover:border-cyan-400/50 hover:bg-cyan-950/30'
            }`}
            aria-label="Admin Panel & Traffic Hub"
          >
            {isAuthenticated ? (
              <>
                <SlidersHorizontal className="w-3.5 h-3.5 text-current animate-pulse" />
                <span className="hidden lg:inline text-[11px] font-mono">Admin Hub</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-current" />
                <span className="hidden lg:inline text-[11px] font-mono">Admin</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold text-black bg-gradient-to-r from-cyan-500 via-cyan-400 to-[#00F0FF] hover:from-cyan-400 hover:to-cyan-300 active:scale-[0.98] transition-all rounded-xl whitespace-nowrap shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] cursor-pointer"
          >
            Book Project
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900/50 border border-cyan-500/30 text-cyan-300 hover:text-white cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-cyan-500/20 bg-[#050B14]/95 backdrop-blur-2xl px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`w-full px-4 py-3 rounded-xl text-left text-sm font-semibold flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black shadow-lg shadow-cyan-500/30 font-bold'
                    : 'text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {isActive && <span className="text-[10px] uppercase font-mono tracking-wider font-bold">Active</span>}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
