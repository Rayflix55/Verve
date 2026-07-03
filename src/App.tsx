import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { useCardAudio } from './hooks/useCardAudio';
import { ScrollProgress } from './components/UI/ScrollProgress';
import { BackToTop } from './components/UI/BackToTop';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { FeaturesOverview } from './components/FeaturesOverview';
import { ProductShowcase } from './components/ProductShowcase';
import { ExtendedFeatures } from './components/ExtendedFeatures';
import { Integrations } from './components/Integrations';
import { Pricing } from './components/Pricing';
import { Comparison } from './components/Comparison';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Blog } from './components/Blog';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { InteractiveAnimatedBackground } from './components/InteractiveAnimatedBackground';
import { LightTrail } from './components/UI/LightTrail';
import { SplashScreen } from './components/SplashScreen';

function AppContent() {
  const { content, language } = useLanguage();
  useCardAudio();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest('.premium-glow-card') as HTMLElement;
      if (card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const enrichedProductShowcase = {
    title: content.productShowcase.title,
    subtitle: content.productShowcase.description,
    description: content.productShowcase.description,
    capabilities: content.productShowcase.capabilities.map((cap, idx) => ({
      id: `cap-${idx}`,
      icon: cap.icon,
      title: cap.title,
      description: cap.description,
      screenshotPlaceholder: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80`,
      tabDetails: [
        {
          title: language === 'es' ? "General" : "Overview",
          desc: language === 'es' 
            ? `Implemente ${cap.title.toLowerCase()} para unificar los elementos de acción en tiempo real de su equipo.`
            : `Deploy ${cap.title.toLowerCase()} to unify your team's real-time action items.`
        },
        {
          title: language === 'es' ? "Configuración" : "Configuration",
          desc: language === 'es'
            ? "Personalice alertas de prioridad, frecuencia de sincronización y asignación de notificaciones con un solo clic."
            : "Customize priority alerts, sync frequency, and notification mappings with single-click ease."
        },
        {
          title: language === 'es' ? "Telemetría" : "Telemetry",
          desc: language === 'es'
            ? "Realice un seguimiento de las métricas de velocidad del equipo, rendimiento de entrega y tiempos de respuesta de integración."
            : "Track team velocity metrics, automated handoff performance, and integration response times."
        }
      ]
    }))
  };

  return (
    <div className="min-h-screen bg-white text-neutral-800 dark:bg-transparent dark:text-neutral-200 transition-colors duration-300 antialiased font-sans" id="app-root">
      {/* Futuristic Interactive Background */}
      <InteractiveAnimatedBackground />

      {/* Global Interactive Mouse Light Trail */}
      <LightTrail />

      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Global Floating Back to Top Button */}
      <BackToTop />

      {/* Sticky Header Navigation */}
      <Navigation links={content.navigation} />

      {/* Core Main Sections */}
      <main id="main-content">
        <Hero data={content.hero} />
        <Stats data={content.stats} />
        <FeaturesOverview data={content.featuresOverview} />
        <ProductShowcase data={enrichedProductShowcase} />
        <ExtendedFeatures data={content.extendedFeatures} />
        <Integrations data={content.integrations} />
        <Pricing data={content.pricing} />
        <Comparison data={content.comparison} />
        <Testimonials data={content.testimonials} />
        <FAQ data={content.faq} />
        <Blog data={content.blog} />
        <Contact data={content.contact} />
      </main>

      {/* Shared Footer block */}
      <Footer data={content.footer} companyName={content.company.name} />
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AnimatePresence mode="wait">
          {showSplash && (
            <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
          )}
        </AnimatePresence>

        {!showSplash && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <AppContent />
          </motion.div>
        )}
      </LanguageProvider>
    </ThemeProvider>
  );
}
