import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'process' | 'guarantee' | 'technical' | 'ownership';
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-model',
    question: 'How does the "Build-First, Zero-Risk" process work in practice?',
    answer: 'We design and construct your working website or web application before requesting any payment. Once the initial build is complete, we deliver a secure, interactive staging link. You and your team test the real application—clicking buttons, checking mobile responsiveness, and testing user flows. You only make payment once you are 100% satisfied and give your explicit approval to deploy live.',
    category: 'process'
  },
  {
    id: 'faq-deposit',
    question: 'Do I need to pay any upfront deposit or enter a credit card?',
    answer: 'No. There is zero deposit, no upfront retainer, and no credit card required to begin. You submit your project details through our Project Studio or quick inquiry form, our engineering team reviews the scope, and we begin development immediately without financial friction.',
    category: 'guarantee'
  },
  {
    id: 'faq-revisions',
    question: 'What happens if the live demo needs changes or does not match my expectations?',
    answer: 'Every project includes iterative review and revision cycles. You can submit specific feedback, request adjustments to typography, colors, animations, or feature logic, and inspect updated staging builds. In the rare event that we cannot achieve your vision, you can walk away with zero financial penalty or commitment.',
    category: 'guarantee'
  },
  {
    id: 'faq-timeline',
    question: 'How long does it take to receive the first interactive prototype?',
    answer: 'For Starter Websites and Event Invitations, your working interactive preview is typically ready within 3 to 5 business days. For Business Pro platforms and custom full-stack web applications, the initial interactive alpha is delivered within 1 to 2 weeks depending on feature complexity.',
    category: 'process'
  },
  {
    id: 'faq-ownership',
    question: 'Who owns the intellectual property and source code after launch?',
    answer: 'You own 100% of the project. Upon final payment and live deployment, all rights, clean Git repositories, design files, database configurations, and hosting credentials are unconditionally transferred to your organization with zero proprietary lock-in.',
    category: 'ownership'
  },
  {
    id: 'faq-post-launch',
    question: 'What support and maintenance are included after my site is deployed?',
    answer: 'Every deployment includes SSL security setup, DNS configuration, and post-launch monitoring. Depending on your chosen tier, we include complimentary maintenance and technical support—from 1 full year on our Business Pro package up to 3 years of guaranteed maintenance on our Ecosystem Premium plan.',
    category: 'technical'
  },
  {
    id: 'faq-technologies',
    question: 'Which modern technologies and integrations can LevelUp implement?',
    answer: 'We specialize in modern, high-performance web stacks: React, TypeScript, Tailwind CSS, Next.js/Vite, Node.js/Express, Cloud databases (PostgreSQL, Supabase, Firestore), Stripe checkout, and bespoke AI capabilities (Gemini LLMs, automated workflows, and vector search).',
    category: 'technical'
  }
];

interface BuildFirstFaqProps {
  onOpenStudio?: () => void;
  onOpenContact?: () => void;
}

