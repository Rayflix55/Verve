import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionHeaderReveal } from './UI/SectionHeaderReveal';
import {
  Sparkles,
  Command,
  Search,
  CheckCircle,
  FileCheck,
  Briefcase,
  Play,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { Button } from './UI/Button';
import React, { ReactNode } from 'react';

interface TabDetail {
  title: string;
  desc: string;
}

interface CapabilityItem {
  icon: string;
  title: string;
  description: string;
  id?: string;
  tabDetails?: TabDetail[];
  screenshotPlaceholder?: string;
}

interface ProductShowcaseData {
  title: string;
  subtitle?: string;
  description?: string;
  capabilities: CapabilityItem[];
}

interface ProductShowcaseProps {
  data: ProductShowcaseData;
}

function CapabilitySkeleton() {
  return (
    <div className="w-full p-5 rounded-2xl border border-neutral-200/50 bg-white/40 dark:border-neutral-850 dark:bg-neutral-900/10 flex items-start space-x-4 animate-pulse">
      <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
      <div className="flex-grow space-y-2">
        <div className="h-4 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="h-3 w-5/6 bg-neutral-200 dark:bg-neutral-800 rounded" />
      </div>
    </div>
  );
}

function ShowcasePanelSkeleton() {
  return (
    <div className="rounded-3xl border border-neutral-200/50 bg-white dark:border-neutral-850 dark:bg-[#0c0c0c] p-5 sm:p-6.5 shadow-xl flex flex-col justify-between animate-pulse min-h-[480px]">
      <div>
        {/* Mockup Header bar skeleton */}
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900 pb-4 mb-5">
          <div className="flex items-center space-x-2">
            <div className="h-3.5 w-3.5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-3.5 w-3.5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-3.5 w-3.5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-3 w-28 bg-neutral-200 dark:bg-neutral-800 rounded ml-2" />
          </div>
          <div className="h-6 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
        </div>

        {/* Subtabs skeleton */}
        <div className="flex space-x-2 mb-5">
          <div className="h-8 w-24 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
          <div className="h-8 w-28 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
          <div className="h-8 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
        </div>

        {/* Workspace skeleton */}
        <div className="rounded-2xl bg-neutral-100 dark:bg-neutral-900/30 border border-neutral-150 dark:border-neutral-900/60 p-5 min-h-[220px] space-y-4">
          <div className="flex items-start space-x-3">
            <div className="h-3 w-3 rounded-full bg-neutral-200 dark:bg-neutral-800 mt-1.5" />
            <div className="flex-grow space-y-2">
              <div className="h-4 w-1/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
              <div className="h-3 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
            </div>
          </div>
          <div className="h-24 w-full bg-neutral-200 dark:bg-neutral-850 rounded-xl" />
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="flex items-center justify-between pt-5 border-t border-neutral-100 dark:border-neutral-900 mt-5">
        <div className="h-3 w-32 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="h-8 w-28 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
      </div>
    </div>
  );
}

export function ProductShowcase({ data }: ProductShowcaseProps) {
  const [activeCapIndex, setActiveCapIndex] = useState(0);
  const [activeTabSubIndex, setActiveTabSubIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const getTabDetailsForIndex = (index: number) => {
    const details = [
      [
        { title: 'Dynamic Columns', desc: 'Adapt Kanban board lanes instantly based on ticket priorities.' },
        { title: 'WIP Limit Alerter', desc: 'Warns managers when too many cards are active to prevent strain.' }
      ],
      [
        { title: 'Git Commit Hooks', desc: 'Automatically progress ticket lanes by using trigger words in git commits.' },
        { title: 'Auto PR Sync', desc: 'Links code reviewer assignments with relevant task boards in real time.' }
      ],
      [
        { title: 'Slack Q&A Bot', desc: 'Ask natural questions in any workspace channel and get context-rich summaries.' },
        { title: 'Backlog Synthesis', desc: 'Aggregates multiple tickets and drafts a clean high-level roadmap overview.' }
      ],
      [
        { title: 'Warning Signals', desc: 'Alert teams about potential velocity drops 2 weeks before they disrupt deadlines.' },
        { title: 'Accuracy Analytics', desc: 'Refines prediction algorithms dynamically based on prior sprint completion rates.' }
      ],
      [
        { title: 'Visual Node Graph', desc: 'Clickable layout of designs, wiki pages, and tasks in an interactive schema.' },
        { title: 'Cross-app Lookup', desc: 'One central navigation search that queries Jira, Slack, and Figma concurrently.' }
      ],
      [
        { title: 'Bank-Grade SSO', desc: 'SSO integrations with strict SAML, OIDC, and multi-factor logins.' },
        { title: 'Data Isolation', desc: 'Deploy Verve models inside your private virtual cloud (VPC) network.' }
      ]
    ];
    return details[index % details.length];
  };

  const activeCapability = data.capabilities[activeCapIndex] || data.capabilities[0];
  const activeSubTabs = activeCapability.tabDetails || getTabDetailsForIndex(activeCapIndex);
  const activeSubDetail = activeSubTabs[activeTabSubIndex] || activeSubTabs[0];

  const iconMap: Record<string, ReactNode> = {
    Command: <Command className="h-5 w-5 text-magenta" />,
    Search: <Search className="h-5 w-5 text-cyan" />,
    FileCheck: <FileCheck className="h-5 w-5 text-purple-400" />,
  };

  const handleCapabilityChange = (idx: number) => {
    setActiveCapIndex(idx);
    setActiveTabSubIndex(0); // Reset sub-tab
  };

  // Simulated Dashboard Mockup Interaction States
  const [simulatedEngineState, setSimulatedEngineState] = useState<'idle' | 'running' | 'done'>('idle');
  const [engineLogs, setEngineLogs] = useState<string[]>([]);

  const handleSimulateEngine = () => {
    if (simulatedEngineState !== 'idle') return;
    setSimulatedEngineState('running');
    setEngineLogs(['[SYSTEM] Initialising Verve Autonomous Engine...', '[SYNCHRONISER] Connecting Jira, Slack, & Linear...', '[AI Engine] Parsing priority bottlenecks...']);

    setTimeout(() => {
      setEngineLogs((prev) => [...prev, '[INTELLIGENCE] Context mapping completed successfully.', '[DECISION] Promoted NEX-401 to CRITICAL. Added to backlog.']);
    }, 1000);

    setTimeout(() => {
      setSimulatedEngineState('done');
      setEngineLogs((prev) => [...prev, '[SYSTEM] Sync completed. 4 priority conflicts automated.']);
    }, 2500);
  };

  const resetSimulation = () => {
    setSimulatedEngineState('idle');
    setEngineLogs([]);
  };

  return (
    <motion.section
      id="showcase"
      className="py-24 relative max-w-7xl mx-auto px-6"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -left-36 -z-10 w-96 h-96 rounded-full bg-magenta/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-36 -z-10 w-96 h-96 rounded-full bg-cyan/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <SectionHeaderReveal>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-5">
          {data.title}
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed">
          {data.description}
        </p>
      </SectionHeaderReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start" id="showcase-content">
        {isLoading ? (
          <>
            {/* Left Column Skeletons */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest pl-1 mb-2">
                Verve AI Engine Core Capabilities
              </h3>
              <div className="space-y-3">
                <CapabilitySkeleton />
                <CapabilitySkeleton />
                <CapabilitySkeleton />
                <CapabilitySkeleton />
              </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="lg:col-span-7">
              <ShowcasePanelSkeleton />
            </div>
          </>
        ) : (
          <>
            {/* Left Side: Capability Controller Selector */}
            <div className="lg:col-span-5 space-y-4" id="showcase-left-controls">
              <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest pl-1 mb-2">
                Verve AI Engine Core Capabilities
              </h3>

              <div className="space-y-3">
                {data.capabilities.map((cap, idx) => {
                  const isActive = activeCapIndex === idx;
                  return (
                    <button
                      key={cap.title}
                      onClick={() => handleCapabilityChange(idx)}
                      className={`w-full text-left p-5 rounded-2xl border transition-all flex items-start space-x-4 cursor-pointer ${
                        isActive
                          ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-neutral-950 shadow-lg shadow-neutral-900/5 dark:shadow-white/5'
                          : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:bg-neutral-900/40 dark:border-neutral-850 dark:text-neutral-400 dark:hover:bg-neutral-900/80'
                      }`}
                      aria-label={`Select capability ${cap.title}`}
                    >
                      <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center ${
                        isActive
                          ? 'bg-white/10 dark:bg-neutral-950/10 text-current border border-white/20 dark:border-neutral-950/25'
                          : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                      }`}>
                        {iconMap[cap.icon] || <Sparkles className="h-5 w-5" />}
                      </div>

                      <div>
                        <h4 className="font-bold text-sm sm:text-base leading-tight mb-1">
                          {cap.title}
                        </h4>
                        <p className={`text-xs font-normal leading-relaxed line-clamp-2 ${isActive ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-600 dark:text-neutral-400'}`}>
                          {cap.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Side: Interactive Showcase Panel Mockup with Sub-tabs */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 rounded-3xl border border-neutral-200/50 bg-white dark:border-neutral-850 dark:bg-[#0c0c0c] p-5 sm:p-6.5 shadow-xl flex flex-col justify-between"
              id="showcase-mockup-card"
            >
              {/* Dashboard Header Bar */}
              <div>
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900 pb-4 mb-5" id="mockup-header-bar">
                  <div className="flex items-center space-x-2">
                    <div className="h-3.5 w-3.5 rounded-full bg-red-400" />
                    <div className="h-3.5 w-3.5 rounded-full bg-yellow-400" />
                    <div className="h-3.5 w-3.5 rounded-full bg-green-400" />
                    <span className="text-xs font-mono font-medium text-neutral-400 dark:text-neutral-500 ml-2 tracking-wider">
                      engine-control-panel.verve
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-neutral-400 dark:text-neutral-500 font-medium bg-neutral-50 dark:bg-neutral-900/60 px-3 py-1 rounded-lg">
                    <Briefcase className="h-3.5 w-3.5 mr-1 text-magenta" />
                    <span>Production</span>
                  </div>
                </div>

                {/* Inner Feature Tabs Selector */}
                <div className="flex space-x-2 mb-5 overflow-x-auto pb-1.5 no-scrollbar" id="mockup-subtabs">
                  {activeSubTabs.map((sub, sIdx) => {
                    const isSubActive = activeTabSubIndex === sIdx;
                    return (
                      <button
                        key={sub.title}
                        onClick={() => setActiveTabSubIndex(sIdx)}
                        className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all cursor-pointer ${
                          isSubActive
                            ? 'bg-magenta/10 border-magenta/20 text-magenta'
                            : 'bg-neutral-50 border-transparent text-neutral-500 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-850'
                        }`}
                      >
                        {sub.title}
                      </button>
                    );
                  })}
                </div>

                {/* Simulated Workspace Playground */}
                <div className="rounded-2xl bg-neutral-50 dark:bg-[#080808]/80 border border-neutral-150 dark:border-neutral-900/60 p-5 min-h-[220px] relative flex flex-col justify-between" id="mockup-workspace">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCapIndex + '-' + activeTabSubIndex}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-3.5"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="h-2 w-2 rounded-full bg-magenta mt-1.5 animate-ping" />
                        <div>
                          <h5 className="font-bold text-sm sm:text-base text-neutral-800 dark:text-neutral-200">
                            {activeSubDetail.title}
                          </h5>
                          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-350 font-normal leading-relaxed mt-1">
                            {activeSubDetail.desc}
                          </p>
                        </div>
                      </div>

                      {/* Simulated Output Engine Console block */}
                      <div className="font-mono text-[11px] leading-relaxed p-3.5 rounded-xl bg-neutral-900 dark:bg-black text-neutral-400 space-y-1 overflow-y-auto max-h-[140px] shadow-inner">
                        {engineLogs.length === 0 ? (
                          <p className="text-neutral-500 italic">Click "Simulate Engine" below to execute autonomous workflow priority analysis.</p>
                        ) : (
                          engineLogs.map((log, lIdx) => (
                            <p key={lIdx} className={log.startsWith('[SYSTEM]') ? 'text-cyan' : log.startsWith('[AI Engine]') || log.startsWith('[INTELLIGENCE]') ? 'text-magenta' : log.startsWith('[DECISION]') ? 'text-green-400' : 'text-neutral-300'}>
                              {log}
                            </p>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Interactive Simulation Trigger */}
              <div className="flex items-center justify-between pt-5 border-t border-neutral-100 dark:border-neutral-900 mt-5 gap-4" id="mockup-interactive-actions">
                <span className="text-[11px] font-mono tracking-wider text-neutral-400 dark:text-neutral-500">
                  {simulatedEngineState === 'running' ? (
                    <span className="text-magenta flex items-center"><Zap className="h-3.5 w-3.5 mr-1.5 animate-bounce" /> ANALYSING ACTIVE METRICS...</span>
                  ) : simulatedEngineState === 'done' ? (
                    <span className="text-emerald-500 flex items-center">✓ CONFLICTS AUTOMATED</span>
                  ) : (
                    'STATUS: IDLE'
                  )}
                </span>

                <div className="flex space-x-2.5">
                  {simulatedEngineState !== 'idle' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetSimulation}
                      icon={<RotateCcw className="h-3.5 w-3.5" />}
                      id="reset-mockup-simulation"
                    >
                      Reset
                    </Button>
                  )}
                  <Button
                    variant={simulatedEngineState === 'done' ? 'outline' : 'primary'}
                    size="sm"
                    onClick={handleSimulateEngine}
                    disabled={simulatedEngineState === 'running'}
                    icon={simulatedEngineState === 'idle' ? <Play className="h-3.5 w-3.5 fill-current" /> : undefined}
                    id="trigger-mockup-simulation"
                  >
                    {simulatedEngineState === 'running' ? 'Running...' : simulatedEngineState === 'done' ? 'Sync Active' : 'Simulate Engine'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </motion.section>
  );
}
