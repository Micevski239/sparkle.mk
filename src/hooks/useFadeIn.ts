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
