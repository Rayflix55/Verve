import { useState, useEffect, useCallback, useRef } from 'react';

interface UseCarouselOptions {
  length: number;
  autoplay?: boolean;
  interval?: number;
}

export function useCarousel({ length, autoplay = true, interval = 5000 }: UseCarouselOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const next = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % length);
  }, [length]);

  const prev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + length) % length);
  }, [length]);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const resetTimer = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (autoplay && length > 0) {
      resetTimer();
      autoplayTimerRef.current = setInterval(() => {
        next();
      }, interval);
    }
    return () => resetTimer();
  }, [autoplay, interval, length, next, resetTimer]);

  const handleInteraction = useCallback(() => {
    // If the user interacts, temporary stop or restart timer to avoid annoying jumps
    if (autoplay && length > 0) {
      resetTimer();
      autoplayTimerRef.current = setInterval(() => {
        next();
      }, interval);
    }
  }, [autoplay, interval, length, next, resetTimer]);

  const safeNext = () => {
    next();
    handleInteraction();
  };

  const safePrev = () => {
    prev();
    handleInteraction();
  };

  const safeGoTo = (index: number) => {
    goTo(index);
    handleInteraction();
  };

  return {
    currentIndex,
    next: safeNext,
    prev: safePrev,
    goTo: safeGoTo,
  };
}
