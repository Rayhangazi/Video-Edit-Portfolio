import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Lock, ArrowUp, Film, Sparkles } from 'lucide-react';
import { AppPage } from '../types/portfolio';

export const Footer: React.FC = () => {
  const { settings, openAdminModal, isAuthenticated, navigateTo } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full py-12 border-t border-cyan-500/15 bg-[#050B14]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-cyan-500/10">
          
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-3 h-3" />
              </div>
              <span className="font-display font-extrabold text-lg text-white tracking-tight">
                {settings.editorName.toUpperCase()}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono text-center md:text-left">
              {settings.roleTitle}
            </span>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-medium">
            <button 
              onClick={() => navigateTo('home')} 
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Home
            </button>
            <button 
              onClick={() => navigateTo('projects')} 
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              All Projects
            </button>
            <button 
              onClick={() => navigateTo('projects', 'commercial')} 
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Commercials
            </button>
            <button 
              onClick={() => navigateTo('projects', 'gdrive')} 
              className="text-cyan-400 hover:text-cyan-200 transition-colors cursor-pointer font-mono"
            >
              Drive Deliverables
            </button>
            <button 
              onClick={() => navigateTo('showreel')} 
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Master Showreel
            </button>
            <button 
              onClick={() => navigateTo('reviews')} 
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Client Reviews
            </button>
            <button 
              onClick={() => navigateTo('contact')} 
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Inquire
            </button>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-cyan-950/40 text-slate-300 hover:text-cyan-300 border border-cyan-500/20 hover:border-cyan-400/40 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer shadow-sm"
            aria-label="Back to top"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} {settings.editorName} · RG Multimedia (Dhaka, Bangladesh). All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo('admin')}
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5 font-mono cursor-pointer"
            >
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>{isAuthenticated ? 'Admin Hub & Traffic' : 'Studio Admin Panel'}</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
