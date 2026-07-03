import { motion } from 'motion/react';
import { Activity, Clock, Compass, Users, CheckSquare, Award } from 'lucide-react';
import React, { ReactNode } from 'react';
import { SectionHeaderReveal } from './UI/SectionHeaderReveal';
import { PulseIconWrapper } from './UI/PulseIconWrapper';
import { StaggerContainer, StaggerItem } from './UI/StaggerReveal';

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
    <section
      id="features-extended"
      className="py-16 sm:py-24 relative max-w-7xl mx-auto px-4 sm:px-6 overflow-hidden"
    >
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Header */}
      <SectionHeaderReveal>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-5 text-center px-1">
          Everything you need to scale velocity
        </h2>
        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto font-normal leading-relaxed text-center px-2">
          Unlock a comprehensive collection of productivity trackers, workload analyzers, and incentive alignments.
        </p>
      </SectionHeaderReveal>

      {/* Grid */}
      <StaggerContainer
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        id="extended-features-grid"
      >
        {data.map((item, idx) => (
          <StaggerItem
            key={item.id}
            whileHover={{ y: -4 }}
            className="relative group premium-glow-card p-6 flex flex-col items-center sm:items-start text-center sm:text-left"
            id={`extended-feature-card-${item.id}`}
          >
            {/* Dynamic ambient color gradients */}
            <div className="card-ambient-overlay" />

            {/* Accent colored left border */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${leftBorderColors[idx % leftBorderColors.length]} z-20`} />

            {/* Pulse Icon Wrapper with animated shadow */}
            <PulseIconWrapper
              size="sm"
              className="mb-5 mx-auto sm:mx-0"
            >
              {iconMap[item.icon] || <Activity className="h-5 w-5" />}
            </PulseIconWrapper>

            <h3 className="relative z-10 text-lg font-bold text-neutral-900 dark:text-white mb-2 tracking-tight group-hover:text-magenta transition-colors duration-200">
              {item.title}
            </h3>

            <p className="relative z-10 text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed font-normal flex-grow">
              {item.description}
            </p>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
