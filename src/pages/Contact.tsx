import React, { useState, useRef } from 'react';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import { Link } from '../components/Link';
import { recordConsent } from '../config/legal';

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [serviceType, setServiceType] = useState('Local Business Site');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
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
    if (!consent) {
      setErrorMessage('Please accept the Terms of Service and Privacy Policy before submitting.');
      setSubmitStatus('error');
      return;
    }
    if (!name.trim() || !email.trim()) {
      setErrorMessage('Please provide both your name and a valid email address.');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    const sendTask = async () => {
      // Record user clickwrap consent with server timestamp and version IDs
      recordConsent('Contact Form');

      await new Promise((resolve) => setTimeout(resolve, 850));

      const subject = encodeURIComponent(`Inquiry / Preview Request: ${businessName || name} (${serviceType})`);
      const body = encodeURIComponent(
        `Hi LevelUp Ecosystem,\n\nName: ${name}\nBusiness: ${businessName || 'N/A'}\nService: ${serviceType}\nEmail: ${email}\n\nProject details:\n${message}\n\nLooking forward to hearing from you!`
      );

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

      return true;
    };

    try {
      if (typeof window !== 'undefined' && window.LevelUpLoader && formRef.current) {
        await window.LevelUpLoader.wrap(sendTask, {
          container: formRef.current,
          delay: 300,
          minVisible: 500,
          slowAfter: 8000,
          failAfter: 20000,
          onRetry: () => handleSubmit(e),
        });
      } else {
        await sendTask();
      }
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
      setErrorMessage('Something went wrong sending your request. Please email directly at contact@levelup-ecosystem.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const professionalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'LevelUp Ecosystem',
    url: 'https://levelup-ecosystem.com/contact',
    areaServed: 'San Diego, CA',
    priceRange: '$$',
    email: 'contact@levelup-ecosystem.com',
    serviceType: [
      'Web Design',
      'Local Business Websites with Booking',
      'Creator & Influencer Websites',
      'Portfolio Website Design',
      'Small Online Store Setup',
      'Website Security Check',
      'Website Care Plans'
    ]
  };

  return (
    <div>
      <SEO
        title="Contact | LevelUp Ecosystem"
        description="Get in touch with LevelUp Ecosystem for web design, online booking setup, and website security checks. Based in San Diego, CA."
        canonical="/contact"
        breadcrumbs={[
          { name: 'Contact', url: '/contact' }
        ]}
        jsonLd={professionalServiceSchema}
      />

      <Breadcrumbs
        items={[
          { name: 'Contact', url: '/contact' }
        ]}
      />

      {/* Header */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto text-center space-y-4" data-reveal>
          <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
            Start Here
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Contact LevelUp Ecosystem
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1B5] max-w-2xl mx-auto leading-relaxed">
            Tell us about your business or project. We will assemble a functional, interactive mobile preview within 24 to 48 hours — with zero obligation to proceed.
          </p>
          <div className="pt-2">
            <a
              href="/preview"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#A78BFA] hover:text-white underline underline-offset-4 transition-colors"
            >
              Want an instant draft or tailored custom preview? Choose your preview option →
            </a>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0B14]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info & Commitments */}
          <div className="lg:col-span-5 space-y-8 text-left" data-reveal>
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
                Direct Contact
              </span>
              <h2 className="text-2xl font-bold text-white">
                Work directly with the builder
              </h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                We review every request personally. You will never be handed off to a salesperson or placed into a confusing support queue.
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
                  <span className="font-semibold text-white">Based in San Diego, CA</span>
                  <p className="text-xs text-[#A1A1B5]">Serving local businesses in San Diego and remote clients nationwide.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#7C3AED] font-bold text-base">⏱</span>
                <div>
                  <span className="font-semibold text-white">Rapid Response</span>
                  <p className="text-xs text-[#A1A1B5]">Inquiries answered within 24 business hours.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#7C3AED] font-bold text-base">🔒</span>
                <div>
                  <span className="font-semibold text-white">Privacy Protected</span>
                  <p className="text-xs text-[#A1A1B5]">Your contact information is never sold or shared.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7 bg-[#14141F] border border-white/[0.08] p-7 sm:p-10 rounded-3xl shadow-xl text-left" data-reveal>
            {submitStatus === 'success' ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-2xl text-[#A78BFA]">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Message Sent!
                </h3>
                <p className="text-sm text-[#A1A1B5] max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. We will review your message and reply with your design preview or information within 24 to 48 hours.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitStatus('idle');
                      setName('');
                      setBusinessName('');
                      setEmail('');
                      setMessage('');
                    }}
                    className="px-6 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-xs font-semibold text-white transition-all cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">
                    Request a free preview or get in touch
                  </h3>
                  <p className="text-xs text-[#A1A1B5]">
                    No obligation. We will discuss your goals and show you a working mobile prototype.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-white">
                      Your Name <span className="text-[#7C3AED]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 rounded-xl bg-[#0B0B14] border border-white/[0.08] text-white text-base sm:text-sm focus:outline-none focus:border-[#7C3AED] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-white">
                      Business or Project Name
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Apex Fitness & Barber"
                      className="w-full px-4 py-3 rounded-xl bg-[#0B0B14] border border-white/[0.08] text-white text-base sm:text-sm focus:outline-none focus:border-[#7C3AED] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-white">
                      Email Address <span className="text-[#7C3AED]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#0B0B14] border border-white/[0.08] text-white text-base sm:text-sm focus:outline-none focus:border-[#7C3AED] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-white">
                      Service Category
                    </label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0B0B14] border border-white/[0.08] text-white text-base sm:text-sm focus:outline-none focus:border-[#7C3AED] transition-colors cursor-pointer"
                    >
                      <option value="Local Business Site">Local Business Site (Booking & Maps)</option>
                      <option value="Creator & Influencer Site">Creator & Influencer Site (Media Kit)</option>
                      <option value="Portfolio Website">Portfolio Website</option>
                      <option value="Small Online Store">Small Online Store Setup</option>
                      <option value="Website Security Check">Website Security Check</option>
                      <option value="Monthly Care Plan">Monthly Website Care Plan</option>
                      <option value="Other / Question">Other / General Question</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-white">
                    Project Details or Current Website
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what services you offer, your current website link (if any), and what features you need (booking, media kit, store, security audit)..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0B14] border border-white/[0.08] text-white text-base sm:text-sm focus:outline-none focus:border-[#7C3AED] transition-colors resize-none"
                  />
                </div>

                <div className="pt-1">
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

                <button
                  type="submit"
                  disabled={isSubmitting || !consent}
                  className="w-full py-3.5 px-6 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all duration-200 shadow-md shadow-[#7C3AED]/25 cursor-pointer active:scale-98"
                >
                  {isSubmitting ? 'Submitting request...' : 'Send request for free preview'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
