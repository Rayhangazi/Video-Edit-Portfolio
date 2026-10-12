import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Lock, ArrowUp, Film } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, openAdminModal, isAuthenticated } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full py-12 border-t border-white/[0.08] bg-[#090A0F]">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/[0.06]">
          
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-display font-extrabold text-lg text-white tracking-tight">
              {settings.editorName.toUpperCase()}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {settings.roleTitle}
            </span>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <a href="#works" className="hover:text-white transition-colors">
              YouTube Works
            </a>
            <a href="#drive-demos" className="text-blue-300 hover:text-white transition-colors">
              Drive Demos
            </a>
            <a href="#showreel" className="hover:text-white transition-colors">
              Master Showreel
            </a>
            <a href="#testimonials" className="hover:text-white transition-colors">
              Client Reviews
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Inquire
            </a>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
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
              onClick={openAdminModal}
              className="text-xs text-slate-400 hover:text-[#E5A93C] transition-colors flex items-center gap-1.5 font-mono"
            >
              <Lock className="w-3 h-3" />
              <span>{isAuthenticated ? 'Admin CMS Active' : 'CMS Portal'}</span>
            </button>
            <span className="text-slate-700">·</span>
            <span className="text-slate-400 font-mono">
              Direct: {settings.email}
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