export const BuildFirstFaq: React.FC<BuildFirstFaqProps> = ({ onOpenStudio, onOpenContact }) => {
  // Allow multiple or single open; default first item open for clear affordance
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-model': true
  });
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'process' | 'guarantee' | 'technical' | 'ownership'>('all');

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleExpandAll = () => {
    const allOpen = FAQ_DATA.reduce((acc, item) => {
      acc[item.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setOpenItems(allOpen);
  };

  const handleCollapseAll = () => {
    setOpenItems({});
  };

  const filteredFaqs = selectedCategory === 'all'
    ? FAQ_DATA
    : FAQ_DATA.filter(item => item.category === selectedCategory);

  const isAllOpen = filteredFaqs.every(item => openItems[item.id]);

  return (
    <section id="faq" className="py-24 bg-gray-50 border-t border-b border-gray-100 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#f5f3ff] border border-[#ede9fe] text-[#7c3aed] text-xs font-semibold uppercase tracking-wider mb-4 rounded-none">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Clear Answers • Total Confidence</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about our build-first, zero-risk delivery model—from initial prototype to final deployment.
          </p>
        </div>

        {/* Category Filters & Expand/Collapse Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="FAQ Categories">
            <button
              type="button"
              id="faq-filter-all"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer rounded-none border ${
                selectedCategory === 'all'
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              All Questions ({FAQ_DATA.length})
            </button>
            <button
              type="button"
              id="faq-filter-guarantee"
              onClick={() => setSelectedCategory('guarantee')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer rounded-none border ${
                selectedCategory === 'guarantee'
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Zero-Risk Guarantee
            </button>
            <button
              type="button"
              id="faq-filter-process"
              onClick={() => setSelectedCategory('process')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer rounded-none border ${
                selectedCategory === 'process'
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Process & Timeline
            </button>
            <button
              type="button"
              id="faq-filter-technical"
              onClick={() => setSelectedCategory('technical')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer rounded-none border ${
                selectedCategory === 'technical'
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Tech & Support
            </button>
            <button
              type="button"
              id="faq-filter-ownership"
              onClick={() => setSelectedCategory('ownership')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer rounded-none border ${
                selectedCategory === 'ownership'
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              IP & Ownership
            </button>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              id="faq-toggle-all-btn"
              onClick={isAllOpen ? handleCollapseAll : handleExpandAll}
              className="text-xs font-medium text-[#7c3aed] hover:text-[#6d28d9] transition-colors cursor-pointer py-1 px-2 hover:bg-[#f5f3ff] rounded-none inline-flex items-center gap-1"
            >
              <span>{isAllOpen ? 'Collapse All' : 'Expand All'}</span>
            </button>
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3" role="region" aria-label="FAQ Accordion">
          {filteredFaqs.map((faq) => {
            const isOpen = !!openItems[faq.id];
            return (
              <div
                key={faq.id}
                id={`faq-item-${faq.id}`}
                className={`transition-all duration-200 border rounded-none overflow-hidden ${
                  isOpen
                    ? 'bg-white border-[#c4b5fd] shadow-sm'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <button
                  type="button"
                  id={`faq-trigger-${faq.id}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  onClick={() => toggleItem(faq.id)}
                  className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 cursor-pointer select-none group"
                >
                  <span className={`text-sm sm:text-base font-semibold transition-colors leading-snug ${
                    isOpen ? 'text-[#6d28d9]' : 'text-gray-900 group-hover:text-[#7c3aed]'
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`w-7 h-7 shrink-0 rounded-none flex items-center justify-center transition-all duration-200 border ${
                    isOpen
                      ? 'bg-[#7c3aed] text-white border-[#7c3aed] rotate-180'
                      : 'bg-gray-50 text-gray-500 border-gray-200 group-hover:border-[#c4b5fd] group-hover:text-[#7c3aed]'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${faq.id}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${faq.id}`}
                    className="px-5 sm:px-6 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100 animate-in fade-in duration-200"
                  >
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Reassurance Callout & Action Bar */}
        <div className="mt-12 bg-white border border-gray-200 p-6 sm:p-8 rounded-none shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-none bg-[#f5f3ff] border border-[#ede9fe] text-[#7c3aed] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-1">Still have a specific question about your project?</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Our engineers are ready to answer your technical and design questions with zero sales pressure.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full sm:w-auto">
            {onOpenStudio && (
              <button
                type="button"
                id="faq-cta-studio-btn"
                onClick={onOpenStudio}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all shadow-sm cursor-pointer rounded-none"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Studio</span>
              </button>
            )}
            {onOpenContact && (
              <button
                type="button"
                id="faq-cta-contact-btn"
                onClick={onOpenContact}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-5 py-2.5 text-xs font-semibold transition-all shadow-sm cursor-pointer rounded-none"
              >
                <span>Ask Our Team</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
