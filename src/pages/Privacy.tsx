import React, { useState, useEffect, useRef } from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

interface Section {
  id: string;
  num: number;
  title: string;
}

const SECTIONS: Section[] = [
  { id: 'section-1', num: 1, title: 'Information We Collect' },
  { id: 'section-2', num: 2, title: 'How We Use Information' },
  { id: 'section-3', num: 3, title: 'AI Features and How Your Information Is Processed' },
  { id: 'section-4', num: 4, title: 'How We Share Information' },
  { id: 'section-5', num: 5, title: 'Cookies, Local Storage and Similar Technologies' },
  { id: 'section-6', num: 6, title: 'How Long We Keep Information' },
  { id: 'section-7', num: 7, title: 'Security' },
  { id: 'section-8', num: 8, title: 'Your Choices and Rights' },
  { id: 'section-9', num: 9, title: 'California Privacy Information' },
  { id: 'section-10', num: 10, title: "Children's Privacy" },
  { id: 'section-11', num: 11, title: 'Third-Party Websites and Services' },
  { id: 'section-12', num: 12, title: 'International Visitors' },
  { id: 'section-13', num: 13, title: 'Data About Other People' },
  { id: 'section-14', num: 14, title: 'Changes to This Privacy Policy' },
  { id: 'section-15', num: 15, title: 'Contact' },
];

