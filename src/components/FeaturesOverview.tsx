import { motion } from 'motion/react';
import { Sparkles, Zap, Cpu } from 'lucide-react';
import React, { ReactNode } from 'react';
import { SectionHeaderReveal } from './UI/SectionHeaderReveal';

interface FeatureItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface FeaturesOverviewProps {
  data: FeatureItem[];
}

export function FeaturesOverview({ data }: FeaturesOverviewProps) {
  const iconMap: Record<string, ReactNode> = {
    Sparkles: <Sparkles className="h-6 w-6 text-magenta" />,
    Zap: <Zap className="h-6 w-6 text-cyan" />,
    Cpu: <Cpu className="h-6 w-6 text-purple-400" />,
  };

  return (
    <motion.section
      id="features"
      className="py-24 relative max-w-7xl mx-auto px-6"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Background decoration */}
      <div className="absolute top-10 left-1/3 -z-10 w-80 h-80 rounded-full bg-cyan/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <SectionHeaderReveal>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-5">
          Building the future of work
        </h2>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto font-normal leading-relaxed">
          Unleash maximum team coordination with next-gen automation features designed to streamline communication silos.
        </p>
      </SectionHeaderReveal>

      {/* Cards Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        id="features-overview-grid"
      >
        {data.map((feature, idx) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: idx * 0.15, ease: 'easeOut' }}
            whileHover={{ y: -8 }}
            className="relative group rounded-2xl border border-neutral-200/50 bg-white/60 dark:border-neutral-800/50 dark:bg-neutral-900/40 backdrop-blur-md p-8 overflow-hidden transition-all duration-300 flex flex-col hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.08)]"
            id={`features-overview-card-${feature.id}`}
          >
            {/* Animated growing left border accent on hover */}
            <div className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-1 bg-gradient-to-b from-magenta to-cyan transition-all duration-300" />

            {/* Icon circle */}
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/20 dark:border-neutral-700/30 shadow-sm mb-6 group-hover:rotate-12 transition-transform duration-300">
              {iconMap[feature.icon] || <Sparkles className="h-6 w-6" />}
            </div>

            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 tracking-tight group-hover:text-magenta transition-colors duration-200">
              {feature.title}
            </h3>

            <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base leading-relaxed font-normal flex-grow">
              {feature.description}
            </p>

            {/* Background glowing orb */}
            <div className="absolute -bottom-12 -right-12 -z-10 h-28 w-28 rounded-full bg-cyan/5 blur-xl group-hover:scale-125 transition-transform duration-500" />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
