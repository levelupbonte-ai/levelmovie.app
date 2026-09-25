import React, { useState, useRef } from 'react';
import SEO from '../components/SEO';
import { Link } from '../components/Link';
import { recordConsent } from '../config/legal';

const BUSINESS_TYPES = [
  'Barbershop or Salon',
  'Med Spa or Clinic',
  'Restaurant, Cafe or Bar',
  'Creator or Personal Brand',
  'Fitness Studio, Gym or Coach',
  'Professional Services (Consulting, Law, Agency)',
  'E-commerce or Retail Brand',
  'Creative Portfolio or Photography',
  'Other Local Business',
];

export default function PreviewCustom() {
  const formRef = useRef<HTMLFormElement>(null);

  // Stepper state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Business Identity
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Barbershop or Salon');
  const [city, setCity] = useState('');

  // Step 2: Scope & Vision
  const [servicesOffered, setServicesOffered] = useState('');
  const [socialLink, setSocialLink] = useState('');
  const [preferredColors, setPreferredColors] = useState('');
  const [exampleSites, setExampleSites] = useState('');

  // Step 3: Contact & Delivery
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [requestId, setRequestId] = useState('');

  // Step navigation validations
  const validateStep1 = () => {
    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return false;
    }
    if (!businessName.trim()) {
      setErrorMessage('Please enter your business or project name.');
      return false;
    }
    if (!city.trim()) {
      setErrorMessage('Please enter your city.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const validateStep2 = () => {
    if (!servicesOffered.trim()) {
      setErrorMessage('Please describe the main services or products you offer.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const goToNextStep = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const goToPrevStep = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    if (currentStep === 3) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep !== 3) {
      goToNextStep();
      return;
    }

    // Spam honeypot detection
    if (honeypot) {
      setSubmitted(true);
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!consent) {
      setErrorMessage('Please accept the Terms of Service and Privacy Policy before submitting.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const submitTask = async () => {
      recordConsent('Custom Preview Request');
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
          <Link
            to="/preview"
            className="text-xs font-semibold text-[#A78BFA] hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            ← Back to preview options
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center sm:text-left space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/20 text-[#DDD6FE] text-xs font-semibold border border-[#7C3AED]/30">
            <span>Custom Engineering</span>
            <span className="text-white/20">•</span>
            <span>24 to 48 business hours</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Request your custom preview
          </h1>
          <p className="text-sm sm:text-base text-[#A1A1B5] leading-relaxed">
            Fill in the step-by-step brief below. I will personally analyze your business, build a dedicated preview, and send you a private link within 24 to 48 business hours.
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
              <Link
                to="/"
                className="py-3 px-6 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Back to homepage
              </Link>
              <Link
                to="/projects"
                className="py-3 px-6 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs font-semibold transition-all duration-200 cursor-pointer"
              >
                See recent projects
              </Link>
            </div>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="rounded-3xl bg-[#14141F] border border-white/[0.08] overflow-hidden shadow-xl"
          >
            {/* Step Header Navigation (Clean Studio Stepper) */}
            <div className="border-b border-white/[0.08] bg-[#0E0E18] px-6 py-4">
              <div className="flex items-center justify-between gap-2 max-w-xl mx-auto">
                {/* Step 1 Tab */}
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                    currentStep === 1
                      ? 'text-white'
                      : currentStep > 1
                      ? 'text-[#A78BFA] hover:text-white'
                      : 'text-[#71717A]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      currentStep === 1
                        ? 'bg-[#7C3AED] text-white'
                        : currentStep > 1
                        ? 'bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/40'
                        : 'bg-white/[0.05] text-[#71717A]'
                    }`}
                  >
                    {currentStep > 1 ? '✓' : '1'}
                  </span>
                  <span>Business</span>
                </button>

                <span className="text-white/10 text-xs select-none">———</span>

                {/* Step 2 Tab */}
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setCurrentStep(2);
                  }}
                  className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                    currentStep === 2
                      ? 'text-white'
                      : currentStep > 2
                      ? 'text-[#A78BFA] hover:text-white'
                      : 'text-[#71717A]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      currentStep === 2
                        ? 'bg-[#7C3AED] text-white'
                        : currentStep > 2
                        ? 'bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/40'
                        : 'bg-white/[0.05] text-[#71717A]'
                    }`}
                  >
                    {currentStep > 2 ? '✓' : '2'}
                  </span>
                  <span>Vision &amp; Style</span>
                </button>

                <span className="text-white/10 text-xs select-none">———</span>

                {/* Step 3 Tab */}
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1() && validateStep2()) setCurrentStep(3);
                  }}
                  className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                    currentStep === 3 ? 'text-white' : 'text-[#71717A]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      currentStep === 3
                        ? 'bg-[#7C3AED] text-white'
                        : 'bg-white/[0.05] text-[#71717A]'
                    }`}
                  >
                    3
                  </span>
                  <span>Delivery</span>
                </button>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 sm:p-10 space-y-6">
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
                  className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs sm:text-sm text-red-200"
                >
                  {errorMessage}
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* STEP 1: BUSINESS IDENTITY                                   */}
              {/* ----------------------------------------------------------- */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="border-b border-white/[0.06] pb-3">
                    <h2 className="text-base font-bold text-white">Step 1: Your Business Profile</h2>
                    <p className="text-xs text-[#A1A1B5] mt-0.5">
                      Tell us who this project is for and where you are located.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Alex Parker"
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
                        placeholder="e.g. Noir Hair Studio"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white">Industry Category *</label>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-[#7C3AED]"
                      >
                        {BUSINESS_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white">City &amp; State / Country *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. San Diego, CA or Paris, France"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={goToNextStep}
                      className="px-6 py-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md shadow-[#7C3AED]/25 cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <span>Continue to Scope &amp; Style</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* STEP 2: SCOPE & VISION                                      */}
              {/* ----------------------------------------------------------- */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="border-b border-white/[0.06] pb-3">
                    <h2 className="text-base font-bold text-white">Step 2: Key Services &amp; Aesthetic</h2>
                    <p className="text-xs text-[#A1A1B5] mt-0.5">
                      Define what your customers book or buy, and any design preferences you have.
                    </p>
                  </div>

                  {/* Services Offered */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white">Services or Products to Highlight *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="e.g. Premium Haircuts, Beard Shaping, VIP packages, 24/7 online booking, or store catalog..."
                      value={servicesOffered}
                      onChange={(e) => setServicesOffered(e.target.value)}
                      className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED]"
                    />
                  </div>

                  {/* Existing Link */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white">
                      Current Website, Instagram, or Google Maps (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="instagram.com/yourbrand or current URL"
                      value={socialLink}
                      onChange={(e) => setSocialLink(e.target.value)}
                      className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED]"
                    />
                  </div>

                  {/* Style & Colors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white">Preferred Style or Colors (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Dark & luxurious, clean white, emerald accents..."
                        value={preferredColors}
                        onChange={(e) => setPreferredColors(e.target.value)}
                        className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white">Inspirational Websites (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Apple, Stripe, or links to sites you love"
                        value={exampleSites}
                        onChange={(e) => setExampleSites(e.target.value)}
                        className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={goToPrevStep}
                      className="px-4 py-2 text-xs font-medium text-[#A1A1B5] hover:text-white transition-colors"
                    >
                      ← Back to Business
                    </button>

                    <button
                      type="button"
                      onClick={goToNextStep}
                      className="px-6 py-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md shadow-[#7C3AED]/25 cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <span>Continue to Delivery</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* STEP 3: CONTACT & DELIVERY                                  */}
              {/* ----------------------------------------------------------- */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="border-b border-white/[0.06] pb-3">
                    <h2 className="text-base font-bold text-white">Step 3: Private Link Delivery</h2>
                    <p className="text-xs text-[#A1A1B5] mt-0.5">
                      Where should we deliver your interactive 24–48h custom preview?
                    </p>
                  </div>

                  {/* Recap summary */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[#A1A1B5]">Preview for: </span>
                      <strong className="text-white">{businessName}</strong>
                      <span className="text-[#A1A1B5]"> ({businessType} · {city})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-[#A78BFA] hover:text-white underline text-[11px]"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white">Your Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="alex@yourbusiness.com"
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
                        , and I understand previews are custom AI-assisted drafts.
                      </span>
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={goToPrevStep}
                      className="px-4 py-2 text-xs font-medium text-[#A1A1B5] hover:text-white transition-colors"
                    >
                      ← Back to Scope
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting || !consent}
                      className="w-full sm:w-auto px-8 py-3 rounded-lg bg-[#7C3AED] hover:bg-[#8B5CF6] disabled:bg-[#7C3AED]/50 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-[#7C3AED]/25 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                        <span>Request Custom Preview (24–48h) →</span>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-[#71717A] text-center pt-2">
                    No payment required. Zero obligation. Delivered to your inbox within 24 to 48 business hours.
                  </p>
                </div>
              )}
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
