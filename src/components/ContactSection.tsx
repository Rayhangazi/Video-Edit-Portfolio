import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectCategory, InquiryFormData } from '../types/portfolio';
import { Send, CheckCircle2, Mail, Copy, Check, Clock, ArrowRight } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { settings } = usePortfolio();

  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    category: 'commercial',
    budget: '৳15,000 – ৳35,000',
    timeline: 'Within 1-2 weeks',
    projectBrief: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(settings.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.projectBrief.trim()) {
      setErrorMessage('Please fill in your name, email, and project details.');
      return;
    }

    // Basic email pattern check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);

    // Simulate submission delay and open mailto backup
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Create mailto link for direct client transmission
      const subject = encodeURIComponent(`Project Inquiry: ${formData.category.toUpperCase()} - ${formData.name}`);
      const body = encodeURIComponent(
        `Hi Rayhan,\n\nName: ${formData.name}\nEmail: ${formData.email}\nFormat: ${formData.category}\nBudget: ${formData.budget}\nTimeline: ${formData.timeline}\n\nProject Brief & Footage Links:\n${formData.projectBrief}\n\nBest regards,\n${formData.name}`
      );
      
      // Provide direct mail fallback
      const mailtoUrl = `mailto:${settings.email}?subject=${subject}&body=${body}`;
      window.location.href = mailtoUrl;
    }, 600);
  };

  return (
    <section id="contact" className="py-24 border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct Communication Info */}
          <div className="lg:col-span-5">
            <div className="text-xs uppercase tracking-widest text-[#E5A93C] font-semibold mb-2">
              Dhaka, Bangladesh · Available Worldwide
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-6">
              Let’s build something extraordinary.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
              Based in Dhaka, Bangladesh. Available for commercial ad campaigns, long-form YouTube retainers, and high-volume short-form content. Typical turnaround time is 48 hours for first rough cuts.
            </p>

            {/* Direct Email Card */}
            <div className="p-6 rounded-2xl bg-[#0F121C] border border-white/[0.08] space-y-4">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-mono">
                Direct Inquiries
              </div>
              <div className="flex items-center justify-between gap-4">
                <a
                  href={`mailto:${settings.email}`}
                  className="font-medium text-white hover:text-[#E5A93C] transition-colors truncate text-sm sm:text-base"
                >
                  {settings.email}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-colors shrink-0"
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

              <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span>Response time: Within 12 hours</span>
              </div>
            </div>

            {/* Workflow Guarantees */}
            <div className="mt-8 space-y-3">
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                <span>Lossless 4K Master Exports (ProRes 422 / H.265)</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                <span>Frame.io / Google Drive review links with timestamp feedback</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                <span>Two rounds of revisions included with every delivery</span>
              </div>
            </div>

          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-[#0F121C] border border-white/[0.08] shadow-xl">
              
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">
                    Inquiry Transmitted
                  </h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                    Thank you, {formData.name}. Rayhan will review your brief and respond to <span className="text-white font-medium">{formData.email}</span> within 12 hours.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        category: 'commercial',
                        budget: '$1K - $3K',
                        timeline: 'Within 1-2 weeks',
                        projectBrief: ''
                      });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-lg text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {errorMessage && (
                    <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                      {errorMessage}
                    </div>
                  )}

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
                        className="w-full px-4 py-3 rounded-lg bg-[#090A0F] border border-white/[0.1] text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#E5A93C] transition-colors"
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
                        className="w-full px-4 py-3 rounded-lg bg-[#090A0F] border border-white/[0.1] text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#E5A93C] transition-colors"
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
                        className="w-full px-4 py-3 rounded-lg bg-[#090A0F] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#E5A93C] transition-colors"
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
                        className="w-full px-4 py-3 rounded-lg bg-[#090A0F] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#E5A93C] transition-colors"
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
                      className="w-full px-4 py-3 rounded-lg bg-[#090A0F] border border-white/[0.1] text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#E5A93C] transition-colors"
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
                      className="w-full px-4 py-3 rounded-lg bg-[#090A0F] border border-white/[0.1] text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#E5A93C] transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 text-xs font-bold uppercase tracking-wider text-black bg-[#E5A93C] hover:bg-[#f3b544] active:scale-[0.99] transition-all rounded-lg flex items-center justify-center gap-2 shadow-md shadow-[#E5A93C]/10 disabled:opacity-50"
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
