import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Check, X, Share2 } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toastMessage, hideToast } = usePortfolio();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="p-3.5 sm:p-4 rounded-xl bg-[#0F121C]/95 border border-[#E5A93C]/40 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#E5A93C]/20 border border-[#E5A93C]/40 flex items-center justify-center text-[#E5A93C] shrink-0">
            <Check className="w-4 h-4 text-[#E5A93C]" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-100 truncate">
            {toastMessage}
          </p>
        </div>

        <button
          onClick={hideToast}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors shrink-0"
          aria-label="Dismiss message"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
