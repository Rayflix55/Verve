import React, { useState } from "react";
import { Sparkles, Send, Check } from "lucide-react";
import { motion } from "motion/react";

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
      title: "Product",
      links: [
        { name: "Features Overview", href: "#features" },
        { name: "Live Preview Showcase", href: "#product-showcase" },
        { name: "SaaS Integrations", href: "#integrations" },
        { name: "Pricing Options", href: "#pricing" },
        { name: "Release Changelog", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Verve", href: "#" },
        { name: "Security & Trust", href: "#" },
        { name: "Strategic Partners", href: "#" },
        { name: "Careers at Verve", href: "#" },
        { name: "Press Kit Assets", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Latest Blog", href: "#blog" },
        { name: "Frequently Asked Qs", href: "#faq" },
        { name: "Developer Docs", href: "#" },
        { name: "Uptime Health Monitor", href: "#" },
        { name: "Community Support", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Security Protocols", href: "#" },
        { name: "DPA Agreement", href: "#" },
        { name: "Compliance SOC2", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-100 dark:bg-[#070707] text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Main Grid content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          
          {/* Logo Brand Descriptor (Column 1-2) */}
          <div className="lg:col-span-2 space-y-5">
            <a href="#home" className="flex items-center gap-2 group focus:outline-none">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-[#E91E63] to-[#00BCD4] p-2 text-white shadow-md">
                <Sparkles className="h-4.5 w-4.5 fill-white/10" />
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
                Subscribe to updates
              </p>
              <form onSubmit={handleSubscribe} className="flex max-w-sm">
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2 text-xs bg-white dark:bg-black/30 border border-gray-200 dark:border-gray-900 rounded-l-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63] dark:focus:border-[#00BCD4]"
                />
                <button
                  type="submit"
                  className="px-4 bg-[#E91E63] hover:bg-[#D81B60] text-white rounded-r-xl transition-colors cursor-pointer flex items-center justify-center"
                >
                  {subscribed ? <Check className="h-4.5 w-4.5" /> : <Send className="h-4.5 w-4.5" />}
                </button>
              </form>
              {subscribed && (
                <p className="text-[10px] text-green-500 font-semibold uppercase tracking-wider">
                  Success! Subscribed securely.
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
          <p>© {new Date().getFullYear()} Verve AI, Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Trust Map</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
