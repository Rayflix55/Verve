import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionHeaderReveal } from './UI/SectionHeaderReveal';
import {
  Slack,
  Github,
  Figma,
  Mail,
  HardDrive,
  Kanban,
  FileText,
  CheckSquare,
  Video,
  CreditCard,
  ArrowRight,
} from 'lucide-react';
import React, { ReactNode } from 'react';

interface IntegrationItem {
  name: string;
  category: string;
  icon: string;
  desc: string;
}

interface IntegrationsData {
  title: string;
  subtitle: string;
  categories: string[];
  items: IntegrationItem[];
}

interface IntegrationsProps {
  data: IntegrationsData;
}

export function Integrations({ data }: IntegrationsProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const iconMap: Record<string, ReactNode> = {
    Slack: <Slack className="h-6 w-6 text-[#4A154B]" />,
    Github: <Github className="h-6 w-6 text-neutral-800 dark:text-neutral-200" />,
    Figma: <Figma className="h-6 w-6 text-[#F24E1E]" />,
    Mail: <Mail className="h-6 w-6 text-red-500" />,
    HardDrive: <HardDrive className="h-6 w-6 text-blue-500" />,
    Kanban: <Kanban className="h-6 w-6 text-[#0052CC]" />,
    FileText: <FileText className="h-6 w-6 text-amber-500" />,
    CheckSquare: <CheckSquare className="h-6 w-6 text-[#5E6AD2]" />,
    Video: <Video className="h-6 w-6 text-[#2D8CFF]" />,
    CreditCard: <CreditCard className="h-6 w-6 text-emerald-500" />,
  };

  const filteredItems =
    activeCategory === 'All'
      ? data.items
      : data.items.filter((item) => item.category === activeCategory);

  return (
    <motion.section
      id="integrations"
      className="py-24 relative overflow-hidden bg-neutral-50/50 dark:bg-neutral-950/40 border-y border-neutral-200/40 dark:border-neutral-900/40"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[600px] h-96 rounded-full bg-cyan/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <SectionHeaderReveal className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-5">
            {data.title}
          </h2>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed">
            {data.subtitle}
          </p>
        </SectionHeaderReveal>

        {/* Dynamic Category Filtering Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12" id="integrations-tabs">
          {data.categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide uppercase border transition-all cursor-pointer ${
                activeCategory === category
                  ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-neutral-950 shadow-md'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-850 dark:text-neutral-400 dark:hover:bg-neutral-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid Container */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
          id="integrations-grid"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, delay: (idx % 5) * 0.05 }}
                whileHover={{
                  scale: 1.05,
                }}
                className="relative rounded-2xl border border-neutral-200/50 bg-white/60 dark:border-neutral-800/50 dark:bg-neutral-900/40 backdrop-blur-md p-6 flex flex-col items-center text-center group cursor-pointer hover:shadow-[0_10px_25px_-5px_rgba(0,188,212,0.15)]"
                id={`integration-card-${item.name}`}
              >
                {/* Integration Icon */}
                <div className="h-14 w-14 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-150 dark:border-neutral-700/40 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {iconMap[item.name] || <Slack className="h-6 w-6" />}
                </div>

                <h3 className="text-sm sm:text-base font-bold text-neutral-800 dark:text-neutral-100 mb-1.5">
                  {item.name}
                </h3>

                <p className="text-[11px] sm:text-xs text-neutral-400 dark:text-neutral-500 font-normal line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>

                {/* Micro Category Badge */}
                <span className="absolute top-3 right-3 text-[9px] font-mono tracking-wider text-neutral-400 dark:text-neutral-500 uppercase px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800/80">
                  {item.category}
                </span>

                {/* Subtle Hover Shadow Glow */}
                <div className="absolute inset-0 -z-10 rounded-2xl bg-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Explore More Trigger */}
        <div className="text-center mt-12 sm:mt-16">
          <a
            href="#contact"
            className="inline-flex items-center space-x-1 text-sm font-semibold text-magenta hover:text-opacity-80 transition-opacity group"
          >
            <span>Explore all 100+ integrations</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </motion.section>
  );
}
