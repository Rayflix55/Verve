import { Accordion } from './UI/Accordion';
import React from 'react';
import { SectionHeaderReveal } from './UI/SectionHeaderReveal';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQData {
  title: string;
  subtitle: string;
  items: FAQItem[];
}

interface FAQProps {
  data: FAQData;
}

export function FAQ({ data }: FAQProps) {
  return (
    <section id="faq" className="py-24 relative max-w-7xl mx-auto px-6">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-96 h-96 rounded-full bg-cyan/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <SectionHeaderReveal>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-5">
          {data.title}
        </h2>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed">
          {data.subtitle}
        </p>
      </SectionHeaderReveal>

      {/* Reusable Accordion */}
      <Accordion items={data.items} />
    </section>
  );
}
