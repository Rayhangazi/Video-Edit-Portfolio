import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectCategory } from '../types/portfolio';
import { Send, CheckCircle2, Copy, Check, Clock, Sparkles } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { settings, showToast, logTraffic } = usePortfolio();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'commercial' as ProjectCategory,
    budget: '৳35,000 – ৳70,000',
    timeline: '',
    projectBrief: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Track contact form submission in traffic analytics
    logTraffic('inquiry_submit', `Inquiry sent by ${formData.name} (${formData.email}) for ${formData.category}`);

    // Simulate reliable delivery with graceful UI feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast('⚡ Project inquiry transmitted successfully! Rayhan will reply within 12 hours.');
    }, 800);
  };

  const handleCopyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(settings.email);
      setCopiedEmail(true);
      showToast('✓ Email address copied to clipboard');
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-24 border-b border-cyan-500/15 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct Communication Info */}
          <div className="lg:col-span-5">
            <div className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-2 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
              Dhaka, Bangladesh · Available Worldwide
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-6">
              Let’s build something extraordinary.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Based in Dhaka, Bangladesh. Available for commercial ad campaigns, long-form YouTube retainers, and high-volume short-form content. Typical turnaround time is 48 hours for first rough cuts.
            </p>

            {/* Direct Email Card */}
            <div className="p-6 rounded-2xl glass-card space-y-4">
              <div className="text-xs text-cyan-400 uppercase tracking-wider font-mono">
                Direct Inquiries
              </div>
              <div className="flex items-center justify-between gap-4">
                <a
                  href={`mailto:${settings.email}`}
                  className="font-medium text-white hover:text-cyan-300 transition-colors truncate text-sm sm:text-base"
                >
                  {settings.email}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-2 rounded-xl bg-slate-900/60 border border-cyan-500/25 text-slate-300 hover:text-cyan-300 hover:border-cyan-400/50 transition-colors shrink-0"
                  title="Copy email to clipboard"
                  aria-label="Copy email"
                >
                  {copiedEmail ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="pt-3 border-t border-cyan-500/15 flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Response time: Within 12 hours</span>
              </div>
            </div>

            {/* Workflow Guarantees */}
            <div className="mt-8 space-y-3">
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Lossless 4K Master Exports (ProRes 422 / H.265)</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Frame.io / Google Drive review links with timestamp feedback</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Two rounds of revisions included with every delivery</span>
              </div>
            </div>

          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl glass-panel shadow-2xl">
              
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    <CheckCircle2 className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">
                    Project Brief Received
                  </h3>
                  <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{formData.name}</strong>. I will review your footage scope and respond via <strong className="text-white">{formData.email}</strong> within 12 hours with availability and a concrete quote.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        category: 'commercial',
                        budget: '৳35,000 – ৳70,000',
                        timeline: '',
                        projectBrief: ''
                      });
                    }}
                    className="mt-6 px-6 py-2.5 rounded-xl bg-slate-900/60 border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400/60 text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-cyan-500/15 pb-4 mb-2">
                    <h3 className="font-display text-lg font-bold text-white">
                      Direct Project Inquiry
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tell me about your creative goals, deadlines, and footage scope.
                    </p>
                  </div>

                  {/* Name and Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-slate-300">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Alex Morgan"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-cyan-500/25 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-colors backdrop-blur-md"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-slate-300">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alex@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-cyan-500/25 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-colors backdrop-blur-md"
                      />
                    </div>
                  </div>

                  {/* Project Category & Budget row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-slate-300">
                        Project Format
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-cyan-500/25 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-colors backdrop-blur-md"
                      >
                        <option value="commercial">Commercial / Brand Film</option>
                        <option value="youtube">YouTube (Long-form & Docu)</option>
                        <option value="music_video">Music Video</option>
                        <option value="short_form">Short-Form (Reels / TikTok)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-slate-300">
                        Estimated Budget (BDT / ৳)
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-cyan-500/25 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-colors backdrop-blur-md"
                      >
                        <option value="৳15,000 – ৳35,000">৳15,000 – ৳35,000 (Single Commercial / Reel)</option>
                        <option value="৳35,000 – ৳70,000">৳35,000 – ৳70,000 (Campaign Pack / High Pacing)</option>
                        <option value="৳70,000 – ৳1,50,000">৳70,000 – ৳1,50,000 (Monthly Brand Retainer)</option>
                        <option value="৳1,50,000+">৳1,50,000+ (Enterprise TVC & Multi-Cut Series)</option>
                      </select>
                    </div>
                  </div>

                  {/* Desired Timeline */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Target Turnaround / Deadline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rough cut in 48h, final delivery next Friday"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-cyan-500/25 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-colors backdrop-blur-md"
                    />
                  </div>

                  {/* Project Brief / Footage Link */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Project Scope & Footage Link *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share details about pacing, desired visual references, raw footage runtime, or Google Drive / Frame.io links..."
                      value={formData.projectBrief}
                      onChange={(e) => setFormData({ ...formData, projectBrief: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-cyan-500/25 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-colors resize-none backdrop-blur-md"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-cyan-500 via-cyan-400 to-[#00F0FF] hover:from-cyan-400 hover:to-cyan-300 active:scale-[0.99] transition-all rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Transmitting Inquiry...</span>
                    ) : (
                      <>
                        <span>Submit Project Brief</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
