import { motion } from 'motion/react';
import { ArrowRight, Play, ChevronDown, Slack, Github, Figma, CreditCard, Video } from 'lucide-react';
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

const COMPANIES = [
  { name: 'Slack', icon: <Slack className="h-4.5 w-4.5 text-[#4A154B] dark:text-[#36C5F0]" /> },
  { name: 'GitHub', icon: <Github className="h-4.5 w-4.5 text-neutral-900 dark:text-neutral-100" /> },
  { name: 'Figma', icon: <Figma className="h-4.5 w-4.5 text-[#F24E1E]" /> },
  { name: 'Netflix', icon: <Play className="h-4 w-4 text-[#E50914] fill-current" /> },
  { name: 'Stripe', icon: <CreditCard className="h-4.5 w-4.5 text-[#635BFF]" /> },
  { name: 'Zoom', icon: <Video className="h-4.5 w-4.5 text-[#2D8CFF]" /> },
];

export function Hero({ data }: HeroProps) {
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
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-magenta/25 bg-magenta/5 text-xs sm:text-sm font-semibold text-magenta mb-6 md:mb-8 tracking-wide uppercase shadow-sm shadow-magenta/5 shadow-inner"
          id="hero-badge"
        >
          <span>{data.badge}</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.1] mb-4 md:mb-6 max-w-4xl"
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
          className="text-base sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl leading-relaxed mb-6 md:mb-10"
          id="hero-description"
        >
          {data.description}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-10 md:mb-16"
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
          className="w-full max-w-5xl mt-4"
          id="hero-trusted"
        >
          <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-400 dark:text-neutral-500 uppercase mb-8">
            {data.trustedText}
          </p>

          {/* Scrolling Marquee Container */}
          <div className="relative w-full overflow-hidden py-5 [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)] border-y border-neutral-100 dark:border-neutral-900/60 bg-neutral-50/10 dark:bg-neutral-950/10">
            <div className="flex whitespace-nowrap animate-marquee">
              {/* Duplicate structure to facilitate seamless continuous loop */}
              {[1, 2, 3].map((setNum) => (
                <div key={setNum} className="flex items-center space-x-14 shrink-0 pr-14">
                  {COMPANIES.map((company, idx) => (
                    <div
                      key={`${setNum}-${idx}`}
                      className="flex items-center space-x-3 text-sm sm:text-base font-black tracking-wide text-neutral-800 dark:text-neutral-200 hover:text-magenta transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/80 shadow-sm transition-transform duration-300 hover:scale-110">
                        {company.icon}
                      </div>
                      <span className="font-sans tracking-tight">{company.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Gentle Bounce Scroll Indicator */}
        <motion.button
          onClick={() => handleScrollToSection('#stats')}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="mt-10 md:mt-16 text-neutral-400 hover:text-magenta transition-colors cursor-pointer"
          aria-label="Scroll down"
          id="hero-scroll-indicator"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.button>
      </div>
    </section>
  );
}
