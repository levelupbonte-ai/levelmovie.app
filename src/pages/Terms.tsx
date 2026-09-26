import React, { useState, useEffect, useRef } from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import { LEGAL_CONFIG } from '../config/legal';

interface Section {
  id: string;
  num: number;
  title: string;
}

const SECTIONS: Section[] = [
  { id: 'section-1', num: 1, title: 'Eligibility' },
  { id: 'section-2', num: 2, title: 'About the Site and Our Services' },
  { id: 'section-3', num: 3, title: 'Paid Services and Service Agreements' },
  { id: 'section-4', num: 4, title: 'Studio and Preview Tools' },
  { id: 'section-5', num: 5, title: 'AI-Generated Content' },
  { id: 'section-6', num: 6, title: 'Your Content and Your Responsibilities' },
  { id: 'section-7', num: 7, title: 'Acceptable Use' },
  { id: 'section-8', num: 8, title: 'Security Check and Security-Related Services' },
  { id: 'section-9', num: 9, title: 'Payments, Estimates and Recurring Plans' },
  { id: 'section-10', num: 10, title: 'Intellectual Property' },
  { id: 'section-11', num: 11, title: 'Third-Party Services and Links' },
  { id: 'section-12', num: 12, title: 'Privacy and Communications' },
  { id: 'section-13', num: 13, title: 'Disclaimers' },
  { id: 'section-14', num: 14, title: 'Limitation of Liability' },
  { id: 'section-15', num: 15, title: 'Indemnification' },
  { id: 'section-16', num: 16, title: 'Suspension and Termination' },
  { id: 'section-17', num: 17, title: 'Changes to the Site and to These Terms' },
  { id: 'section-18', num: 18, title: 'Governing Law and Disputes' },
  { id: 'section-19', num: 19, title: 'General' },
  { id: 'section-20', num: 20, title: 'Contact' },
];

