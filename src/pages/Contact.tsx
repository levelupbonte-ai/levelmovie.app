import React, { useState } from 'react';
import SEO from '../components/SEO';

export default function Contact() {
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [serviceType, setServiceType] = useState('Local Business Site');
  const [message, setMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText('contact@levelup-ecosystem.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct mailto link with details
    const subject = encodeURIComponent(`Free Preview Request: ${businessName || name} (${serviceType})`);
    const body = encodeURIComponent(
      `Hi LevelUp Ecosystem,\n\nMy name is ${name} from ${businessName || 'my business'}.\nService interested in: ${serviceType}\nMy contact email: ${email}\n\nProject details / notes:\n${message}\n\nLooking forward to the preview!`
    );

    window.location.href = `mailto:contact@levelup-ecosystem.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div>
      <SEO
        title="Get a Free Preview | Contact"
        description="Request a free, no-obligation mobile website preview from LevelUp Ecosystem. Delivered within 24 to 48 hours for San Diego businesses and creators."
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
                  <strong className="text-white">Serving San Diego, CA</strong>
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

            {submitted ? (
              <div className="p-6 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/30 space-y-3 text-center">
                <div className="text-2xl">✨</div>
                <h4 className="text-lg font-bold text-white">Email draft generated!</h4>
                <p className="text-xs sm:text-sm text-[#A1A1B5]">
                  If your mail application did not open automatically, you can send an email directly to <span className="text-white font-medium">contact@levelup-ecosystem.com</span>. I will respond within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs text-[#A78BFA] hover:text-white underline cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Business or Project Name</label>
                    <input
                      type="text"
                      placeholder="Crown & Fade Barber Lounge"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED]"
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
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Service Category</label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7C3AED]"
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
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#0B0B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm transition-all duration-200 shadow-md shadow-[#7C3AED]/25 cursor-pointer text-center"
                >
                  Send Free Preview Request →
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
