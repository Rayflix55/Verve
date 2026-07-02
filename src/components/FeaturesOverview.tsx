import { motion } from 'motion/react';
import { Sparkles, Zap, Cpu } from 'lucide-react';
import React, { ReactNode, useState, useEffect } from 'react';
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

function FeatureCardSkeleton() {
  return (
    <div className="relative premium-glow-card p-8 flex flex-col min-h-[220px] overflow-hidden">
      {/* Glow highlight overlay */}
      <div className="card-ambient-overlay" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none rounded-2xl" />
      
      {/* Icon sphere skeleton */}
      <div className="relative z-10 h-14 w-14 rounded-2xl bg-neutral-200/80 dark:bg-neutral-800/80 mb-6 animate-pulse" />
      
      {/* Title line skeleton */}
      <div className="relative z-10 h-6.5 w-1/2 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-lg mb-3.5 animate-pulse" />
      
      {/* Description lines skeleton */}
      <div className="relative z-10 space-y-2.5 flex-grow">
        <div className="h-4 w-full bg-neutral-200/40 dark:bg-neutral-800/40 rounded animate-pulse" />
        <div className="h-4 w-11/12 bg-neutral-200/40 dark:bg-neutral-800/40 rounded animate-pulse" />
        <div className="h-4 w-4/5 bg-neutral-200/40 dark:bg-neutral-800/40 rounded animate-pulse" />
      </div>
    </div>
  );
}

export function FeaturesOverview({ data }: FeaturesOverviewProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Elegant simulation of API response/dynamic bundle load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

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
        {isLoading ? (
          <>
            <FeatureCardSkeleton />
            <FeatureCardSkeleton />
            <FeatureCardSkeleton />
          </>
        ) : (
          data.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.15, ease: 'easeOut' }}
              whileHover={{ y: -8 }}
              className="relative group premium-glow-card p-8 flex flex-col"
              id={`features-overview-card-${feature.id}`}
            >
              {/* Dynamic ambient color gradients */}
              <div className="card-ambient-overlay" />

              {/* Animated growing left border accent on hover */}
              <div className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-1 bg-gradient-to-b from-magenta to-cyan transition-all duration-300 z-25" />

              {/* Icon circle */}
              <div className="relative z-10 flex items-center justify-center h-14 w-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/20 dark:border-neutral-700/30 shadow-sm mb-6 group-hover:rotate-12 transition-transform duration-300">
                {iconMap[feature.icon] || <Sparkles className="h-6 w-6" />}
              </div>

              <h3 className="relative z-10 text-xl font-bold text-neutral-900 dark:text-white mb-3 tracking-tight group-hover:text-magenta transition-colors duration-200">
                {feature.title}
              </h3>

              <p className="relative z-10 text-neutral-500 dark:text-neutral-400 text-sm sm:text-base leading-relaxed font-normal flex-grow">
                {feature.description}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </motion.section>
  );
}
