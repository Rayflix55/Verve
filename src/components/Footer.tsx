import React, { useState } from "react";
import { Send, Check } from "lucide-react";
import { motion } from "motion/react";
import { Logo } from "./Logo";
import { useLanguage } from "../context/LanguageContext";

interface FooterProps {
  data: {
    logo: string;
    description: string;
    socials: {
      twitter: string;
      github: string;
      instagram: string;
      facebook: string;
    };
  };
}

export const Footer: React.FC<FooterProps> = ({ data }) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { language } = useLanguage();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => {
      setSubscribed(false);
    }, 4000);
  };

  const columns = [
    {
      title: language === 'es' ? "Producto" : "Product",
      links: [
        { name: language === 'es' ? "Resumen de Funciones" : "Features Overview", href: "#features" },
        { name: language === 'es' ? "Demostración en Vivo" : "Live Preview Showcase", href: "#product-showcase" },
        { name: language === 'es' ? "Integraciones SaaS" : "SaaS Integrations", href: "#integrations" },
        { name: language === 'es' ? "Opciones de Precios" : "Pricing Options", href: "#pricing" },
        { name: language === 'es' ? "Registro de Cambios" : "Release Changelog", href: "#" },
      ],
    },
    {
      title: language === 'es' ? "Compañía" : "Company",
      links: [
        { name: language === 'es' ? "Sobre Verve" : "About Verve", href: "#" },
        { name: language === 'es' ? "Seguridad y Confianza" : "Security & Trust", href: "#" },
        { name: language === 'es' ? "Socios Estratégicos" : "Strategic Partners", href: "#" },
        { name: language === 'es' ? "Carreras en Verve" : "Careers at Verve", href: "#" },
        { name: language === 'es' ? "Kit de Prensa" : "Press Kit Assets", href: "#" },
      ],
    },
    {
      title: language === 'es' ? "Recursos" : "Resources",
      links: [
        { name: language === 'es' ? "Último Blog" : "Latest Blog", href: "#blog" },
        { name: language === 'es' ? "Preguntas Frecuentes" : "Frequently Asked Qs", href: "#faq" },
        { name: language === 'es' ? "Documentación" : "Developer Docs", href: "#" },
        { name: language === 'es' ? "Estado del Servicio" : "Uptime Health Monitor", href: "#" },
        { name: language === 'es' ? "Soporte de la Comunidad" : "Community Support", href: "#" },
      ],
    },
    {
      title: language === 'es' ? "Legal" : "Legal",
      links: [
        { name: language === 'es' ? "Política de Privacidad" : "Privacy Policy", href: "#" },
        { name: language === 'es' ? "Términos de Servicio" : "Terms of Service", href: "#" },
        { name: language === 'es' ? "Protocolos de Seguridad" : "Security Protocols", href: "#" },
        { name: language === 'es' ? "Acuerdo DPA" : "DPA Agreement", href: "#" },
        { name: language === 'es' ? "Cumplimiento SOC2" : "Compliance SOC2", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-neutral-50/40 dark:bg-neutral-950/40 text-gray-600 dark:text-gray-400 border-t border-white/45 dark:border-white/5 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Main Grid content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          
          {/* Logo Brand Descriptor (Column 1-2) */}
          <div className="lg:col-span-2 space-y-5">
            <a href="#home" className="flex items-center gap-2.5 group focus:outline-none">
              <div className="flex h-10 w-10 items-center justify-center">
                <Logo className="h-9 w-9" />
              </div>
              <span className="font-sans font-extrabold text-lg tracking-tight text-gray-900 dark:text-white">
                {data.logo}
              </span>
            </a>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
              {data.description}
            </p>
            
            {/* Newsletter Subscription */}
            <div className="space-y-2 pt-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {language === 'es' ? "Suscríbase a las actualizaciones" : "Subscribe to updates"}
              </p>
              <form onSubmit={handleSubscribe} className="flex max-w-sm">
                <input
                  type="email"
                  placeholder={language === 'es' ? "nombre@empresa.com" : "name@company.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2 text-xs bg-white/40 dark:bg-neutral-900/40 border border-white/50 dark:border-white/10 rounded-l-xl text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-magenta/35"
                />
                <button
                  type="submit"
                  className="px-4 bg-[#E91E63] hover:bg-[#D81B60] text-white rounded-r-xl border border-l-0 border-white/50 dark:border-white/10 transition-colors cursor-pointer flex items-center justify-center relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                  {subscribed ? <Check className="h-4.5 w-4.5" /> : <Send className="h-4.5 w-4.5" />}
                </button>
              </form>
              {subscribed && (
                <p className="text-[10px] text-green-500 font-semibold uppercase tracking-wider">
                  {language === 'es' ? "¡Éxito! Suscrito de forma segura." : "Success! Subscribed securely."}
                </p>
              )}
            </div>
          </div>

          {/* Links Columns (Columns 3-6) */}
          {columns.map((col, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a
                      href={link.href}
                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-[#E91E63] dark:hover:text-[#00BCD4] transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom copyright segment */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-900/60 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Verve AI, Inc. {language === 'es' ? "Todos los derechos reservados." : "All rights reserved."}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">{language === 'es' ? "Privacidad" : "Privacy"}</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">{language === 'es' ? "Términos" : "Terms"}</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">{language === 'es' ? "Mapa de Confianza" : "Trust Map"}</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
