'use client';
import React, { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border border-t border-b border-border">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 py-5 text-left"
            >
              <span className="font-semibold text-sm sm:text-base text-foreground">{item.question}</span>
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-full border border-border flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-45 bg-foreground border-foreground' : ''}`}
              >
                <svg className={`w-3.5 h-3.5 ${isOpen ? 'text-white' : 'text-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </button>
            <div
              className={`grid overflow-hidden transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'}`}
            >
              <div className="min-h-0 overflow-hidden">
                <p className="text-sm text-muted-foreground leading-relaxed pr-10">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
