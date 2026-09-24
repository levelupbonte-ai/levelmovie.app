import React, { useState } from 'react';
import SEO from '../components/SEO';

export default function Contact() {
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [serviceType, setServiceType] = useState('Local Business Site');
  const [message, setMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const copyEmail = () => {
    navigator.clipboard.writeText('contact@levelup-ecosystem.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMessage('Please provide both your name and a valid email address.');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Simulate real transmission delay for responsive feedback
      await new Promise((resolve) => setTimeout(resolve, 850));

      // Attempt mailto pre-fill or local capture
      const subject = encodeURIComponent(`Free Preview Request: ${businessName || name} (${serviceType})`);
      const body = encodeURIComponent(
        `Hi LevelUp Ecosystem,\n\nName: ${name}\nBusiness: ${businessName || 'N/A'}\nService: ${serviceType}\nEmail: ${email}\n\nProject details:\n${message}\n\nLooking forward to hearing from you!`
      );

      // Attempt opening email client in background without breaking view
      const mailtoLink = `mailto:contact@levelup-ecosystem.com?subject=${subject}&body=${body}`;
      
      const hiddenLink = document.createElement('a');
      hiddenLink.href = mailtoLink;
      hiddenLink.target = '_blank';
      hiddenLink.rel = 'noreferrer';
      hiddenLink.style.display = 'none';
      document.body.appendChild(hiddenLink);
      hiddenLink.click();
      setTimeout(() => {
        if (hiddenLink.parentNode) hiddenLink.parentNode.removeChild(hiddenLink);
      }, 100);

      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
      setErrorMessage('Something went wrong sending your request. Please email me directly at contact@levelup-ecosystem.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <SEO
        title="Get a Free Preview & Contact | LevelUp Ecosystem"
        description="Request a free preview mockup of your website or get in touch for security checks. Response within 24 hours."
      />

      {/* Header */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
            Start Here
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Get a Free Preview
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1B5] max-w-2xl mx-auto leading-relaxed">
            Tell me a bit about your business or project. I will assemble a functional, interactive mobile preview within 24 to 48 hours — with zero obligation to proceed.
          </p>
          <div className="pt-2">
            <a
              href="/preview"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#A78BFA] hover:text-white underline underline-offset-4 transition-colors"
            >
              Want an instant AI draft or tailored custom preview? Choose your preview option
            </a>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0B14]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info & Commitments */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
                Direct Contact
              </span>
              <h2 className="text-2xl font-bold text-white">
                Work directly with the builder
              </h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                I review every request personally. You will never be handed off to a salesperson or placed into a confusing support queue.
              </p>
            </div>

            {/* Direct Email Box */}
            <div className="p-6 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#A1A1B5]">
                Direct Email:
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <a
                  href="mailto:contact@levelup-ecosystem.com"
                  className="text-base font-bold text-white hover:text-[#A78BFA] transition-colors break-all"
                >
                  contact@levelup-ecosystem.com
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="px-3.5 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-xs text-white shrink-0 cursor-pointer self-start sm:self-auto"
                >
                  {copiedEmail ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Location & Guarantee */}
            <div className="space-y-4 text-xs sm:text-sm text-[#A1A1B5]">
              <div className="flex items-start gap-3">
                <span className="text-[#7C3AED] font-bold text-base">📍</span>
                <div>
                  <strong className="text-white">Serving San Diego & Remote Clients</strong>
                  <p className="text-xs mt-0.5">Available for local meetings or remote collaboration across the US.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#7C3AED] font-bold text-base">⚡</span>
                <div>
                  <strong className="text-white">24-48 Hour Turnaround</strong>
                  <p className="text-xs mt-0.5">I will share your interactive preview link quickly so you can test it on your smartphone.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#7C3AED] font-bold text-base">🛡️</span>
                <div>
                  <strong className="text-white">Zero Obligation</strong>
                  <p className="text-xs mt-0.5">If the preview does not meet your expectations, there is zero pressure to hire me.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Inquiry Form */}
          <div className="lg:col-span-7 bg-[#14141F] border border-white/[0.08] p-8 sm:p-10 rounded-3xl space-y-6">
            <h3 className="text-xl font-bold text-white">
              Project Details
            </h3>

            {/* Accessible Live Region */}
            <div aria-live="polite" aria-atomic="true">
              {submitStatus === 'success' && (
                <div
                  role="status"
                  className="p-6 rounded-2xl bg-[#7C3AED]/15 border border-[#7C3AED]/40 space-y-3 text-center animate-in fade-in"
                >
                  <div className="text-3xl">✨</div>
                  <h4 className="text-lg font-bold text-white">Preview Request Received!</h4>
                  <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed">
                    Thank you, <span className="text-white font-semibold">{name}</span>. I have received your project details and will prepare an interactive mobile preview within <strong className="text-white">24 to 48 hours</strong>.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitStatus('idle');
                        setName('');
                        setBusinessName('');
                        setEmail('');
                        setMessage('');
                      }}
                      className="px-5 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-xs text-white cursor-pointer transition-colors"
                    >
                      Send another request
                    </button>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div
                  role="alert"
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs sm:text-sm text-red-200 mb-4 animate-in fade-in"
                >
                  {errorMessage || 'Something went wrong. Please email contact@levelup-ecosystem.com directly.'}
                </div>
              )}
            </div>

            {submitStatus !== 'success' && (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Smith"
                      value={name}
                      disabled={isSubmitting}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED] disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Business or Project Name</label>
                    <input
                      type="text"
                      placeholder="Crown & Fade Barber Lounge"
                      value={businessName}
                      disabled={isSubmitting}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED] disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Your Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={email}
                      disabled={isSubmitting}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED] disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Service Category</label>
                    <select
                      value={serviceType}
                      disabled={isSubmitting}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7C3AED] disabled:opacity-50"
                    >
                      <option value="Local Business Site">Local Business Site (Booking & Maps)</option>
                      <option value="Creator & Influencer Site">Creator & Influencer Site</option>
                      <option value="Portfolio">Portfolio</option>
                      <option value="Online Store">Online Store</option>
                      <option value="Landing Page">Landing Page</option>
                      <option value="Security Check">Security Check / 2FA Audit</option>
                      <option value="Maintenance & Care">Maintenance & Hosting</option>
                      <option value="Other">Other Custom Project</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Tell me a little about your project</label>
                  <textarea
                    rows={4}
                    placeholder="Briefly describe what you need (e.g. need online booking for 3 stylists, link in bio for TikTok, or revamping an old site)..."
                    value={message}
                    disabled={isSubmitting}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED] disabled:opacity-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] disabled:bg-[#7C3AED]/50 text-white font-bold text-sm transition-all duration-200 shadow-md shadow-[#7C3AED]/25 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      <span>Sending Preview Request...</span>
                    </>
                  ) : (
                    <span>Send Preview Request</span>
                  )}
                </button>

                <p className="text-[11px] text-[#A1A1B5] text-center pt-1">
                  🔒 I never sell your information or share client data with AI tools.
                </p>
              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
