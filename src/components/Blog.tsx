import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeaderReveal } from './UI/SectionHeaderReveal';

interface BlogItem {
  category: string;
  title: string;
  excerpt: string;
  readingTime: string;
  image: string;
  author: string;
  date: string;
}

interface BlogData {
  title: string;
  subtitle: string;
  items: BlogItem[];
}

interface BlogProps {
  data: BlogData;
}

export function Blog({ data }: BlogProps) {
  return (
    <section id="blog" className="py-24 relative overflow-hidden bg-neutral-50/50 dark:bg-neutral-950/40 border-y border-neutral-200/40 dark:border-neutral-900/40">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 -z-10 w-80 h-80 rounded-full bg-magenta/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <SectionHeaderReveal>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-5">
            {data.title}
          </h2>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed">
            {data.subtitle}
          </p>
        </SectionHeaderReveal>

        {/* Blog Cards Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          id="blog-cards-grid"
        >
          {data.items.map((post, idx) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -6 }}
              className="relative rounded-2xl border border-neutral-200/60 bg-white dark:border-neutral-800/80 dark:bg-neutral-900 overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)]"
              id={`blog-card-${idx}`}
            >
              <div>
                {/* Image mask frame */}
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={post.image}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Category Pill Tag */}
                  <span className="absolute top-4 left-4 text-[10px] font-bold tracking-wider text-white bg-magenta px-2.5 py-1 rounded-full uppercase shadow-md shadow-magenta/10">
                    {post.category}
                  </span>
                </div>

                {/* Info Content */}
                <div className="p-6.5">
                  <div className="flex items-center space-x-3 text-xs text-neutral-400 dark:text-neutral-500 mb-3 font-medium">
                    <span>{post.date}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <span>{post.readingTime}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-2.5 leading-snug group-hover:text-magenta transition-colors duration-200">
                    {post.title}
                  </h3>

                  <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed font-normal line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer / Trigger */}
              <div className="px-6.5 pb-6 pt-2 border-t border-neutral-100/60 dark:border-neutral-800/50 flex items-center justify-between text-xs sm:text-sm font-semibold">
                <span className="text-neutral-400 dark:text-neutral-500 font-normal">
                  By <strong className="font-semibold text-neutral-700 dark:text-neutral-300">{post.author}</strong>
                </span>

                <span className="inline-flex items-center space-x-1 text-magenta group-hover:underline transition-all">
                  <span>Read Article</span>
                  <ArrowUpRight className="h-4.5 w-4.5" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
