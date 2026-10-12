import React, { Component, ErrorInfo, ReactNode } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/pages/HomeView';
import { Gallery } from './components/Gallery';
import { ShowreelView } from './components/pages/ShowreelView';
import { ReviewsView } from './components/pages/ReviewsView';
import { ContactView } from './components/pages/ContactView';
import { Footer } from './components/Footer';
import { VideoModal } from './components/VideoModal';
import { AdminCMSModal } from './components/AdminCMSModal';
import { PageLoader } from './components/PageLoader';
import { CoolPageTransition } from './components/CoolPageTransition';
import { ToastNotification } from './components/ToastNotification';
import { Film, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Portfolio ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#090A0F] text-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="w-14 h-14 rounded-2xl bg-[#1A2035] border border-[#E5A93C]/40 flex items-center justify-center mb-5 shadow-lg shadow-[#E5A93C]/10">
            <Film className="w-6 h-6 text-[#E5A93C]" />
          </div>
          <h1 className="text-xl font-bold font-display uppercase tracking-wider mb-2">
            Rayhan Gazi Portfolio
          </h1>
          <p className="text-sm text-slate-400 max-w-md mb-6 font-mono text-xs">
            A temporary display issue occurred. Click below to reload the high-definition showcase.
          </p>
          <button
            onClick={() => {
              try {
                localStorage.clear();
              } catch (e) {
                // Ignore localStorage errors
              }
              window.location.reload();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E5A93C] text-black font-semibold text-xs tracking-wider uppercase hover:bg-[#F59E0B] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Portfolio
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const MainContent: React.FC = () => {
  const { currentPage } = usePortfolio();

  return (
    <main className="flex-1 animate-in fade-in duration-300">
      {currentPage === 'home' && <HomeView />}
      {currentPage === 'projects' && <Gallery />}
      {currentPage === 'showreel' && <ShowreelView />}
      {currentPage === 'reviews' && <ReviewsView />}
      {currentPage === 'contact' && <ContactView />}
    </main>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <PortfolioProvider>
        {/* Initial First-Load Cinematic Animation */}
        <PageLoader />

        {/* Lightweight Cinematic Transition for switching between pages */}
        <CoolPageTransition />

        {/* Dynamic feedback toast for Sharable category / reel buttons */}
        <ToastNotification />

        <div className="min-h-screen bg-[#090A0F] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#E5A93C]/20 selection:text-[#E5A93C]">
          {/* Navigation Bar */}
          <Navbar />

          {/* Dedicated Page View Content */}
          <MainContent />

          {/* Footer */}
          <Footer />

          {/* Lightbox Cinema Video Player Modal */}
          <VideoModal />

          {/* Protected Content Management Modal */}
          <AdminCMSModal />
        </div>
      </PortfolioProvider>
    </ErrorBoundary>
  );
}
