import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Check, X } from 'lucide-react';
import { SectionHeaderReveal } from './UI/SectionHeaderReveal';

interface ComparisonRow {
  feature: string;
  starter: string;
  professional: string;
  enterprise: string;
}

interface ComparisonCategory {
  name: string;
  rows: ComparisonRow[];
}

interface ComparisonData {
  title: string;
  subtitle: string;
  categories: ComparisonCategory[];
}

interface ComparisonProps {
  data: ComparisonData;
}

export function Comparison({ data }: ComparisonProps) {
  const tableRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(tableRef, { once: true, amount: 0.05 });

  const renderValue = (value: string) => {
    if (value.toLowerCase() === 'yes') {
      return <Check className="h-5 w-5 text-emerald-500 mx-auto" strokeWidth={2.5} />;
    }
    if (value.toLowerCase() === 'no') {
      return <X className="h-5 w-5 text-neutral-300 dark:text-neutral-700 mx-auto" strokeWidth={2.5} />;
    }
    return <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{value}</span>;
  };

  const renderValueMobile = (value: string) => {
    if (value.toLowerCase() === 'yes') {
      return <span className="text-emerald-500 font-semibold flex items-center"><Check className="h-4 w-4 mr-1" strokeWidth={2.5} /> Yes</span>;
    }
    if (value.toLowerCase() === 'no') {
      return <span className="text-neutral-400 dark:text-neutral-600 font-normal flex items-center"><X className="h-4 w-4 mr-1" strokeWidth={2.5} /> No</span>;
    }
    return <span className="text-neutral-800 dark:text-neutral-200 font-semibold">{value}</span>;
  };

  return (
    <motion.section
      id="comparison"
      className="py-24 relative max-w-7xl mx-auto px-6"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Header */}
      <SectionHeaderReveal>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-5">
          {data.title}
        </h2>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed">
          {data.subtitle}
        </p>
      </SectionHeaderReveal>

      {/* Desktop Table View (lg, md screens) */}
      <motion.div
        ref={tableRef}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="hidden md:block overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/70 dark:border-neutral-800/80 dark:bg-neutral-900/40 backdrop-blur-md shadow-lg"
        id="comparison-table"
      >
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="border-b border-neutral-200/60 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/60">
              <th className="text-left py-6 px-8 text-sm font-bold tracking-wider text-neutral-400 uppercase">Features</th>
              <th className="py-6 px-6 text-base font-extrabold text-neutral-900 dark:text-white">Starter</th>
              <th className="py-6 px-6 text-base font-extrabold text-magenta">Professional</th>
              <th className="py-6 px-6 text-base font-extrabold text-cyan">Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {data.categories.map((category) => (
              <tr key={category.name}>
                <td colSpan={4} className="text-left py-4 px-8 bg-neutral-100/30 dark:bg-neutral-900/20 text-xs font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase border-b border-neutral-200/40 dark:border-neutral-850/40">
                  {category.name}
                </td>
              </tr>
            ))}
          </tbody>
          {data.categories.map((category) => (
            <tbody key={category.name + '-items'}>
              {category.rows.map((row, rIdx) => (
                <tr
                  key={row.feature}
                  className={`border-b border-neutral-200/40 dark:border-neutral-800/30 transition-colors hover:bg-neutral-50/40 dark:hover:bg-neutral-900/30 ${
                    rIdx % 2 === 0 ? 'bg-transparent' : 'bg-neutral-50/15 dark:bg-neutral-900/10'
                  }`}
                >
                  <td className="text-left py-4.5 px-8 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    {row.feature}
                  </td>
                  <td className="py-4.5 px-6">{renderValue(row.starter)}</td>
                  <td className="py-4.5 px-6">{renderValue(row.professional)}</td>
                  <td className="py-4.5 px-6">{renderValue(row.enterprise)}</td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </motion.div>

      {/* Mobile Comparative Cards View (sm screens) */}
      <div className="block md:hidden space-y-8" id="comparison-mobile">
        {data.categories.map((category) => (
          <div key={category.name} className="space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase px-1">
              {category.name}
            </h3>
            <div className="space-y-4">
              {category.rows.map((row) => (
                <div
                  key={row.feature}
                  className="rounded-2xl border border-neutral-200 bg-white/80 dark:border-neutral-800 dark:bg-neutral-900/60 p-5 space-y-3 shadow-sm"
                >
                  <p className="text-sm font-extrabold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800/50 pb-2.5">
                    {row.feature}
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                    <div>
                      <p className="text-[10px] font-mono tracking-wider text-neutral-400 dark:text-neutral-500 uppercase mb-1">Starter</p>
                      {renderValueMobile(row.starter)}
                    </div>
                    <div>
                      <p className="text-[10px] font-mono tracking-wider text-magenta uppercase mb-1">Pro</p>
                      {renderValueMobile(row.professional)}
                    </div>
                    <div>
                      <p className="text-[10px] font-mono tracking-wider text-cyan uppercase mb-1">Enterprise</p>
                      {renderValueMobile(row.enterprise)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
