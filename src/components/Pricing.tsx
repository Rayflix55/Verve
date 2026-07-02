import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { Check, Sparkles } from 'lucide-react';
import { Button } from './UI/Button';
import { SectionHeaderReveal } from './UI/SectionHeaderReveal';

interface Plan {
  name: string;
  description: string;
  price: { monthly: number; yearly: number };
  billing: string;
  cta: string;
  popular?: boolean;
  features: string[];
}

interface PricingData {
  title: string;
  subtitle: string;
  plans: Plan[];
}

interface PricingProps {
  data: PricingData;
}

export function Pricing({ data }: PricingProps) {
  const [isYearly, setIsYearly] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  const handleScrollToContact = () => {
    const target = document.querySelector('#contact');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.section
      id="pricing"
      className="py-24 relative max-w-7xl mx-auto px-6"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Decorative ambient background */}
      <div className="absolute top-1/4 -right-48 -z-10 w-96 h-96 rounded-full bg-magenta/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-48 -z-10 w-96 h-96 rounded-full bg-cyan/5 blur-[130px] pointer-events-none" />

      {/* Header */}
      <SectionHeaderReveal className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 flex flex-col items-center">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-5">
          {data.title}
        </h2>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed mb-8 max-w-2xl">
          {data.subtitle}
        </p>

        {/* Billing Cycle Toggle */}
        <div className="inline-flex items-center p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-850 shadow-inner">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
              !isYearly
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm font-bold'
                : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all relative flex items-center space-x-1.5 cursor-pointer ${
              isYearly
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm font-bold'
                : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            <span>Yearly</span>
            <span className="px-2 py-0.5 text-[9px] font-bold text-white bg-magenta rounded-full tracking-normal normal-case">
              Save 20%
            </span>
          </button>
        </div>
      </SectionHeaderReveal>

      {/* Cards Grid */}
      <div
        ref={containerRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
        id="pricing-grid"
      >
        {data.plans.map((plan, idx) => {
          const price = isYearly ? plan.price.yearly : plan.price.monthly;
          const billingLabel = isYearly ? '/ user, billed annually' : plan.billing;

          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ y: -4 }}
              className={`relative rounded-3xl border flex flex-col justify-between overflow-hidden backdrop-blur-md p-8 sm:p-9 transition-all duration-300 ${
                plan.popular
                  ? 'bg-white border-magenta dark:bg-neutral-900 shadow-xl shadow-magenta/5 scale-100 md:scale-[1.04] z-10'
                  : 'bg-white/70 border-neutral-200 dark:bg-neutral-900/40 dark:border-neutral-800/80'
              }`}
              id={`pricing-card-${plan.name.toLowerCase()}`}
            >
              {/* Popular Badge Glow Ribbon */}
              {plan.popular && (
                <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-magenta via-purple-500 to-magenta text-center py-1.5 text-[10px] font-bold tracking-widest text-white uppercase flex items-center justify-center space-x-1">
                  <Sparkles className="h-3 w-3 fill-white/15" />
                  <span>Most Popular</span>
                </div>
              )}

              {/* Title & Description */}
              <div className={plan.popular ? 'pt-4' : ''}>
                <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                  {plan.name}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 font-normal leading-relaxed min-h-[40px]">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="my-7">
                  <div className="flex items-baseline">
                    <span className="text-neutral-400 dark:text-neutral-500 text-2xl font-semibold mr-1">$</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={price}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="text-4xl sm:text-5xl font-black text-neutral-900 dark:text-white tracking-tight"
                      >
                        {price}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500 ml-2 font-normal">
                      {billingLabel}
                    </span>
                  </div>
                </div>

                {/* Separator */}
                <div className="h-[1px] bg-neutral-200/50 dark:bg-neutral-800/60 w-full my-6" />

                {/* Feature List */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start text-sm">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/50 flex items-center justify-center mr-3 mt-0.5">
                        <Check className="h-3.5 w-3.5 text-magenta" strokeWidth={2.5} />
                      </div>
                      <span className="text-neutral-600 dark:text-neutral-300 font-normal leading-normal">
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <Button
                variant={plan.popular ? 'primary' : 'outline'}
                className="w-full justify-center"
                onClick={handleScrollToContact}
                id={`pricing-btn-${plan.name.toLowerCase()}`}
              >
                {plan.cta}
              </Button>

              {/* Decorative background glow for professional */}
              {plan.popular && (
                <div className="absolute -bottom-16 -right-16 -z-10 h-32 w-32 rounded-full bg-magenta/10 blur-2xl" />
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