export default function Privacy() {
  const [activeSection, setActiveSection] = useState<string>('section-1');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [mobileTocOpen, setMobileTocOpen] = useState<boolean>(false);
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (articleRef.current) {
        const rect = articleRef.current.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;

        const currentScroll = window.scrollY - elementTop;
        const maxScroll = elementHeight - windowHeight;

        if (currentScroll <= 0) {
          setReadingProgress(0);
        } else if (currentScroll >= maxScroll) {
          setReadingProgress(100);
        } else {
          setReadingProgress(Math.round((currentScroll / maxScroll) * 100));
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const headings = SECTIONS.map((sec) => document.getElementById(sec.id)).filter(Boolean) as HTMLElement[];

    if (!headings.length || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -65% 0px',
        threshold: 0,
      }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  const handleCopyLink = (sectionId: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
    navigator.clipboard.writeText(url);
    setCopiedSection(sectionId);
    setTimeout(() => {
      setCopiedSection(null);
    }, 2000);
  };

  return (
    <div className="bg-[#0B0B14] min-h-screen relative text-[#D4D4E0]">
      <SEO
        title="Privacy Policy | LevelUp Ecosystem"
        description="Privacy Policy for LevelUp Ecosystem. How we handle client contact information, security, and data protection."
        canonical="/privacy"
        breadcrumbs={[{ name: 'Privacy Policy', url: '/privacy' }]}
      />

      {/* Accessible Skip Link */}
      <a
        href="#privacy-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[99999] px-4 py-2 bg-[#7C3AED] text-white rounded-lg font-medium shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to Privacy Policy content
      </a>

      {/* Reading Progress Bar */}
      <div
        id="reading-progress-bar"
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA] z-[9999] transition-all duration-150 ease-out no-print"
        style={{ width: `${readingProgress}%` }}
        aria-hidden="true"
      />

      {/* Hero Header Section */}
      <section className="pt-12 pb-10 sm:pt-16 sm:pb-14 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto text-left sm:text-center space-y-4" data-reveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] text-[#A78BFA] text-xs font-semibold uppercase tracking-wider">
            <span>Legal Documentation</span>
            <span className="text-[#71717A]">•</span>
            <span>Version 1.0</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>

          <div className="flex flex-wrap items-center justify-start sm:justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-[#A1A1B5]">
            <p>
              <strong className="text-white">Effective date:</strong> [Month DD, YYYY]
            </p>
            <span className="hidden sm:inline text-white/20">•</span>
            <p>
              <strong className="text-white">Last updated:</strong> [Month DD, YYYY]
            </p>
            <span className="hidden sm:inline text-white/20">•</span>
            <p>
              <strong className="text-white">Version:</strong> 1.0
            </p>
          </div>
        </div>
      </section>

      {/* Main Container: 2-Column Desktop Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <Breadcrumbs items={[{ name: 'Privacy Policy', url: '/privacy' }]} />

        {/* Mobile Collapsible TOC */}
        <div className="lg:hidden mb-8 no-print">
          <div className="rounded-2xl bg-[#14141F] border border-white/[0.08] p-4">
            <button
              type="button"
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              className="w-full flex items-center justify-between text-left text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded-lg py-1 cursor-pointer"
              aria-expanded={mobileTocOpen}
              aria-controls="mobile-privacy-toc-list"
            >
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                On this page (15 sections)
              </span>
              <span className="text-xs text-[#A1A1B5]">
                {mobileTocOpen ? 'Hide ▲' : 'Show ▼'}
              </span>
            </button>

            {mobileTocOpen && (
              <nav id="mobile-privacy-toc-list" className="mt-4 pt-3 border-t border-white/[0.08] space-y-1.5 text-xs max-h-80 overflow-y-auto">
                {SECTIONS.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setMobileTocOpen(false)}
                    className={`block py-1.5 px-2.5 rounded-lg transition-colors ${
                      activeSection === sec.id
                        ? 'bg-[#7C3AED]/20 text-[#A78BFA] font-medium'
                        : 'text-[#A1A1B5] hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {sec.num}. {sec.title}
                  </a>
                ))}
              </nav>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Desktop Sticky Table of Contents (Left Column) */}
          <aside
            className="hidden lg:block lg:col-span-4 sticky top-28 max-h-[calc(100vh-140px)] overflow-y-auto pr-4 sticky-toc no-print"
            aria-label="Table of Contents"
          >
            <div className="p-5 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#A78BFA] flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <span>Table of Contents</span>
              </div>
              <p className="text-[11px] text-[#71717A]">
                Click any section to jump directly to it.
              </p>

              <nav className="space-y-1 pt-2">
                {SECTIONS.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className={`block text-xs py-1.5 px-3 rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] ${
                        isActive
                          ? 'bg-[#7C3AED]/20 text-[#A78BFA] font-semibold border-l-2 border-[#7C3AED]'
                          : 'text-[#A1A1B5] hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      {sec.num}. {sec.title}
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Reading Column: Single Column, max-w-[720px], body 17-18px, line-height 1.7 */}
          <main
            id="privacy-content"
            ref={articleRef}
            className="lg:col-span-8 max-w-[720px] mx-auto lg:mx-0 text-[17px] sm:text-[18px] leading-[1.7] text-[#D4D4E0] space-y-10 sm:space-y-14 print-clean"
          >
            {/* Preamble */}
            <div className="space-y-6 pb-6 border-b border-white/[0.08]">
              <p>
                <strong>LevelUp Ecosystem</strong>
                <br />
                Effective date: [Month DD, YYYY]
                <br />
                Last updated: [Month DD, YYYY]
                <br />
                Version: 1.0
              </p>

              <p>
                This Privacy Policy explains what personal information LevelUp Ecosystem (&quot;LevelUp,&quot; &quot;we,&quot; &quot;us&quot; or &quot;our&quot;) collects when you use our website at [levelup-ecosystem.com], including the Studio, the Instant Preview, the Custom Preview, our forms and any related tools (together, the &quot;Site&quot;), how we use and share it, and the choices you have. It is part of our Terms of Service.
              </p>

              <p>
                The Site is operated by [Your Full Legal Name], doing business as LevelUp Ecosystem, based in San Diego, California.
              </p>

              <p>
                By using the Site, you acknowledge the practices described in this Privacy Policy. If you do not agree with them, please do not use the Site.
              </p>
            </div>

            {/* SECTION 1 */}
            <section id="section-1" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  1. Information We Collect
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopyLink('section-1')}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-xs text-[#A78BFA] hover:text-white bg-white/[0.06] rounded-lg transition-all cursor-pointer no-print flex items-center gap-1"
                  title="Copy link to Section 1"
                  aria-label="Copy link to Section 1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {copiedSection === 'section-1' && <span className="text-[10px]">Copied!</span>}
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white">1.1 Information you give us</h3>
                <p>
                  <strong>Contact and request details:</strong> your name, business name, email address, phone number (optional), city, and the type of business you run, when you use our contact form or request a preview.
                </p>
                <p>
                  <strong>Studio and preview content:</strong> the choices you make and the content you enter, such as your business name, tagline, services, prices, hours, descriptions, links (for example, your Instagram or Google page), an optional address, style preferences, and any text or images you provide.
                </p>
                <p>
                  <strong>Project and payment communications:</strong> messages you send us, proposals and agreements, and details needed to invoice you. Payment card details are entered with our payment provider, not with us (see Section 4).
                </p>
                <p>
                  <strong>Consent records:</strong> when you agree to our Terms and this Privacy Policy, we record the date and time, the version you agreed to, the form you used, and a hashed (scrambled) version of your IP address.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <h3 className="text-xl font-semibold text-white">1.2 Information collected automatically</h3>
                <p>
                  <strong>Technical and usage data:</strong> your IP address, browser type and version, device type, operating system, language, the pages you view, the links you click, referring pages, dates and times, and error information.
                </p>
                <p>
                  <strong>Security and abuse-prevention data:</strong> signals from our anti-abuse tools (such as Firebase App Check and reCAPTCHA), request logs, and records of blocked or suspicious requests, which we use to protect the Site.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <h3 className="text-xl font-semibold text-white">1.3 Information from others</h3>
                <p>
                  We may receive limited information from service providers, for example confirmation from our payment provider that a payment succeeded, or delivery status from our email provider.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <h3 className="text-xl font-semibold text-white">1.4 Information we ask you not to submit</h3>
                <p>
                  Please do not enter passwords, API keys or other credentials, payment card numbers, Social Security or government ID numbers, health information, or personal information about your own customers into the Site, including the Studio. Our Terms explain why.
                </p>
              </div>
            </section>

            {/* SECTION 2 */}
            <section id="section-2" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  2. How We Use Information
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopyLink('section-2')}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-xs text-[#A78BFA] hover:text-white bg-white/[0.06] rounded-lg transition-all cursor-pointer no-print flex items-center gap-1"
                  title="Copy link to Section 2"
                  aria-label="Copy link to Section 2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {copiedSection === 'section-2' && <span className="text-[10px]">Copied!</span>}
                </button>
              </div>
              <p>We use personal information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>provide the Site, the Studio and the previews you request, and save your drafts;</li>
                <li>respond to your messages, prepare quotes and proposals, and communicate about your project;</li>
                <li>create and deliver previews, including by using AI tools (see Section 3);</li>
                <li>process payments and keep business, tax and accounting records;</li>
                <li>keep the Site secure, prevent spam, fraud and abuse, enforce rate limits, and investigate suspicious activity;</li>
                <li>understand how the Site is used and improve it [if you use analytics];</li>
                <li>send service messages, and, where the law allows and you have not opted out, occasional messages about our services; and</li>
                <li>comply with legal obligations and protect our rights.</li>
              </ul>
            </section>

            {/* SECTION 3 */}
            <section id="section-3" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  3. AI Features and How Your Information Is Processed
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopyLink('section-3')}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-xs text-[#A78BFA] hover:text-white bg-white/[0.06] rounded-lg transition-all cursor-pointer no-print flex items-center gap-1"
                  title="Copy link to Section 3"
                  aria-label="Copy link to Section 3"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {copiedSection === 'section-3' && <span className="text-[10px]">Copied!</span>}
                </button>
              </div>
              <p>
                3.1 Some features of the Site, such as the Instant Preview, send the information you enter (for example, your business name, services and style choices) to a third-party AI provider, [AI provider name(s)], so that it can generate draft text or content for your preview. The provider processes this information on our behalf and returns the result to us.
              </p>
              <p>
                3.2 We use the provider&apos;s business or API terms and settings, and [we have chosen options under which your submissions are not used to train the provider&apos;s models, where such an option is available — confirm with your provider&apos;s current terms before publishing].
              </p>
              <p>
                3.3 AI-generated content can be wrong or incomplete. We do not use AI features to make decisions about you that have legal or similarly significant effects.
              </p>
              <p>
                3.4 Please do not enter sensitive or confidential information into AI features.
              </p>
            </section>

            {/* SECTION 4 */}
            <section id="section-4" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  4. How We Share Information
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopyLink('section-4')}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-xs text-[#A78BFA] hover:text-white bg-white/[0.06] rounded-lg transition-all cursor-pointer no-print flex items-center gap-1"
                  title="Copy link to Section 4"
                  aria-label="Copy link to Section 4"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {copiedSection === 'section-4' && <span className="text-[10px]">Copied!</span>}
                </button>
              </div>
              <p>
                We do not sell your personal information, and we do not share it for cross-context behavioral advertising.
              </p>
              <p>We share personal information only in these situations:</p>
              <p className="font-semibold text-white">
                Service providers that help us run the Site and our business, under agreements or terms that limit how they may use it:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>hosting, database, authentication, cloud functions and anti-abuse services (Google Firebase and Google Cloud, including App Check and reCAPTCHA);</li>
                <li>AI providers ([AI provider name(s)]);</li>
                <li>payment processing (Stripe or a similar provider);</li>
                <li>email delivery and communication tools ([email provider]);</li>
                <li>[analytics provider, if any].</li>
              </ul>
              <p>
                <strong>Legal and safety reasons:</strong> if we believe disclosure is required by law, subpoena or legal process, or is needed to protect the rights, property or safety of us, our users or others, or to detect and prevent fraud or security incidents.
              </p>
              <p>
                <strong>Business changes:</strong> if the business is sold, merged, or transferred (including to a company formed to operate it), your information may be transferred as part of that transaction.
              </p>
              <p>
                <strong>With your consent or at your direction,</strong> for example, when you ask us to send a preview to someone.
              </p>
              <p>
                We do not disclose personal information to third parties for their own direct marketing purposes.
              </p>
            </section>

            {/* SECTION 5 */}
            <section id="section-5" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  5. Cookies, Local Storage and Similar Technologies
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopyLink('section-5')}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-xs text-[#A78BFA] hover:text-white bg-white/[0.06] rounded-lg transition-all cursor-pointer no-print flex items-center gap-1"
                  title="Copy link to Section 5"
                  aria-label="Copy link to Section 5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {copiedSection === 'section-5' && <span className="text-[10px]">Copied!</span>}
                </button>
              </div>
              <p>
                5.1 We use a small number of technologies that are needed for the Site to work, such as:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>browser storage that remembers whether you have already seen our loading animation in the current session;</li>
                <li>Firebase Authentication data, which keeps your Studio projects linked to you (including anonymous sign-in and, if you choose it, email sign-in); and</li>
                <li>anti-abuse tokens (Firebase App Check and reCAPTCHA), which help us block bots.</li>
              </ul>
              <p>
                5.2 [We do not use advertising cookies or cross-site tracking. / If you add analytics, describe it here: for example, &quot;We use [analytics tool] to measure traffic. It may set cookies or collect your IP address and device information. You can block these cookies in your browser settings.&quot;]
              </p>
              <p>
                5.3 You can control cookies and storage through your browser settings. Blocking essential technologies may stop parts of the Site, such as the Studio, from working.
              </p>
            </section>

            {/* SECTION 6: With Clean Horizontal Scroll Container for Mobile */}
            <section id="section-6" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  6. How Long We Keep Information
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopyLink('section-6')}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-xs text-[#A78BFA] hover:text-white bg-white/[0.06] rounded-lg transition-all cursor-pointer no-print flex items-center gap-1"
                  title="Copy link to Section 6"
                  aria-label="Copy link to Section 6"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {copiedSection === 'section-6' && <span className="text-[10px]">Copied!</span>}
                </button>
              </div>

              {/* Styled Retention Table inside horizontal-scroll container */}
              <div className="overflow-x-auto my-6 border border-white/[0.1] rounded-2xl bg-[#14141F] shadow-lg">
                <table className="w-full text-left text-sm border-collapse min-w-[540px]">
                  <thead>
                    <tr className="border-b border-white/[0.1] bg-white/[0.04]">
                      <th scope="col" className="py-3.5 px-5 font-bold text-white">Type of information</th>
                      <th scope="col" className="py-3.5 px-5 font-bold text-white">How long we keep it</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-xs sm:text-sm text-[#D4D4E0]">
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-5 font-medium text-white">Contact and preview requests</td>
                      <td className="py-3.5 px-5">[24] months after our last communication, unless you become a client</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-5 font-medium text-white">Studio drafts</td>
                      <td className="py-3.5 px-5">[90] days after your last activity, or until you ask us to delete them</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-5 font-medium text-white">Instant Preview and Custom Preview links</td>
                      <td className="py-3.5 px-5">Expire after [7] days and [14] days, then the preview content is deleted</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-5 font-medium text-white">Consent records</td>
                      <td className="py-3.5 px-5">[3] years</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-5 font-medium text-white">Security and abuse logs</td>
                      <td className="py-3.5 px-5">[90] days, unless needed to investigate an incident</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-5 font-medium text-white">Client agreements, invoices and payment records</td>
                      <td className="py-3.5 px-5">As long as needed for accounting, tax and legal purposes (typically [7] years)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                We may keep information longer if the law requires it or if it is needed to resolve a dispute or enforce our agreements. Backups may take a limited additional time to be overwritten.
              </p>
            </section>

            {/* SECTION 7 */}
            <section id="section-7" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  7. Security
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopyLink('section-7')}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-xs text-[#A78BFA] hover:text-white bg-white/[0.06] rounded-lg transition-all cursor-pointer no-print flex items-center gap-1"
                  title="Copy link to Section 7"
                  aria-label="Copy link to Section 7"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {copiedSection === 'section-7' && <span className="text-[10px]">Copied!</span>}
                </button>
              </div>
              <p>
                We use reasonable technical and organizational measures to protect personal information, including encrypted connections (HTTPS), access controls, restricted database rules, anti-abuse protections and monitoring. No website or system can be completely secure, and we cannot guarantee the security of information you send to us. If a security incident affects your personal information, we will notify you and the authorities where the law requires.
              </p>
            </section>

            {/* SECTION 8 */}
            <section id="section-8" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  8. Your Choices and Rights
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopyLink('section-8')}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-xs text-[#A78BFA] hover:text-white bg-white/[0.06] rounded-lg transition-all cursor-pointer no-print flex items-center gap-1"
                  title="Copy link to Section 8"
                  aria-label="Copy link to Section 8"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {copiedSection === 'section-8' && <span className="text-[10px]">Copied!</span>}
                </button>
              </div>
              <p>You can:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>ask us what personal information we hold about you, and ask for a copy;</li>
                <li>ask us to correct information that is wrong or incomplete;</li>
                <li>ask us to delete your personal information, including your Studio projects, subject to exceptions (for example, records we must keep for legal or accounting reasons);</li>
                <li>opt out of marketing emails at any time using the unsubscribe link or by contacting us; and</li>
                <li>control cookies and storage through your browser.</li>
              </ul>
              <p>
                To make a request, email [privacy@levelup-ecosystem.com] with the email address you used on the Site. We may need to verify your identity before we act, and we will respond within a reasonable time, generally within 45 days. We will not discriminate against you for exercising your privacy rights.
              </p>
            </section>

            {/* SECTION 9 */}
            <section id="section-9" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  9. California Privacy Information
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopyLink('section-9')}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-xs text-[#A78BFA] hover:text-white bg-white/[0.06] rounded-lg transition-all cursor-pointer no-print flex items-center gap-1"
                  title="Copy link to Section 9"
                  aria-label="Copy link to Section 9"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {copiedSection === 'section-9' && <span className="text-[10px]">Copied!</span>}
                </button>
              </div>
              <p>
                <strong>9.1 California Online Privacy Protection Act.</strong> This Privacy Policy describes the categories of personal information we collect (Section 1), the categories of third parties with whom we share it (Section 4), and how you can review and request changes to it (Section 8). We will post any changes here and update the &quot;last updated&quot; date (Section 14).
              </p>
              <p>
                <strong>9.2 Do Not Track.</strong> [We do not track visitors across other websites, and the Site does not currently respond to &quot;Do Not Track&quot; browser signals.] Third-party services we use for security (such as reCAPTCHA) may collect information as described in their own policies.
              </p>
              <p>
                <strong>9.3 California consumer privacy rights.</strong> California residents may have rights to know, delete, correct, and limit the use of certain personal information, and to opt out of its sale or sharing. We do not sell personal information and we do not share it for cross-context behavioral advertising. Even if these laws do not formally apply to our business, we honor the requests described in Section 8 for California residents.
              </p>
              <p>
                <strong>9.4 Shine the Light.</strong> We do not disclose personal information to third parties for their direct marketing purposes.
              </p>
            </section>

            {/* SECTION 10 */}
            <section id="section-10" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  10. Children&apos;s Privacy
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopyLink('section-10')}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-xs text-[#A78BFA] hover:text-white bg-white/[0.06] rounded-lg transition-all cursor-pointer no-print flex items-center gap-1"
                  title="Copy link to Section 10"
                  aria-label="Copy link to Section 10"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {copiedSection === 'section-10' && <span className="text-[10px]">Copied!</span>}
                </button>
              </div>
              <p>
                The Site is not directed to children under 13, and we do not knowingly collect personal information from them. It is intended for adults (18 and over). If you believe a child has given us personal information, contact us and we will delete it.
              </p>
            </section>

            {/* SECTION 11 */}
            <section id="section-11" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  11. Third-Party Websites and Services
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopyLink('section-11')}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-xs text-[#A78BFA] hover:text-white bg-white/[0.06] rounded-lg transition-all cursor-pointer no-print flex items-center gap-1"
                  title="Copy link to Section 11"
                  aria-label="Copy link to Section 11"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {copiedSection === 'section-11' && <span className="text-[10px]">Copied!</span>}
                </button>
              </div>
              <p>
                The Site may link to websites and services that we do not control, such as social media pages or the websites of our clients. We are not responsible for their privacy practices. Please read their policies.
              </p>
            </section>

            {/* SECTION 12 */}
            <section id="section-12" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  12. International Visitors
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopyLink('section-12')}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-xs text-[#A78BFA] hover:text-white bg-white/[0.06] rounded-lg transition-all cursor-pointer no-print flex items-center gap-1"
                  title="Copy link to Section 12"
                  aria-label="Copy link to Section 12"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {copiedSection === 'section-12' && <span className="text-[10px]">Copied!</span>}
                </button>
              </div>
              <p>
                The Site is operated in the United States and is intended for use in the United States. If you access it from another country, your information will be transferred to, stored and processed in the United States, where privacy laws may differ from those where you live.
              </p>
            </section>

            {/* SECTION 13 */}
            <section id="section-13" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  13. Data About Other People
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopyLink('section-13')}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-xs text-[#A78BFA] hover:text-white bg-white/[0.06] rounded-lg transition-all cursor-pointer no-print flex items-center gap-1"
                  title="Copy link to Section 13"
                  aria-label="Copy link to Section 13"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {copiedSection === 'section-13' && <span className="text-[10px]">Copied!</span>}
                </button>
              </div>
              <p>
                If you enter information about other people (for example, names or contact details of your customers), you must have the right to do so. We ask you not to submit this kind of information to the Site.
              </p>
            </section>

            {/* SECTION 14 */}
            <section id="section-14" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  14. Changes to This Privacy Policy
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopyLink('section-14')}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-xs text-[#A78BFA] hover:text-white bg-white/[0.06] rounded-lg transition-all cursor-pointer no-print flex items-center gap-1"
                  title="Copy link to Section 14"
                  aria-label="Copy link to Section 14"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {copiedSection === 'section-14' && <span className="text-[10px]">Copied!</span>}
                </button>
              </div>
              <p>
                We may update this Privacy Policy from time to time. When we make material changes, we will post the updated version with a new &quot;last updated&quot; date and, where appropriate, notify you by email or with a notice on the Site. Your continued use of the Site after the changes take effect means you accept the updated policy.
              </p>
            </section>

            {/* SECTION 15 */}
            <section id="section-15" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  15. Contact
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopyLink('section-15')}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-xs text-[#A78BFA] hover:text-white bg-white/[0.06] rounded-lg transition-all cursor-pointer no-print flex items-center gap-1"
                  title="Copy link to Section 15"
                  aria-label="Copy link to Section 15"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {copiedSection === 'section-15' && <span className="text-[10px]">Copied!</span>}
                </button>
              </div>
              <p>
                Questions or requests about this Privacy Policy: [privacy@levelup-ecosystem.com]
                <br />
                LevelUp Ecosystem, serving San Diego, California
              </p>
            </section>

            {/* Cross-Link back to Terms */}
            <div className="pt-8 border-t border-white/[0.08] text-sm text-[#A1A1B5]">
              Looking for our client terms and preview conditions? Read our{' '}
              <Link to="/terms" className="text-[#A78BFA] underline hover:text-white transition-colors font-medium">
                Terms of Service
              </Link>.
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
