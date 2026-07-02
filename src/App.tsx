import { ThemeProvider } from './context/ThemeContext';
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

import content from './data/content.json';

export default function App() {
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
          title: "Overview",
          desc: `Deploy ${cap.title.toLowerCase()} to unify your team's real-time action items.`
        },
        {
          title: "Configuration",
          desc: "Customize priority alerts, sync frequency, and notification mappings with single-click ease."
        },
        {
          title: "Telemetry",
          desc: "Track team velocity metrics, automated handoff performance, and integration response times."
        }
      ]
    }))
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white text-neutral-800 dark:bg-transparent dark:text-neutral-200 transition-colors duration-300 antialiased font-sans" id="app-root">
        {/* Futuristic Interactive Background */}
        <InteractiveAnimatedBackground />

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
    </ThemeProvider>
  );
}
