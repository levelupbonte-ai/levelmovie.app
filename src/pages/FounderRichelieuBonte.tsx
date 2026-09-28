import React, { useState } from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import IDENTITY from '../config/identity';

export default function FounderRichelieuBonte() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(IDENTITY.contactEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const founderJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      mainEntity: {
        '@type': 'Person',
        '@id': 'https://levelup-ecosystem.com/about/richelieu-bonte#person',
        name: IDENTITY.personName,
        jobTitle: 'Founder',
        description: IDENTITY.personOneLiner,
        url: 'https://levelup-ecosystem.com/about/richelieu-bonte',
        worksFor: {
          '@id': 'https://levelup-ecosystem.com/#org',
        },
        knowsAbout: ['Web design', 'Cybersecurity', 'AI-assisted development'],
        ...(IDENTITY.sameAs && IDENTITY.sameAs.length > 0 ? { sameAs: IDENTITY.sameAs } : {}),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Who is Richelieu Bonte?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: IDENTITY.personOneLiner,
          },
        },
        {
          '@type': 'Question',
          name: 'Who founded LevelUp Ecosystem?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'LevelUp Ecosystem was founded by Richelieu Bonte, a cybersecurity student based in San Diego, California.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is LevelStudio?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'LevelStudio is LevelUp Ecosystem\'s instant creation and automated AI draft generator, allowing clients to test website concepts before human engineering.',
          },
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B14] text-white">
      <SEO
        title={`${IDENTITY.personName} — ${IDENTITY.personRole}`}
        description="Richelieu Bonte is the founder of LevelUp Ecosystem, a San Diego web design studio building secure, AI-assisted websites for businesses and creators."
        canonical="/about/richelieu-bonte"
        breadcrumbs={[
          { name: 'About', url: '/about' },
          { name: IDENTITY.personName, url: '/about/richelieu-bonte' },
        ]}
        jsonLd={founderJsonLd}
      />

      <Breadcrumbs
        items={[
          { name: 'About', url: '/about' },
          { name: IDENTITY.personName, url: '/about/richelieu-bonte' },
        ]}
      />

      {/* Hero Header */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14] relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#7C3AED]/12 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs font-mono font-semibold uppercase tracking-wider text-[#A78BFA]">
            <span>Founder &amp; Principal Engineer</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              {IDENTITY.personName}
            </h1>
            <p className="text-lg sm:text-xl font-medium text-[#A78BFA]">
              {IDENTITY.personRole}
            </p>
          </div>

          <p className="text-base sm:text-lg text-[#A1A1B5] max-w-2xl leading-relaxed">
            {IDENTITY.personOneLiner}
          </p>
        </div>
      </section>

      {/* Main Biography & Details */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0B14]">
        <div className="max-w-3xl mx-auto space-y-14 text-left">
          
          {/* Biography: strictly 150-250 words based only on approved background */}
          <div className="space-y-6" data-reveal>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A78BFA]">
              Background &amp; Profile
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              About Richelieu Bonte
            </h2>

            <div className="space-y-4 text-base text-[#D4D4E0] leading-relaxed">
              <p>
                Richelieu Bonte is the founder of LevelUp Ecosystem, an independent web design and development studio based in San Diego, California. Originally from the Democratic Republic of Congo, he currently lives in California, where he is pursuing his degree as a first-year cybersecurity student.
              </p>
              <p>
                Richelieu Bonte developed his engineering expertise by building hands-on systems with modern AI tools. His earlier software ventures and technical explorations included Bonté IA and LevelUp IA, experiments focused on exploring automated assistance and modern development velocity. What began as dedicated practical coding quickly expanded into LevelUp Ecosystem—a full-service studio engineered to solve the real challenges faced by local service businesses and independent creators.
              </p>
              <p>
                Today, Richelieu Bonte directs architecture, security evaluations, and human code auditing for all studio projects. To deliver robust, bespoke websites with 24/7 automated booking and zero bloat, he collaborates with technical contributors and design specialists across several countries, maintaining rigorous security practices from discovery through launch.
              </p>
            </div>
          </div>

          {/* Section: What I work on */}
          <div className="space-y-6 pt-10 border-t border-white/[0.08]" data-reveal>
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A78BFA]">
                Focus Areas
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                What I work on
              </h2>
              <p className="text-sm text-[#A1A1B5]">
                Core engineering and services delivered through LevelUp Ecosystem.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Link
                to="/services"
                className="p-6 rounded-2xl bg-[#14141F] border border-white/[0.08] hover:border-[#7C3AED]/50 transition-all space-y-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-[#A78BFA] font-bold text-sm">
                  01
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-[#A78BFA] transition-colors">
                  Web Services
                </h3>
                <p className="text-xs text-[#A1A1B5] leading-relaxed">
                  Fast, mobile-optimized websites with online booking for barbershops, salons, gyms, and creators.
                </p>
                <div className="text-xs text-[#7C3AED] font-semibold pt-1">
                  Explore services →
                </div>
              </Link>

              <Link
                to="/preview/instant"
                className="p-6 rounded-2xl bg-[#14141F] border border-white/[0.08] hover:border-[#7C3AED]/50 transition-all space-y-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-[#A78BFA] font-bold text-sm">
                  02
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-[#A78BFA] transition-colors">
                  {IDENTITY.studioName}
                </h3>
                <p className="text-xs text-[#A1A1B5] leading-relaxed">
                  Instant AI draft generator allowing business owners to test interactive concepts before handoff.
                </p>
                <div className="text-xs text-[#7C3AED] font-semibold pt-1">
                  Launch {IDENTITY.studioName} →
                </div>
              </Link>

              <Link
                to="/services/security-check"
                className="p-6 rounded-2xl bg-[#14141F] border border-white/[0.08] hover:border-[#7C3AED]/50 transition-all space-y-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-[#A78BFA] font-bold text-sm">
                  03
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-[#A78BFA] transition-colors">
                  Security Check
                </h3>
                <p className="text-xs text-[#A1A1B5] leading-relaxed">
                  Plain-English website vulnerability assessments: HTTPS, database rules, headers, and secret leakage.
                </p>
                <div className="text-xs text-[#7C3AED] font-semibold pt-1">
                  Request security check →
                </div>
              </Link>
            </div>
          </div>

          {/* Section: How I build */}
          <div className="space-y-6 pt-10 border-t border-white/[0.08]" data-reveal>
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A78BFA]">
                Philosophy &amp; Method
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                How I build
              </h2>
            </div>

            <p className="text-base text-[#D4D4E0] leading-relaxed">
              Every client project at LevelUp Ecosystem is AI-assisted, human-directed, and security-verified. AI tools accelerate initial layout prototyping and component scaffolding, while every line of shipped production code, calendar synchronization logic, and database access rule is reviewed, verified, and secured by hand.
            </p>

            <div>
              <Link
                to="/process"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#14141F] hover:bg-[#1E1E2E] text-white border border-white/[0.12] text-sm font-semibold transition-all hover:border-[#7C3AED]/50"
              >
                <span>Read the 4-step build process</span>
                <span className="text-[#A78BFA]">→</span>
              </Link>
            </div>
          </div>

          {/* Section: Contact */}
          <div className="space-y-6 pt-10 border-t border-white/[0.08]" data-reveal>
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A78BFA]">
                Direct Inquiries
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Contact
              </h2>
              <p className="text-sm text-[#A1A1B5]">
                Direct all business, project, and security audit inquiries through our official studio channel.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#14141F] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-[#A78BFA] uppercase">Business Email</div>
                <a
                  href={`mailto:${IDENTITY.contactEmail}`}
                  className="text-lg font-bold text-white hover:text-[#A78BFA] transition-colors"
                >
                  {IDENTITY.contactEmail}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-white border border-white/[0.1] transition-all cursor-pointer"
                >
                  {copiedEmail ? 'Copied to clipboard!' : 'Copy email'}
                </button>
                <Link
                  to="/contact"
                  className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#8B5CF6] text-xs font-semibold text-white transition-all"
                >
                  Contact Form
                </Link>
              </div>
            </div>
          </div>

          {/* Section: Elsewhere */}
          <div className="space-y-6 pt-10 border-t border-white/[0.08]" data-reveal>
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A78BFA]">
                Verified Profiles
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Elsewhere
              </h2>
              <p className="text-sm text-[#A1A1B5]">
                Public and professional accounts verified by Richelieu Bonte.
              </p>
            </div>

            {IDENTITY.sameAs && IDENTITY.sameAs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {IDENTITY.sameAs.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    rel="me noopener"
                    target="_blank"
                    className="p-4 rounded-xl bg-[#14141F] border border-white/[0.08] hover:border-[#7C3AED]/40 text-sm text-[#D4D4E0] hover:text-white transition-all flex items-center justify-between"
                  >
                    <span className="font-mono text-xs truncate">{url}</span>
                    <span className="text-[#A78BFA] text-xs font-bold shrink-0 ml-2">Visit ↗</span>
                  </a>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[#14141F] border border-white/[0.08] text-sm text-[#A1A1B5] space-y-2">
                <p>
                  Official external profiles (LinkedIn, GitHub, Instagram, Google Business Profile) will be listed here once verified with bilateral back-links.
                </p>
                <p className="text-xs font-mono text-[#71717A]">
                  Note: Real profiles are linked strictly with rel=&quot;me noopener&quot; upon manual confirmation.
                </p>
              </div>
            )}
          </div>

          {/* Back to About link */}
          <div className="pt-6 border-t border-white/[0.08]">
            <Link
              to="/about"
              className="text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <span>← Back to About LevelUp Ecosystem</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
