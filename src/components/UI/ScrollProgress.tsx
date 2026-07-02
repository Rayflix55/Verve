import { useScrollProgress } from '../../hooks/useScrollProgress';

export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-neutral-200 dark:bg-neutral-900 pointer-events-none" id="scroll-progress-container">
      <div
        className="h-full bg-gradient-to-r from-magenta via-cyan to-magenta transition-all duration-75 origin-left"
        style={{ width: `${progress}%` }}
        id="scroll-progress-bar"
      />
    </div>
  );
}
