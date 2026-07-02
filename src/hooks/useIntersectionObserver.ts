import { useEffect, useRef, useState } from 'react';

export function useIntersectionObserver(
  refOrOptions?: any,
  thresholdVal?: number
): any {
  // Check if first arg is a React RefObject (has 'current' property)
  const isRefPassed = refOrOptions && typeof refOrOptions === 'object' && 'current' in refOrOptions;
  
  const internalRef = useRef<HTMLElement | null>(null);
  const elementRef = isRefPassed ? refOrOptions : internalRef;
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const currentElement = elementRef.current;
    if (!currentElement) return;

    const options: IntersectionObserverInit = isRefPassed
      ? { threshold: thresholdVal ?? 0.1 }
      : (refOrOptions ?? {});

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(currentElement);

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [elementRef, refOrOptions, thresholdVal, isRefPassed]);

  if (isRefPassed) {
    return isIntersecting;
  }

  return [elementRef, isIntersecting] as const;
}
