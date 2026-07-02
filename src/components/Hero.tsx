import { motion } from 'motion/react';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import { Button } from './UI/Button';
import { InteractiveHeroBackground } from './InteractiveHeroBackground';

interface HeroData {
  badge: string;
  headline: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  trustedText: string;
}

interface HeroProps {
  data: HeroData;
}

export function Hero({ data }: HeroProps) {
  const logos = ['FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'NEXUS', 'NETFLIX', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'NEXUS', 'NETFLIX'];

  const handleScrollToSection = (id: string) => {
    const target = document.querySelector(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen pt-28 pb-16 flex flex-col justify-center items-center overflow-hidden"
    >
      {/* Interactive Mouse-Following Particle System */}
      <InteractiveHeroBackground />

      {/* Decorative Glow Bubbles */}
      <div className="absolute top-1/4 -left-48 -z-10 w-96 h-96 rounded-full bg-magenta/15 blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 -z-10 w-96 h-96 rounded-full bg-cyan/10 blur-[120px] animate-pulse pointer-events-none" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-magenta/25 bg-magenta/5 text-xs sm:text-sm font-semibold text-magenta mb-8 tracking-wide uppercase shadow-sm shadow-magenta/5"
          id="hero-badge"
        >
          <span>{data.badge}</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.1] mb-6 max-w-4xl"
          id="hero-headline"
        >
          Smarter by design.<br />
          <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent dark:from-pink-400 dark:via-purple-400 dark:to-cyan-300 drop-shadow-[0_1px_1px_rgba(255,255,255,0.15)] dark:drop-shadow-none">
            Simplified by AI.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl leading-relaxed mb-10"
          id="hero-description"
        >
          {data.description}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16"
          id="hero-ctas"
        >
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
            icon={<ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform" />}
            onClick={() => handleScrollToSection('#contact')}
            id="hero-primary-cta"
          >
            {data.primaryCta}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
            icon={<Play className="h-4 w-4 fill-current" />}
            iconPosition="left"
            onClick={() => handleScrollToSection('#features')}
            id="hero-secondary-cta"
          >
            {data.secondaryCta}
          </Button>
        </motion.div>

        {/* Trusted By Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-4xl mt-4"
          id="hero-trusted"
        >
          <p className="text-xs font-semibold tracking-[0.2em] text-neutral-400 dark:text-neutral-500 uppercase mb-6">
            {data.trustedText}
          </p>

          {/* Scrolling Marquee Container */}
          <div className="relative w-full overflow-hidden py-4 mask-image-marquee">
            <div className="flex space-x-12 whitespace-nowrap animate-marquee">
              {logos.map((logo, idx) => (
                <span
                  key={idx}
                  className="inline-block text-sm sm:text-base font-black tracking-[0.3em] text-neutral-300 dark:text-neutral-800 hover:text-magenta transition-colors duration-300 px-4"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Gentle Bounce Scroll Indicator */}
        <motion.button
          onClick={() => handleScrollToSection('#stats')}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="mt-16 text-neutral-400 hover:text-magenta transition-colors cursor-pointer"
          aria-label="Scroll down"
          id="hero-scroll-indicator"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.button>
      </div>
    </section>
  );
}
