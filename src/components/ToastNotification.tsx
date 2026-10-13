import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Check, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toastMessage, hideToast } = usePortfolio();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="p-3.5 sm:p-4 rounded-xl glass-panel border border-cyan-500/40 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_25px_rgba(6,182,212,0.25)] backdrop-blur-xl flex items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            <Check className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-100 truncate">
            {toastMessage}
          </p>
        </div>

        <button
          onClick={hideToast}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-cyan-500/10 transition-colors shrink-0 cursor-pointer"
          aria-label="Dismiss message"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
