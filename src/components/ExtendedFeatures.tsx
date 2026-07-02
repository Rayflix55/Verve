import { motion } from 'motion/react';
import { Activity, Clock, Compass, Users, CheckSquare, Award } from 'lucide-react';
import React, { ReactNode } from 'react';
import { SectionHeaderReveal } from './UI/SectionHeaderReveal';

interface ExtendedFeatureItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface ExtendedFeaturesProps {
  data: ExtendedFeatureItem[];
}

export function ExtendedFeatures({ data }: ExtendedFeaturesProps) {
  const iconMap: Record<string, ReactNode> = {
    Activity: <Activity className="h-5 w-5 text-magenta" />,
    Clock: <Clock className="h-5 w-5 text-cyan" />,
    Compass: <Compass className="h-5 w-5 text-purple-400" />,
    Users: <Users className="h-5 w-5 text-magenta" />,
    CheckSquare: <CheckSquare className="h-5 w-5 text-cyan" />,
    Award: <Award className="h-5 w-5 text-purple-400" />,
  };

  // Border glow class options
  const glowBorderColors = [
    'hover:border-magenta/60 dark:hover:border-magenta/60',
    'hover:border-cyan/60 dark:hover:border-cyan/60',
    'hover:border-purple-400/60 dark:hover:border-purple-400/60',
    'hover:border-magenta/60 dark:hover:border-magenta/60',
    'hover:border-cyan/60 dark:hover:border-cyan/60',
    'hover:border-purple-400/60 dark:hover:border-purple-400/60',
  ];

  const leftBorderColors = [
    'bg-magenta',
    'bg-cyan',
    'bg-purple-500',
    'bg-magenta',
    'bg-cyan',
    'bg-purple-500',
  ];

  return (
    <motion.section
      id="features-extended"
      className="py-24 relative max-w-7xl mx-auto px-6"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Header */}
      <SectionHeaderReveal>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-5">
          Everything you need to scale velocity
        </h2>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto font-normal leading-relaxed">
          Unlock a comprehensive collection of productivity trackers, workload analyzers, and incentive alignments.
        </p>
      </SectionHeaderReveal>

      {/* Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        id="extended-features-grid"
      >
        {data.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
            whileHover={{ y: -4 }}
            className={`relative rounded-2xl border border-neutral-200/50 bg-white/60 dark:border-neutral-800/50 dark:bg-neutral-900/40 backdrop-blur-md p-6.5 overflow-hidden transition-all duration-300 flex flex-col hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.05)] ${glowBorderColors[idx % glowBorderColors.length]}`}
            id={`extended-feature-card-${item.id}`}
          >
            {/* Accent colored left border */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${leftBorderColors[idx % leftBorderColors.length]}`} />

            {/* Icon */}
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/20 dark:border-neutral-700/30 mb-5">
              {iconMap[item.icon] || <Activity className="h-5 w-5" />}
            </div>

            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">
              {item.title}
            </h3>

            <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed font-normal flex-grow">
              {item.description}
            </p>

            {/* Small subtle decorative circle */}
            <div className="absolute -bottom-6 -right-6 -z-10 h-14 w-14 rounded-full bg-neutral-100 dark:bg-neutral-850 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
