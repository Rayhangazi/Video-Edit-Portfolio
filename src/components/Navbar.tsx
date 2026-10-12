import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Lock, SlidersHorizontal } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { openAdminModal, isAuthenticated } = usePortfolio();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#090A0F]/85 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element Brand Zone */}
        <a 
          href="#" 
          className="font-display text-xl font-extrabold tracking-tight text-white hover:text-[#E5A93C] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span>RAYHAN GAZI</span>
          <span className="text-xs font-normal text-slate-400 hidden sm:inline-block">/ Video Editor</span>
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a href="#works" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            YouTube Works
          </a>
          <a href="#drive-demos" className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-blue-300 hover:text-blue-200">
            <span>Drive Demos</span>
          </a>
          <a href="#showreel" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Showreel
          </a>
          <a href="#testimonials" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Reviews
          </a>
          <a href="#contact" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Contact
          </a>
        </nav>

        {/* Zone 3: Primary Action + Admin trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={openAdminModal}
            title={isAuthenticated ? "Admin CMS Active" : "Open Admin CMS"}
            className={`p-2 rounded-lg text-xs font-medium transition-colors border ${
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

          <a
            href="#contact"
            className="px-5 py-2.5 text-xs font-semibold text-black bg-[#E5A93C] hover:bg-[#f3b544] active:scale-[0.98] transition-all rounded-lg whitespace-nowrap shrink-0 shadow-sm shadow-[#E5A93C]/10"
          >
            Book Project
          </a>
        </div>

      </div>
    </header>
  );
};
