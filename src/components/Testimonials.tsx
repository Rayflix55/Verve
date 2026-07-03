import React, { useRef } from "react";
import { motion } from "motion/react";

interface TestimonialItem {
  quote: string;
  author: string;
  title: string;
  company: string;
  rating: number;
  image: string;
}

interface TestimonialsProps {
  data: {
    heading: string;
    subheading: string;
    items: TestimonialItem[];
  };
}

export const Testimonials: React.FC<TestimonialsProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Define static tilts for cards based on their index to create the scattered physical layout
  const tilts = ["-rotate-[2.5deg]", "rotate-[1.5deg]", "-rotate-[1deg]", "rotate-[2deg]"];
  const hoverTilts = "hover:rotate-0 hover:scale-[1.04] hover:shadow-purple-500/10 hover:border-purple-500/30 dark:hover:border-purple-500/30";

  // Duplicate items for seamless continuous scrolling
  const firstRowItems = [...data.items, ...data.items, ...data.items];

  return (
    <motion.section
      ref={containerRef}
      id="testimonials"
      className="py-24 relative overflow-hidden transition-colors duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Inline styles for the self-contained continuous marquee keyframes */}
      <style>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-marquee-left {
          animation: marquee-left 32s linear infinite;
        }
      `}</style>

      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-purple-500/5 dark:bg-purple-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 mb-16">
        {/* Layout with title on left and dynamic 'More Praise' action button on right as requested by reference layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6" id="testimonials-header-group">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-500 mb-3 block">
              Testimonials
            </span>
            <h2 className="font-sans text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white uppercase mb-4" id="testimonials-main-title">
              {data.heading}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed">
              {data.subheading}
            </p>
          </div>

          <div className="flex-shrink-0">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-500 hover:bg-purple-600 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 text-white dark:text-purple-300 font-semibold text-xs uppercase tracking-widest transition-all duration-300 border border-transparent dark:border-purple-500/30 hover:scale-[1.03] shadow-lg hover:shadow-purple-500/20"
              id="testimonials-cta"
            >
              <span>More praise</span>
              <span className="text-sm">↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Infinite Scrolling Track */}
      <div className="relative w-screen left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] overflow-hidden py-10" id="testimonials-marquee-viewport">
        {/* Fade Out Edges Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-white dark:from-[#000000] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-white dark:from-[#000000] to-transparent z-20 pointer-events-none" />

        {/* Scrolling Strip Container */}
        <div className="flex w-[300%] md:w-[250%] lg:w-[200%] items-center animate-marquee-left" id="testimonials-marquee-track">
          {firstRowItems.map((item, index) => {
            const tiltClass = tilts[index % tilts.length];
            return (
              <div
                key={index}
                className="px-4 flex-shrink-0"
                style={{ width: "360px" }}
                id={`testimonial-card-wrapper-${index}`}
              >
                {/* Individual Card */}
                <div
                  className={`relative flex flex-col justify-between h-[320px] p-8 rounded-[28px] premium-glow-card shadow-lg transition-all duration-300 ease-out backdrop-blur-md select-none transform cursor-pointer ${tiltClass} ${hoverTilts}`}
                  id={`testimonial-card-${index}`}
                >
                  {/* Card Content & Quotes */}
                  <div>
                    {/* SVG Double Quotes matching the reference image style */}
                    <div className="text-purple-400/40 dark:text-purple-400/30 mb-4" id={`quote-icon-${index}`}>
                      <svg
                        className="h-8 w-8 fill-current"
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                      >
                        <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6c0-2.2 1.8-4 4-4V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-8c0-2.2 1.8-4 4-4V8z" />
                      </svg>
                    </div>

                    {/* Testimonial Quote body text */}
                    <p className="text-[14px] md:text-[15px] font-medium leading-relaxed text-neutral-800 dark:text-neutral-200" id={`quote-text-${index}`}>
                      "{item.quote}"
                    </p>
                  </div>

                  {/* Author / Client block at bottom left */}
                  <div className="flex items-center gap-3.5 mt-6 pt-4 border-t border-neutral-200/30 dark:border-neutral-800/30">
                    <img
                      src={item.image}
                      alt={item.author}
                      referrerPolicy="no-referrer"
                      className="h-10 w-10 rounded-full object-cover border border-neutral-200 dark:border-neutral-800 shadow-md"
                      id={`author-avatar-${index}`}
                    />
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-bold text-neutral-900 dark:text-white" id={`author-name-${index}`}>
                        {item.author}
                      </span>
                      <span className="text-[11px] text-neutral-400 uppercase tracking-widest font-semibold mt-0.5" id={`author-title-${index}`}>
                        {item.company}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};