export default function Terms() {
  const [activeSection, setActiveSection] = useState<string>('section-1');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [mobileTocOpen, setMobileTocOpen] = useState<boolean>(false);
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const articleRef = useRef<HTMLElement>(null);

  // Track scroll position for reading progress bar and back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowBackToTop(scrollY > 400);

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

  // IntersectionObserver to highlight active section in TOC
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const headings = SECTIONS.map((sec) => document.getElementById(sec.id)).filter(
      Boolean
    ) as HTMLElement[];

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#0B0B14] min-h-screen relative text-[#D4D4E0]">
      <SEO
        title="Terms of Service | LevelUp Ecosystem"
        description="Terms of Service for LevelUp Ecosystem web design, security checks, and ongoing maintenance."
        canonical="/terms"
        breadcrumbs={[{ name: 'Terms of Service', url: '/terms' }]}
      />

      {/* Accessible Skip Link */}
      <a
        href="#terms-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[99999] px-4 py-2 bg-[#7C3AED] text-white rounded-lg font-medium shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to Terms of Service content
      </a>

      {/* Reading Progress Bar (Subtle thin indicator) */}
      <div
        id="reading-progress-bar"
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA] z-[9999] transition-all duration-150 ease-out no-print"
        style={{ width: `${readingProgress}%` }}
        aria-hidden="true"
      />

      {/* Hero Header Section */}
      <section className="pt-12 pb-10 sm:pt-16 sm:pb-14 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto text-left sm:text-center space-y-4" data-reveal>
          <div className="flex items-center justify-start sm:justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A78BFA]">
            <span>Legal Documentation</span>
            <span className="text-[#71717A]" aria-hidden="true">·</span>
            <span>Version {LEGAL_CONFIG.TERMS_VERSION}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>

          <div className="flex flex-wrap items-center justify-start sm:justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-[#A1A1B5]">
            <p>
              <strong className="text-white">Effective date:</strong> {LEGAL_CONFIG.EFFECTIVE_DATE_TERMS}
            </p>
            <span className="hidden sm:inline text-white/20">•</span>
            <p>
              <strong className="text-white">Last updated:</strong> {LEGAL_CONFIG.LAST_UPDATED_TERMS}
            </p>
            <span className="hidden sm:inline text-white/20">•</span>
            <p>
              <strong className="text-white">Version:</strong> {LEGAL_CONFIG.TERMS_VERSION}
            </p>
          </div>
        </div>
      </section>

      {/* Main Container: 2-Column Desktop Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <Breadcrumbs items={[{ name: 'Terms of Service', url: '/terms' }]} />

        {/* Mobile Collapsible "On this page" TOC */}
        <div className="lg:hidden mb-8 no-print">
          <div className="rounded-2xl bg-[#14141F] border border-white/[0.08] p-4">
            <button
              type="button"
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              className="w-full flex items-center justify-between text-left text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded-lg py-1 cursor-pointer"
              aria-expanded={mobileTocOpen}
              aria-controls="mobile-toc-list"
            >
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                On this page (20 sections)
              </span>
              <span className="text-xs text-[#A1A1B5] transition-transform duration-200">
                {mobileTocOpen ? 'Hide ▲' : 'Show ▼'}
              </span>
            </button>

            {mobileTocOpen && (
              <nav id="mobile-toc-list" className="mt-4 pt-3 border-t border-white/[0.08] space-y-1.5 text-xs max-h-80 overflow-y-auto">
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

          {/* Reading Layout (Right Column): Single Column, max-w-[720px], body 17-18px, line-height 1.7 */}
          <main
            id="terms-content"
            ref={articleRef}
            className="lg:col-span-8 max-w-[720px] mx-auto lg:mx-0 text-[17px] sm:text-[18px] leading-[1.7] text-[#D4D4E0] space-y-10 sm:space-y-14 print-clean"
          >
            {/* Preamble & Important Notice Callout */}
            <div className="space-y-6 pb-6 border-b border-white/[0.08]">
              <p>
                <strong>LevelUp Ecosystem</strong>
                <br />
                Effective date: {LEGAL_CONFIG.EFFECTIVE_DATE_TERMS}
                <br />
                Last updated: {LEGAL_CONFIG.LAST_UPDATED_TERMS}
              </p>

              <p>
                These Terms of Service (the &quot;Terms&quot;) govern your access to and use of the LevelUp Ecosystem website at levelup-ecosystem.com and all related pages, tools and content, including the Studio, the Instant Preview, the Custom Preview and any other feature we offer through the website (together, the &quot;Site&quot;).
              </p>

              <p>
                The Site is operated by LevelUp Ecosystem (&quot;LevelUp,&quot; &quot;we,&quot; &quot;us&quot; or &quot;our&quot;), an independent web architecture and digital security studio based in San Diego, California.
              </p>

              {/* IMPORTANT CALLOUT: Bold Capitalized Intro Warning */}
              <div
                className="bg-[#14141F] border-l-[3px] border-[#7C3AED] p-5 sm:p-6 rounded-r-2xl my-6 text-[#D4D4E0] font-semibold text-[15px] sm:text-[16px] leading-[1.7] shadow-lg important-callout"
                role="note"
                aria-label="Important Legal Notice"
              >
                <div className="text-xs uppercase tracking-wider font-bold text-[#A78BFA] mb-2 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#A78BFA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Important Notice</span>
                </div>
                PLEASE READ THESE TERMS CAREFULLY. THEY CONTAIN IMPORTANT INFORMATION ABOUT YOUR LEGAL RIGHTS, INCLUDING DISCLAIMERS OF WARRANTIES (SECTION 13), LIMITATIONS OF LIABILITY (SECTION 14) AND AN INDEMNITY (SECTION 15).
              </div>

              <p>
                By accessing or using the Site, creating a Studio project, requesting a preview, or clicking a button or checking a box that says you agree, you agree to be bound by these Terms and by our{' '}
                <Link to="/privacy" className="text-[#A78BFA] underline hover:text-white transition-colors">
                  Privacy Policy
                </Link>. If you do not agree, do not use the Site.
              </p>
            </div>

            {/* SECTION 1 */}
            <section id="section-1" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  1. Eligibility
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
              <p>
                1.1 You must be at least 18 years old and able to form a binding contract to use the Site. The Site is not directed to children, and we do not knowingly collect information from anyone under 13.
              </p>
              <p>
                1.2 If you use the Site on behalf of a business or other organization, you confirm that you have the authority to accept these Terms on its behalf, and &quot;you&quot; includes that organization.
              </p>
              <p>
                1.3 You may not use the Site if you are barred from doing so under applicable law.
              </p>
            </section>

            {/* SECTION 2 */}
            <section id="section-2" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  2. About the Site and Our Services
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
              <p>
                2.1 The Site presents information about our web design, web development, security review and website care services, and offers free tools that let you preview a possible website.
              </p>
              <p>
                2.2 Information on the Site, including descriptions, examples, prices, timelines and estimates, is provided for general information. It is not a binding offer, quote or contract. Any price shown as &quot;starting at,&quot; &quot;from&quot; or as an &quot;estimate&quot; is subject to a final written quote after we review your project.
              </p>
              <p>
                2.3 We may decline, pause or cancel any request, preview or project at our discretion, subject to any signed Service Agreement.
              </p>
            </section>

            {/* SECTION 3 */}
            <section id="section-3" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  3. Paid Services and Service Agreements
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
                3.1 If you hire us to design, build, host, secure or maintain a website, a separate written proposal, statement of work or service agreement (a &quot;Service Agreement&quot;) will govern that work, including scope, price, payment schedule, revisions, ownership and timelines.
              </p>
              <p>
                3.2 If these Terms conflict with a signed Service Agreement, the Service Agreement controls for the paid services it covers. These Terms continue to apply to your use of the Site.
              </p>
              <p>
                3.3 Nothing on the Site creates a paid engagement, and nothing on the Site will charge you automatically, unless you have separately and expressly agreed to it in a proposal, invoice or Service Agreement.
              </p>
            </section>

            {/* SECTION 4 */}
            <section id="section-4" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  4. Studio and Preview Tools
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
                4.1 <strong>Previews are drafts.</strong> The Studio, the Instant Preview and the Custom Preview show samples created from the information and choices you provide. They are provided for evaluation only. They are not final work, may contain errors, may look different from a finished website, and are not approved for publication or commercial use.
              </p>
              <p>
                4.2 <strong>No obligation.</strong> A preview does not create an obligation for either of us to enter into a project. Requesting a preview does not guarantee that we will provide one, or provide it within a particular time. Any delivery time we mention (for example, &quot;24 to 48 business hours&quot;) is a target, not a guarantee.
              </p>
              <p>
                4.3 <strong>Temporary and unbacked-up.</strong> Drafts, projects and preview links may expire, be limited in number or size, be changed or be deleted at any time, including after a period of inactivity. Keep your own copies of any text, images or other content you enter. We do not promise to store or back up your drafts.
              </p>
              <p>
                4.4 <strong>Availability.</strong> The Studio and its features may be new or experimental. We may change, limit, suspend or discontinue any part of the Site, and we may apply usage limits, rate limits and other protections against abuse.
              </p>
              <p>
                4.5 <strong>Estimates.</strong> Any price range shown in the Studio is an automated estimate based on your selections. It is not a quote, and the final price will be stated in a written proposal or Service Agreement.
              </p>
            </section>

            {/* SECTION 5 */}
            <section id="section-5" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  5. AI-Generated Content
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
                5.1 <strong>How AI is used &amp; Free Google AI Disclaimer.</strong> We use artificial intelligence technologies to help create preliminary preview drafts, text, layouts, and exploratory content. The free instant preview and automated testing tools utilize free-tier Google AI services (including Google Cloud / Gemini AI). LevelUp Ecosystem (&quot;LevelUp,&quot; &quot;we,&quot; &quot;us&quot; or &quot;our&quot;) is not responsible or liable for any data, prompts, or content collected, retained, logged, or processed by Google or its affiliates. By using the free AI test, you acknowledge that your submitted prompts are processed under Google&apos;s independent policies and terms.
              </p>
              <p>
                5.2 <strong>No Sensitive Submissions.</strong> You agree never to submit sensitive, confidential, or protected personal data into any free AI testing feature, including credit cards, passwords, trade secrets, health data, or personal identification records.
              </p>
              <p>
                5.3 <strong>Output may be wrong.</strong> AI-generated content can be inaccurate, incomplete, outdated, misleading, offensive, similar to other content, or unsuitable for your purpose. It may include errors of fact, grammar, design or code. You are responsible for reviewing all AI-generated content before you rely on it or publish it.
              </p>
              <p>
                5.4 <strong>No professional advice.</strong> AI-generated content and previews are not legal, medical, financial, tax, security or other professional advice. In particular, they are not reviewed for compliance with laws or rules that apply to your business or industry, such as advertising rules, licensing requirements, health or medical claims, accessibility standards, privacy laws or payment-card requirements. You are responsible for making sure your website and its content comply with the rules that apply to you.
              </p>
              <p>
                5.5 <strong>Ownership and originality.</strong> We do not promise that AI-generated content is unique, or that it can be protected by copyright or other rights. The legal status of AI-generated content is unsettled and may differ by jurisdiction.
              </p>
              <p>
                5.6 <strong>Third-party AI providers.</strong> Information you submit to AI features is processed by third-party AI providers (including Google AI). Please refer to our{' '}
                <Link to="/privacy" className="text-[#A78BFA] underline hover:text-white transition-colors">
                  Privacy Policy
                </Link>{' '}
                for details on third-party AI handling.
              </p>
            </section>

            {/* SECTION 6 */}
            <section id="section-6" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  6. Your Content and Your Responsibilities
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
              <p>
                6.1 <strong>Your content.</strong> &quot;Your Content&quot; means any text, images, logos, business details, links and other material you submit to the Site. You keep ownership of Your Content.
              </p>
              <p>
                6.2 <strong>License to us.</strong> You give us a non-exclusive, worldwide, royalty-free license to host, store, process, reproduce, adapt and display Your Content, and to send it to our service providers (including AI providers), only as needed to operate the Site, create and show your previews, respond to your requests, keep the Site secure and comply with law.
              </p>
              <p>
                6.3 <strong>Your promises.</strong> You confirm that: (a) you own Your Content or have all rights and permissions needed to submit it and let us use it as described in these Terms, including rights to any photos, logos, names, trademarks and text; (b) Your Content is accurate and not misleading; (c) Your Content does not infringe or violate anyone&apos;s intellectual property, privacy, publicity or other rights; and (d) you have the legal right to provide any personal information about other people that you submit.
              </p>
              <p>
                6.4 <strong>Your business.</strong> You are solely responsible for your business, your website content, your licenses and permits, your advertising claims, your compliance with applicable laws, and any decision you make using the Site or a preview.
              </p>
              <p>
                6.5 <strong>Feedback.</strong> If you give us suggestions or feedback about the Site, we may use them without restriction or payment to you.
              </p>
            </section>

            {/* SECTION 7 */}
            <section id="section-7" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  7. Acceptable Use
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
              <p>You agree not to, and not to help anyone else to:</p>
              <ul className="list-disc pl-6 space-y-2 text-[#D4D4E0]">
                <li>use the Site for anything unlawful, fraudulent or deceptive;</li>
                <li>create or submit content that imitates or falsely represents another person, business, bank, government agency or brand, or that could be used for phishing, scams or impersonation;</li>
                <li>submit content that is defamatory, harassing, hateful, sexually explicit, or that exploits or endangers minors, or that promotes violence or illegal activity;</li>
                <li>upload or transmit malware or any code intended to harm, disrupt or gain unauthorized access;</li>
                <li>probe, scan or test the Site or its security, attempt to access data or accounts that are not yours, or try to bypass access controls, rate limits, App Check or other protections, except as described in Section 7.1;</li>
                <li>use bots, scrapers or automated means to access the Site or to submit forms, or overload or disrupt the Site;</li>
                <li>copy, resell, sublicense, reverse engineer or build a competing product from the Site, the Studio or our templates, except as permitted by law or by a Service Agreement;</li>
                <li>violate anyone&apos;s intellectual property, privacy or other rights; or</li>
                <li>use the Site to send spam or unsolicited communications.</li>
              </ul>
              <p>
                7.1 <strong>Security reports.</strong> If you believe you have found a security vulnerability on the Site, please report it to <a href={`mailto:${LEGAL_CONFIG.SECURITY_EMAIL}`} className="text-[#A78BFA] underline hover:text-white">{LEGAL_CONFIG.SECURITY_EMAIL}</a> (see also our security contact file at /.well-known/security.txt). Act in good faith, do not access, change or delete data that is not yours, do not disrupt the Site, and give us a reasonable time to respond before sharing details publicly.
              </p>
              <p>
                7.2 We may investigate violations, remove content, restrict or suspend access, and report unlawful activity to the appropriate authorities.
              </p>
            </section>

            {/* SECTION 8 */}
            <section id="section-8" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  8. Security Check and Security-Related Services
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
              <p>
                8.1 <strong>Authorization required.</strong> We will only review, scan or test a website, account or system that you own or that you are authorized in writing to have reviewed, and only within the scope described in a written authorization or Service Agreement. By requesting a security service, you confirm that you have this authority and you agree to provide the written authorization we request. We are not responsible for reviewing anything outside the agreed scope.
              </p>
              <p>
                8.2 <strong>Limited scope.</strong> Security reviews are limited in scope and reflect the systems and information available at a single point in time. They are not a penetration test, a certification, a compliance audit or a guarantee unless we expressly agree otherwise in writing.
              </p>
              <p>
                8.3 <strong>No guarantee of security.</strong> No website, account or system can be made completely secure. We do not promise that a review will find every weakness, that recommended changes will prevent every incident, or that your website will not be hacked, breached, interrupted or misused. You remain responsible for implementing recommendations, keeping software and credentials up to date, maintaining backups, and protecting your own accounts, including enabling two-factor authentication.
              </p>
            </section>

            {/* SECTION 9 */}
            <section id="section-9" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  9. Payments, Estimates and Recurring Plans
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
                9.1 Payments for paid services are made under the terms of your proposal, invoice or Service Agreement. Prices are in U.S. dollars unless stated otherwise. You are responsible for applicable taxes, and for any fees charged by your bank or payment provider.
              </p>
              <p>
                9.2 Payments are processed by third-party payment providers such as Stripe. We do not receive or store your full payment card number. Your use of a payment provider is subject to that provider&apos;s terms and privacy policy.
              </p>
              <p>
                9.3 <strong>Recurring plans.</strong> If you choose a recurring plan (for example, a monthly Care Plan), the price, billing frequency, renewal terms and cancellation method will be shown to you clearly before you sign up, and we will ask for your express consent to the recurring charge. Unless your agreement says otherwise, you can cancel at any time before the next billing date by emailing us at <a href={`mailto:${LEGAL_CONFIG.BILLING_EMAIL}`} className="text-[#A78BFA] underline hover:text-white">{LEGAL_CONFIG.BILLING_EMAIL}</a> or using the cancellation link in your invoice email, and the cancellation takes effect at the end of the current billing period. Nothing in these Terms limits any cancellation or refund right you have under applicable law.
              </p>
              <p>
                9.4 Deposits, refunds and late payments are governed by your Service Agreement.
              </p>
            </section>

            {/* SECTION 10 */}
            <section id="section-10" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  10. Intellectual Property
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
                10.1 <strong>Our property.</strong> The Site and everything on it, including its design, text, graphics, logos (including the LevelUp Ecosystem name and star logo), templates, code, Studio, selection and arrangement, and all related intellectual property rights, are owned by us or our licensors and are protected by law. We reserve all rights not expressly granted.
              </p>
              <p>
                10.2 <strong>Limited license to you.</strong> We give you a limited, personal, non-exclusive, non-transferable, revocable license to access and use the Site for its intended purpose and to view previews for evaluating our services. Previews and templates may not be published, reused or distributed unless we agree in writing.
              </p>
              <p>
                10.3 <strong>Deliverables.</strong> Ownership of finished work for paid projects is set out in your Service Agreement.
              </p>
              <p>
                10.4 <strong>Portfolio.</strong> We will not publicly display your project or your business name as a client without your permission, which may be given in a Service Agreement or in writing.
              </p>
              <p>
                10.5 <strong>Copyright complaints.</strong> If you believe that content on the Site infringes your copyright, send a written notice to <a href={`mailto:${LEGAL_CONFIG.LEGAL_EMAIL}`} className="text-[#A78BFA] underline hover:text-white">{LEGAL_CONFIG.LEGAL_EMAIL}</a> that includes: (a) your name and contact information; (b) a description of the copyrighted work; (c) the location of the content on the Site; (d) a statement that you have a good-faith belief the use is not authorized; (e) a statement, under penalty of perjury, that the information in your notice is accurate and that you are the owner or authorized to act for the owner; and (f) your physical or electronic signature. We may remove content and end the access of users who repeatedly infringe.
              </p>
            </section>

            {/* SECTION 11 */}
            <section id="section-11" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  11. Third-Party Services and Links
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
                The Site relies on and may link to third-party services, including hosting and database providers (such as Google Firebase), payment processors, email and analytics providers and AI providers. We do not control these services and are not responsible for their availability, content, practices or policies. Your use of them is at your own risk and is subject to their terms and privacy policies.
              </p>
            </section>

            {/* SECTION 12 */}
            <section id="section-12" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  12. Privacy and Communications
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
                12.1 Our{' '}
                <Link to="/privacy" className="text-[#A78BFA] underline hover:text-white transition-colors">
                  Privacy Policy
                </Link>{' '}
                explains what information we collect and how we use it. It is part of these Terms.
              </p>
              <p>
                12.2 By giving us your email address or phone number, you agree that we may contact you about your request, your preview and your project. You can opt out of marketing messages at any time using the unsubscribe link or by contacting us; we may still send you messages about your requests and any services you have ordered.
              </p>
              <p>
                12.3 You agree that we may communicate with you, and that agreements and notices may be provided, electronically. Electronic signatures and records are as valid as paper ones to the extent permitted by law.
              </p>
            </section>

            {/* SECTION 13 - IMPORTANT CALLOUT FOR ALL-CAPS DISCLAIMERS */}
            <section id="section-13" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  13. Disclaimers
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

              <div
                className="bg-[#14141F] border-l-[3px] border-[#7C3AED] p-5 sm:p-6 rounded-r-2xl my-6 text-[#D4D4E0] font-semibold text-[15px] sm:text-[16px] leading-[1.7] space-y-4 shadow-lg important-callout"
                role="note"
                aria-label="Warranty Disclaimers"
              >
                <div className="text-xs uppercase tracking-wider font-bold text-[#A78BFA] flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#A78BFA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Important Disclaimer</span>
                </div>
                <p>
                  THE SITE, THE STUDIO, ALL PREVIEWS AND ALL AI-GENERATED CONTENT ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE,&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED OR STATUTORY. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, ACCURACY AND NON-INFRINGEMENT.
                </p>
                <p>
                  WITHOUT LIMITING THE ABOVE, WE DO NOT WARRANT THAT: (A) THE SITE OR ANY PREVIEW WILL BE UNINTERRUPTED, TIMELY, ERROR-FREE OR SECURE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS; (B) AI-GENERATED CONTENT OR ANY PREVIEW WILL BE ACCURATE, COMPLETE, ORIGINAL, LAWFUL OR SUITABLE FOR YOUR PURPOSE; (C) ANY SERVICE, PREVIEW OR SECURITY REVIEW WILL PREVENT ANY SECURITY INCIDENT, DATA LOSS OR DOWNTIME; OR (D) ANY WEBSITE OR SERVICE WILL PRODUCE ANY PARTICULAR RESULT, SUCH AS TRAFFIC, SEARCH RANKINGS, BOOKINGS, SALES OR REVENUE.
                </p>
                <p>
                  YOU USE THE SITE, THE STUDIO AND ALL PREVIEWS AT YOUR OWN RISK AND ARE RESPONSIBLE FOR REVIEWING ANY CONTENT BEFORE RELYING ON IT OR PUBLISHING IT.
                </p>
              </div>

              <p>
                Some jurisdictions do not allow certain disclaimers, so some of the above may not apply to you. In that case, the disclaimers apply to the fullest extent permitted by law.
              </p>
            </section>

            {/* SECTION 14 - IMPORTANT CALLOUT FOR ALL-CAPS LIMITATION OF LIABILITY */}
            <section id="section-14" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  14. Limitation of Liability
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

              <div
                className="bg-[#14141F] border-l-[3px] border-[#7C3AED] p-5 sm:p-6 rounded-r-2xl my-6 text-[#D4D4E0] font-semibold text-[15px] sm:text-[16px] leading-[1.7] space-y-4 shadow-lg important-callout"
                role="note"
                aria-label="Limitation of Liability Notice"
              >
                <div className="text-xs uppercase tracking-wider font-bold text-[#A78BFA] flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#A78BFA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Important Limitation</span>
                </div>
                <p>
                  TO THE FULLEST EXTENT PERMITTED BY LAW, LEVELUP AND ITS OWNER, CONTRACTORS AND SERVICE PROVIDERS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, BUSINESS, CUSTOMERS, DATA, GOODWILL OR REPUTATION, BUSINESS INTERRUPTION OR COST OF SUBSTITUTE SERVICES, ARISING OUT OF OR RELATED TO THE SITE, THE STUDIO, ANY PREVIEW, ANY AI-GENERATED CONTENT OR THESE TERMS, WHETHER BASED ON CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY OR ANY OTHER THEORY, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                </p>
                <p>
                  TO THE FULLEST EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THE SITE AND THESE TERMS WILL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US FOR THE SPECIFIC SERVICE THAT GAVE RISE TO THE CLAIM IN THE 12 MONTHS BEFORE THE CLAIM AROSE, AND (B) ONE HUNDRED U.S. DOLLARS (US $100). For free tools such as the Studio and the Instant Preview, the amount in (B) applies.
                </p>
              </div>

              <p>
                14.3 Nothing in these Terms excludes or limits liability that cannot be excluded or limited under applicable law, including liability for fraud, willful misconduct, gross negligence or violation of law. If you are a California resident, this limitation applies only to the extent permitted by California law.
              </p>
              <p>
                14.4 The disclaimers and limitations in these Terms reflect a reasonable allocation of risk and are part of the basis of the bargain between you and us. A signed Service Agreement may contain its own liability terms, which will apply to the services it covers.
              </p>
            </section>

            {/* SECTION 15 */}
            <section id="section-15" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  15. Indemnification
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
                To the fullest extent permitted by law, you agree to defend, indemnify and hold harmless LevelUp and its owner, contractors and service providers from and against any claims, damages, losses, liabilities, costs and expenses (including reasonable attorneys&apos; fees) arising out of or related to: (a) Your Content; (b) your use of the Site, a preview or AI-generated content, including publishing it; (c) your violation of these Terms or of any law or third-party right; (d) your business, website or products; or (e) any security service you request for a system that you did not have the authority to have reviewed. We may take control of the defense of any matter, and you agree to cooperate.
              </p>
            </section>

            {/* SECTION 16 */}
            <section id="section-16" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  16. Suspension and Termination
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopyLink('section-16')}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-xs text-[#A78BFA] hover:text-white bg-white/[0.06] rounded-lg transition-all cursor-pointer no-print flex items-center gap-1"
                  title="Copy link to Section 16"
                  aria-label="Copy link to Section 16"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {copiedSection === 'section-16' && <span className="text-[10px]">Copied!</span>}
                </button>
              </div>
              <p>
                16.1 We may suspend, restrict or end your access to the Site, and delete your projects, previews and content, at any time and for any reason, including if you violate these Terms or if we believe it is necessary to protect the Site, other users or third parties. Where reasonable, we will try to give notice.
              </p>
              <p>
                16.2 You may stop using the Site at any time. You may ask us to delete your Studio projects by contacting us.
              </p>
              <p>
                16.3 By default, drafts may be deleted after 90 days of inactivity, and preview links expire after 7 days for Instant Previews and 14 days for Custom Previews.
              </p>
              <p>
                16.4 Sections that by their nature should survive termination will survive, including Sections 5, 6, 10, 13, 14, 15, 17 and 18.
              </p>
            </section>

            {/* SECTION 17 */}
            <section id="section-17" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  17. Changes to the Site and to These Terms
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopyLink('section-17')}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-xs text-[#A78BFA] hover:text-white bg-white/[0.06] rounded-lg transition-all cursor-pointer no-print flex items-center gap-1"
                  title="Copy link to Section 17"
                  aria-label="Copy link to Section 17"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {copiedSection === 'section-17' && <span className="text-[10px]">Copied!</span>}
                </button>
              </div>
              <p>
                17.1 We may update the Site, the Studio and these Terms from time to time. When we make material changes to these Terms, we will post the updated Terms with a new &quot;last updated&quot; date and, where appropriate, give additional notice (for example, by email or a notice on the Site).
              </p>
              <p>
                17.2 Your continued use of the Site after the changes take effect means you accept the updated Terms. If you do not agree, stop using the Site. Changes to these Terms do not change a signed Service Agreement unless both of us agree in writing.
              </p>
            </section>

            {/* SECTION 18 */}
            <section id="section-18" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  18. Governing Law and Disputes
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopyLink('section-18')}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-xs text-[#A78BFA] hover:text-white bg-white/[0.06] rounded-lg transition-all cursor-pointer no-print flex items-center gap-1"
                  title="Copy link to Section 18"
                  aria-label="Copy link to Section 18"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {copiedSection === 'section-18' && <span className="text-[10px]">Copied!</span>}
                </button>
              </div>
              <p>
                18.1 <strong>Governing law.</strong> These Terms and any dispute arising out of or related to them or the Site are governed by the laws of the State of California and applicable U.S. federal law, without regard to conflict-of-law rules.
              </p>
              <p>
                18.2 <strong>Informal resolution first.</strong> Before starting any formal proceeding, you agree to contact us at <a href={`mailto:${LEGAL_CONFIG.LEGAL_EMAIL}`} className="text-[#A78BFA] underline hover:text-white">{LEGAL_CONFIG.LEGAL_EMAIL}</a> with a written description of the problem and your contact details, and to give us at least 30 days to try to resolve it.
              </p>
              <p>
                18.3 <strong>Courts.</strong> If the dispute is not resolved, and except for claims that either of us may bring in small claims court, any legal action must be brought in the state or federal courts located in San Diego County, California, and you and we consent to their jurisdiction and venue.
              </p>
              <p>
                18.4 <strong>Time limit.</strong> To the extent permitted by law, any claim arising out of or related to the Site or these Terms must be filed within one (1) year after it arose, or it is permanently barred.
              </p>
            </section>

            {/* SECTION 19 */}
            <section id="section-19" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  19. General
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopyLink('section-19')}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-xs text-[#A78BFA] hover:text-white bg-white/[0.06] rounded-lg transition-all cursor-pointer no-print flex items-center gap-1"
                  title="Copy link to Section 19"
                  aria-label="Copy link to Section 19"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {copiedSection === 'section-19' && <span className="text-[10px]">Copied!</span>}
                </button>
              </div>
              <p>
                19.1 <strong>Entire agreement.</strong> These Terms, the Privacy Policy and any Service Agreement are the entire agreement between you and us about the Site and replace earlier discussions about it.
              </p>
              <p>
                19.2 <strong>Severability and waiver.</strong> If any part of these Terms is found unenforceable, that part will be limited or removed to the minimum extent necessary, and the rest will remain in effect. Our failure to enforce a right is not a waiver of it.
              </p>
              <p>
                19.3 <strong>Assignment.</strong> You may not transfer your rights or obligations under these Terms without our written consent. We may assign these Terms, for example to a company formed to run the business.
              </p>
              <p>
                19.4 <strong>Events beyond our control.</strong> We are not liable for delay or failure caused by events beyond our reasonable control, including outages of internet, hosting, cloud, payment or AI providers, cyberattacks, or natural events.
              </p>
              <p>
                19.5 <strong>No third-party beneficiaries.</strong> These Terms do not give rights to anyone other than you and us, except that our owner, contractors and service providers benefit from Sections 13 to 15.
              </p>
              <p>
                19.6 <strong>California notice.</strong> Under California Civil Code Section 1789.3, California users are entitled to the following notice: the Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs may be contacted in writing at 1625 North Market Blvd., Suite N 112, Sacramento, CA 95834, or by telephone at (800) 952-5210.
              </p>
            </section>

            {/* SECTION 20 */}
            <section id="section-20" className="space-y-4 pt-4 scroll-mt-28">
              <div className="flex items-center justify-between group">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  20. Contact
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopyLink('section-20')}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-xs text-[#A78BFA] hover:text-white bg-white/[0.06] rounded-lg transition-all cursor-pointer no-print flex items-center gap-1"
                  title="Copy link to Section 20"
                  aria-label="Copy link to Section 20"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {copiedSection === 'section-20' && <span className="text-[10px]">Copied!</span>}
                </button>
              </div>
              <p>
                Questions about these Terms:{' '}
                <a href={`mailto:${LEGAL_CONFIG.LEGAL_EMAIL}`} className="text-[#A78BFA] underline hover:text-white">
                  {LEGAL_CONFIG.LEGAL_EMAIL}
                </a>
              </p>
              <p>
                LevelUp Ecosystem, serving San Diego, California
              </p>
            </section>

            {/* Version History Block at Bottom */}
            <div className="pt-10 mt-14 border-t border-white/[0.08] space-y-2 text-xs text-[#A1A1B5] print-clean">
              <div className="font-semibold text-white">Document Version History</div>
              <p>
                Version {LEGAL_CONFIG.TERMS_VERSION}, {LEGAL_CONFIG.LAST_UPDATED_TERMS}. Previous versions available on request.
              </p>
              <p className="text-[11px] text-[#71717A]">
                To request an archived version or discuss service agreements, contact{' '}
                <a href={`mailto:${LEGAL_CONFIG.LEGAL_EMAIL}`} className="text-[#A78BFA] underline hover:text-white">
                  {LEGAL_CONFIG.LEGAL_EMAIL}
                </a>.
              </p>
            </div>
          </main>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[#14141F] hover:bg-[#7C3AED] border border-white/[0.12] hover:border-[#7C3AED] text-white shadow-xl transition-all duration-200 cursor-pointer back-to-top-btn no-print active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          aria-label="Back to top"
          title="Back to top"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}
