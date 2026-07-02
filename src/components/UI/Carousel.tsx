import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useCarousel } from '../../hooks/useCarousel';
import React from 'react';

interface Testimonial {
  quote: string;
  author: string;
  title: string;
  company: string;
  rating: number;
  image: string;
}

interface CarouselProps {
  items: Testimonial[];
}

export function Carousel({ items }: CarouselProps) {
  const { currentIndex, next, prev, goTo } = useCarousel({
    length: items.length,
    autoplay: true,
    interval: 6000,
  });

  const current = items[currentIndex];

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4" id="carousel">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-72 h-72 rounded-full bg-magenta/10 blur-3xl pointer-events-none" />

      <div className="min-h-[380px] sm:min-h-[300px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full text-center"
          >
            {/* Stars */}
            <div className="flex justify-center space-x-1 mb-6">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-xl sm:text-2xl md:text-3xl font-medium text-neutral-800 dark:text-neutral-100 italic leading-relaxed mb-8 max-w-3xl mx-auto">
              "{current.quote}"
            </blockquote>

            {/* Author */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <img
                src={current.image}
                alt={current.author}
                className="w-14 h-14 rounded-full object-cover border-2 border-magenta/40 shadow-md shadow-magenta/5"
                referrerPolicy="no-referrer"
              />
              <div className="text-left">
                <p className="font-semibold text-neutral-800 dark:text-neutral-100 text-base sm:text-lg">
                  {current.author}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-normal">
                  {current.title}, <span className="font-medium text-magenta">{current.company}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center space-x-4 mt-10">
        <button
          onClick={prev}
          className="p-3 rounded-full border border-neutral-200 bg-white/75 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/75 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-all cursor-pointer"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Indicator dots */}
        <div className="flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentIndex ? 'w-8 bg-magenta' : 'w-2.5 bg-neutral-300 dark:bg-neutral-700'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="p-3 rounded-full border border-neutral-200 bg-white/75 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/75 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-all cursor-pointer"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
