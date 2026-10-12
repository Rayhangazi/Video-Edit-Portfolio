import React from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Gallery } from './components/Gallery';
import { Testimonials } from './components/Testimonials';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { VideoModal } from './components/VideoModal';
import { AdminCMSModal } from './components/AdminCMSModal';
import { PageLoader } from './components/PageLoader';

export default function App() {
  return (
    <PortfolioProvider>
      <PageLoader />
      <div className="min-h-screen bg-[#090A0F] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#E5A93C]/20 selection:text-[#E5A93C]">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1">
          {/* Split Screen Hero with Showreel & Headline Metrics */}
          <Hero />

          {/* Interactive Project Showcase Gallery */}
          <Gallery />

          {/* Attributable Client Testimonials with Quantifiable Results */}
          <Testimonials />

          {/* Sleek Minimalist Inquiry Form */}
          <ContactSection />
        </main>

        {/* Minimalist Footer */}
        <Footer />

        {/* Lightbox Cinema Video Player Modal */}
        <VideoModal />

        {/* PIN-Protected Content Management System Modal */}
        <AdminCMSModal />
      </div>
    </PortfolioProvider>
  );
}
