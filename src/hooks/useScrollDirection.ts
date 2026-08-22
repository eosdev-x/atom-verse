import { useState, useEffect, useRef } from 'react';

type ScrollDirection = 'up' | 'down';

interface ScrollDirectionState {
  direction: ScrollDirection;
  isAtTop: boolean;
}

export function useScrollDirection(threshold = 10): ScrollDirectionState {
  const [direction, setDirection] = useState<ScrollDirection>('up');
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const updateScrollDirection = (): void => {
      const scrollY = window.scrollY;

      setIsAtTop(scrollY < 10);

      if (Math.abs(scrollY - lastScrollY.current) < threshold) {
        ticking.current = false;
        return;
      }

      setDirection(scrollY > lastScrollY.current ? 'down' : 'up');
      lastScrollY.current = scrollY;
      ticking.current = false;
    };

    const handleScroll = (): void => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(updateScrollDirection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return { direction, isAtTop };
}
