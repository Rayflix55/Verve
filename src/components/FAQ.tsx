import { Accordion } from './UI/Accordion';
import React from 'react';
import { SectionHeaderReveal } from './UI/SectionHeaderReveal';
import { motion } from 'motion/react';

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
    <motion.section
      id="faq"
      className="py-24 relative max-w-7xl mx-auto px-6"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-96 h-96 rounded-full bg-cyan/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <SectionHeaderReveal>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-5">
          {data.title}
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed">
          {data.subtitle}
        </p>
      </SectionHeaderReveal>

      {/* Reusable Accordion */}
      <Accordion items={data.items} />
    </motion.section>
  );
}
