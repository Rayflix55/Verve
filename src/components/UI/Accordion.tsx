import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto" id="accordion">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="rounded-2xl border border-neutral-200/60 bg-white/70 backdrop-blur-md transition-colors duration-200 hover:bg-neutral-50/50 dark:border-neutral-800/80 dark:bg-neutral-900/60 dark:hover:bg-neutral-900/90 overflow-hidden"
          >
            <button
              onClick={() => toggleItem(index)}
              className="flex w-full items-center justify-between p-5 text-left font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none cursor-pointer"
              aria-expanded={isOpen}
            >
              <span className="text-base sm:text-lg">{item.question}</span>
              <span
                className={`ml-4 flex-shrink-0 text-neutral-500 dark:text-neutral-400 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : 'rotate-0'
                }`}
              >
                <ChevronDown className="h-5 w-5" />
              </span>
            </button>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="p-5 pt-0 text-neutral-600 dark:text-neutral-400 text-sm sm:text-base border-t border-neutral-100 dark:border-neutral-800/50 leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
