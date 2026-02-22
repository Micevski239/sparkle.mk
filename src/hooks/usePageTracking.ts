import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../lib/analytics';

/**
 * Tracks page views on every route change.
 * Uses a ref guard to prevent double-tracking in React StrictMode.
 */
export function usePageTracking() {
  const location = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (location.pathname === lastPath.current) return;
    lastPath.current = location.pathname;
    trackPageView(location.pathname);
  }, [location.pathname]);
}
