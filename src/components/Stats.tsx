import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { DollarSign, Cpu, Users } from 'lucide-react';
import React from 'react';
import { StaggerContainer, StaggerItem } from './UI/StaggerReveal';

interface StatItem {
  value: string;
  label: string;
  sublabel: string;
}

interface StatsProps {
  data: StatItem[];
}

interface StatCounterProps {
  value: string;
  label: string;
  sublabel: string;
  index: number;
  key?: any;
}

function StatCounter({ value, label, sublabel, index }: StatCounterProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(elementRef, { once: true, amount: 0.3 });

  // Extract the numeric part and any suffix (like '$', 'M+', '%', '+')
  const numericPart = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
  const prefix = value.startsWith('$') ? '$' : '';
  const suffix = value.replace(/[0-9$]/g, '');

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 1500; // 1.5 seconds
    const end = numericPart;
    if (end === 0) {
      setCount(0);
      return;
    }

    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quad
      const easeProgress = progress * (2 - progress);
      const currentVal = Math.floor(easeProgress * end);

      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [isInView, numericPart]);

  const icons = [
    <DollarSign className="h-6 w-6 text-magenta" />,
    <Cpu className="h-6 w-6 text-cyan" />,
    <Users className="h-6 w-6 text-purple-400" />,
  ];

  return (
    <StaggerItem
      ref={elementRef}
      className="relative group rounded-3xl border border-neutral-200/50 bg-white/60 dark:border-neutral-850 dark:bg-[#0c0c0c]/40 backdrop-blur-md p-7.5 transition-all duration-300"
      id={`stat-card-${index}`}
    >
      {/* Icon top wrapper */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-12 w-12 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800 flex items-center justify-center">
          {icons[index % icons.length]}
        </div>
        <span className="text-[10px] font-mono tracking-widest text-neutral-400 dark:text-neutral-500 uppercase font-bold">
          Metric 0{index + 1}
        </span>
      </div>

      {/* Numerical Counter */}
      <p className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-900 dark:text-white mb-2" id={`stat-value-${index}`}>
        {prefix}
        {count}
        {suffix}
      </p>

      <h3 className="text-base font-bold text-neutral-700 dark:text-neutral-300 mb-1">
        {label}
      </h3>

      <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
        {sublabel}
      </p>

      {/* Hover background pulse */}
      <div className="absolute -bottom-10 -right-10 -z-10 h-24 w-24 rounded-full bg-magenta/5 blur-xl group-hover:scale-150 transition-transform duration-500" />
    </StaggerItem>
  );
}

export function Stats({ data }: StatsProps) {
  return (
    <section
      id="stats"
      className="py-20 relative max-w-7xl mx-auto px-6 overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[600px] h-48 rounded-full bg-magenta/5 blur-[100px] pointer-events-none" />

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {data.map((stat, idx) => (
          <StatCounter
            key={idx}
            index={idx}
            value={stat.value}
            label={stat.label}
            sublabel={stat.sublabel}
          />
        ))}
      </StaggerContainer>
    </section>
  );
}
