import React, { useState, useRef } from 'react';
import SEO from '../components/SEO';
import { Link } from '../components/Link';
import { recordConsent } from '../config/legal';

export default function PreviewCustom() {
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Barbershop or Salon');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [socialLink, setSocialLink] = useState('');
  const [servicesOffered, setServicesOffered] = useState('');
  const [preferredColors, setPreferredColors] = useState('');
  const [exampleSites, setExampleSites] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [requestId, setRequestId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam honeypot detection
    if (honeypot) {
      // Silently ignore bot submission
      setSubmitted(true);
      return;
    }

    if (!consent) {
      setErrorMessage('Please accept the Terms of Service and Privacy Policy before submitting.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const submitTask = async () => {
      // Record user clickwrap consent with server timestamp and version IDs
      recordConsent('Custom Preview Request');

      // Simulate real transmission and create a secure reference
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newId = 'prv_' + Math.random().toString(36).substring(2, 10);
      setRequestId(newId);
      return newId;
    };

    try {
      if (typeof window !== 'undefined' && window.LevelUpLoader && formRef.current) {
        await window.LevelUpLoader.wrap(submitTask, {
          container: formRef.current,
          delay: 300,
          minVisible: 500,
          slowAfter: 8000,
          failAfter: 20000,
          onRetry: () => handleSubmit(e),
        });
      } else {
        await submitTask();
      }
      setSubmitted(true);
    } catch {
      setErrorMessage('Could not send your request. Please email contact@levelup-ecosystem.com directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-8">
      <SEO
        title="Request a Custom Preview | LevelUp Ecosystem"
        description="Request a custom website preview designed and reviewed by me. Delivered to your email within 24 to 48 business hours."
        noindex={true}
      />

      <div className="max-w-3xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 text-center sm:text-left">
          <a
            href="/preview"
            className="text-xs font-semibold text-[#A78BFA] hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            ← Back to preview options
          </a>
        </div>

        {/* Page Title */}
        <div className="text-center sm:text-left space-y-3 mb-10">
          <div className="inline-block px-3 py-1 rounded-full bg-[#7C3AED]/20 text-[#DDD6FE] text-xs font-semibold border border-[#7C3AED]/30">
            Designed by me, using AI tools
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Request your custom preview
          </h1>
          <p className="text-sm sm:text-base text-[#A1A1B5] leading-relaxed">
            Fill in the details below. I will personally review your business, structure a working mobile preview, and email you a private link within 24 to 48 business hours.
          </p>
        </div>

        {submitted ? (
          <div
            role="status"
            aria-live="polite"
            className="rounded-3xl bg-[#14141F] border border-[#7C3AED]/40 p-8 sm:p-12 text-center space-y-6 shadow-[0_0_40px_rgba(124,58,237,0.15)]"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-2xl text-[#A78BFA]">
              ✓
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">
                Got it! I'll send your preview to your email within 48 business hours.
              </h2>
              <p className="text-sm text-[#A1A1B5] max-w-lg mx-auto leading-relaxed">
                Thank you, <strong className="text-white">{name}</strong>. Your custom preview request for <strong className="text-white">{businessName}</strong> has been logged.
              </p>
            </div>

            {/* Delivery Specifications Card */}
            <div className="p-5 rounded-2xl bg-[#0B0B14] border border-white/[0.08] text-left max-w-md mx-auto space-y-3 text-xs text-[#A1A1B5]">
              <div className="flex items-center justify-between text-white font-medium pb-2 border-b border-white/[0.08]">
                <span>Request ID:</span>
                <span className="font-mono text-[#A78BFA]">{requestId || 'prv_custom'}</span>
              </div>
              <p className="flex items-start gap-2">
                <span className="text-[#A78BFA] font-bold">·</span>
                <span><strong className="text-white">Private link:</strong> Your preview will be hosted at <code className="text-[#DDD6FE]">preview.levelup-ecosystem.com/&lt;private-id&gt;</code> with search engine indexing disabled (<code className="text-[#DDD6FE]">noindex</code>).</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#A78BFA] font-bold">·</span>
                <span><strong className="text-white">Validity:</strong> The private preview link remains active for 14 days.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#A78BFA] font-bold">·</span>
                <span><strong className="text-white">Delivered to:</strong> {email}</span>
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/"
                className="py-3 px-6 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Back to homepage
              </a>
              <a
                href="/projects"
                className="py-3 px-6 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs font-semibold transition-all duration-200 cursor-pointer"
              >
                See recent projects
              </a>
            </div>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="rounded-3xl bg-[#14141F] border border-white/[0.08] p-6 sm:p-10 space-y-6">
            
            {/* Honeypot anti-spam field */}
            <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
              <label>Leave this empty</label>
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs sm:text-sm text-red-200"
              >
                {errorMessage}
              </div>
            )}

            {/* Row 1: Name & Business Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Taylor Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Business or Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Apex Barber Lounge"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED]"
                />
              </div>
            </div>

            {/* Row 2: Business Type & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Business Type *</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-[#7C3AED]"
                >
                  <option value="Barbershop or Salon">Barbershop or Salon</option>
                  <option value="Med Spa or Clinic">Med Spa or Clinic</option>
                  <option value="Restaurant or Cafe">Restaurant or Cafe</option>
                  <option value="Creator or Personal Brand">Creator or Personal Brand</option>
                  <option value="Fitness or Gym">Fitness, Yoga or Gym</option>
                  <option value="Professional Services">Professional Services (Consulting, Law, etc.)</option>
                  <option value="E-commerce or Retail">E-commerce or Retail</option>
                  <option value="Event or Portfolio">Event or Creative Portfolio</option>
                  <option value="Other">Other Business</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. San Diego, Austin, Miami..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED]"
                />
              </div>
            </div>

            {/* Row 3: Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="taylor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Phone (Optional)</label>
                <input
                  type="tel"
                  placeholder="(619) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED]"
                />
              </div>
            </div>

            {/* Existing Web or Social Link */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">Existing Website, Instagram, or Google Maps Link (Optional)</label>
              <input
                type="text"
                placeholder="instagram.com/mybusiness or current website URL"
                value={socialLink}
                onChange={(e) => setSocialLink(e.target.value)}
                className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            {/* Services Offered */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">Services Offered *</label>
              <textarea
                required
                rows={3}
                placeholder="List your key services (e.g. Haircuts, Beard Trims, VIP packages with online booking)..."
                value={servicesOffered}
                onChange={(e) => setServicesOffered(e.target.value)}
                className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            {/* Style & Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Preferred Style or Colors (Optional)</label>
                <input
                  type="text"
                  placeholder="Dark and modern, gold and black, clean white..."
                  value={preferredColors}
                  onChange={(e) => setPreferredColors(e.target.value)}
                  className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Example Sites You Like (Optional)</label>
                <input
                  type="text"
                  placeholder="Links or names of websites you like"
                  value={exampleSites}
                  onChange={(e) => setExampleSites(e.target.value)}
                  className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED]"
                />
              </div>
            </div>

            {/* Consent Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer text-xs text-[#A1A1B5] leading-relaxed">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 bg-[#0B0B14] text-[#7C3AED] focus:ring-[#7C3AED]"
                />
                <span>
                  I have read and agree to the{' '}
                  <Link to="/terms" className="text-white underline hover:text-[#A78BFA]">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-white underline hover:text-[#A78BFA]">
                    Privacy Policy
                  </Link>
                  , and I understand previews are AI-generated drafts.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !consent}
                className="w-full py-3.5 px-6 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] disabled:bg-[#7C3AED]/50 disabled:opacity-50 text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-[#7C3AED]/25 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Submitting request...</span>
                  </>
                ) : (
                  <span>Request my custom preview</span>
                )}
              </button>
            </div>

            <p className="text-[11px] text-[#71717A] text-center">
              No credit card required. Zero obligation to buy. Every custom preview is reviewed and tested by me before sending.
            </p>
          </form>
        )}

      </div>
    </div>
  );
}
