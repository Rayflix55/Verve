import { useEffect, useRef } from 'react';

export function useCardAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize AudioContext lazily on user interaction
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Play a ultra-subtle high-end hover tick
  const playHoverTick = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx || ctx.state === 'suspended') return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    // Clean, crisp high frequency for high-end glass touch sensation
    osc.frequency.setValueAtTime(1600, ctx.currentTime);

    // Filter to remove harsh harmonics
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, ctx.currentTime);

    // Extremely fast envelope
    gainNode.gain.setValueAtTime(0.015, ctx.currentTime); // very low volume
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  };

  // Play a reassuring, mechanical-tactile click sound
  const playClickPop = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx || ctx.state === 'suspended') return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    // Pitch sweep for a warm, organic click sensation
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.06);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    // Tactile snap envelope
    gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.07);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  };

  useEffect(() => {
    // We keep track of currently hovered cards to avoid multi-triggering from nested hover events
    const hoveredCards = new Set<Element>();

    const handlePointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const card = target.closest('.premium-glow-card');
      
      if (card) {
        if (!hoveredCards.has(card)) {
          hoveredCards.add(card);
          playHoverTick();
        }
      } else {
        // Clear references of card components that are no longer hovered
        hoveredCards.forEach((c) => {
          if (!c.contains(target)) {
            hoveredCards.delete(c);
          }
        });
      }
    };

    const handlePointerOut = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const relatedTarget = e.relatedTarget as HTMLElement;
      const card = target.closest('.premium-glow-card');

      if (card && (!relatedTarget || !card.contains(relatedTarget))) {
        hoveredCards.delete(card);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const card = target.closest('.premium-glow-card');
      if (card) {
        initAudio();
        playClickPop();
      }
    };

    // Listen to mouse/pointer events globally to cover all present & future card instances
    document.addEventListener('pointerover', handlePointerOver, { passive: true });
    document.addEventListener('pointerout', handlePointerOut, { passive: true });
    document.addEventListener('click', handleClick, { passive: true });

    // Try to unlock audio context on initial interactions
    const unlockEvents = ['pointerdown', 'keydown', 'click'];
    const unlock = () => {
      initAudio();
      unlockEvents.forEach(evt => document.removeEventListener(evt, unlock));
    };
    unlockEvents.forEach(evt => document.addEventListener(evt, unlock, { passive: true }));

    return () => {
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerout', handlePointerOut);
      document.removeEventListener('click', handleClick);
      unlockEvents.forEach(evt => document.removeEventListener(evt, unlock));
    };
  }, []);

  return { playHoverTick, playClickPop };
}
