import React, { useState } from 'react';

export interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  className?: string;
}

export default function FaqAccordion({ items, className = '' }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const panelId = `faq-panel-${idx}`;
        const buttonId = `faq-button-${idx}`;

        return (
          <div
            key={idx}
            className={`rounded-2xl transition-all duration-300 border ${
              isOpen
                ? 'bg-[#141424] border-[#7C3AED]/40 shadow-lg shadow-[#7C3AED]/10'
                : 'bg-[#11111B] border-white/[0.08] hover:border-white/[0.16]'
            }`}
          >
            <button
              id={buttonId}
              type="button"
              onClick={() => toggle(idx)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/60 rounded-2xl"
            >
              <span className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                {item.q}
              </span>

              {/* Stylish + / − toggle button */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isOpen
                    ? 'bg-[#7C3AED] text-white rotate-90 shadow-md shadow-[#7C3AED]/30'
                    : 'bg-white/[0.06] text-[#A78BFA] hover:bg-white/[0.12] hover:text-white'
                }`}
                aria-hidden="true"
              >
                <span className="text-xl font-light leading-none select-none">
                  {isOpen ? '−' : '+'}
                </span>
              </div>
            </button>

            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-sm sm:text-base text-[#B3B3C8] leading-relaxed border-t border-white/[0.05]"
              >
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
