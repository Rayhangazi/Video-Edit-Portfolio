import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { AppPage } from '../types/portfolio';
import { Lock, SlidersHorizontal, Menu, X, Film, FolderGit2, Star, Mail, Home } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { openAdminModal, isAuthenticated, currentPage, navigateTo } = usePortfolio();
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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#090A0F]/90 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-4">
        
        {/* Brand Zone */}
        <button
          onClick={() => handleNavClick('home')}
          className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-white hover:text-[#E5A93C] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <span>RAYHAN GAZI</span>
          <span className="text-xs font-normal text-slate-400 hidden sm:inline-block">/ Video Editor</span>
        </button>

        {/* Desktop Page Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs font-medium">
          {navItems.map(item => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#E5A93C] text-black font-semibold shadow-sm shadow-[#E5A93C]/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
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
            onClick={openAdminModal}
            title={isAuthenticated ? "Admin CMS Active" : "Open Admin CMS"}
            className={`p-2 rounded-lg text-xs font-medium transition-colors border cursor-pointer ${
              isAuthenticated 
                ? 'bg-[#E5A93C]/10 border-[#E5A93C]/30 text-[#E5A93C] hover:bg-[#E5A93C]/20' 
                : 'bg-white/[0.04] border-white/[0.1] text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
            aria-label="Content Management System"
          >
            {isAuthenticated ? (
              <SlidersHorizontal className="w-4 h-4" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold text-black bg-[#E5A93C] hover:bg-[#f3b544] active:scale-[0.98] transition-all rounded-lg whitespace-nowrap shrink-0 shadow-sm shadow-[#E5A93C]/10 cursor-pointer"
          >
            Book Project
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-slate-300 hover:text-white cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#090A0F]/95 backdrop-blur-xl px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`w-full px-4 py-3 rounded-xl text-left text-sm font-semibold flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-[#E5A93C] text-black shadow-md'
                    : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
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
