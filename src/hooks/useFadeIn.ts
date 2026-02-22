import { useCallback, useState } from 'react';

export function useFadeIn() {
  const [visible, setVisible] = useState(false);

  const ref = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
  }, []);

  const className = `transition-opacity duration-700 ease-out ${visible ? 'opacity-100' : 'opacity-0'}`;

  return { ref, className };
}

/** Fade-in + slide-up on scroll. Delay in ms for staggering. */
export function useScrollReveal(delay = 0) {
  const [visible, setVisible] = useState(false);

  const ref = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
  }, []);

  const style: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(32px)',
    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  };

  return { ref, style };
}
