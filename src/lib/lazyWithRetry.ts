import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

type ModuleImport<T extends ComponentType<unknown>> = Promise<{ default: T }>;

/**
 * Recovers from transient lazy-chunk load failures (usually stale cached HTML/chunks)
 * by forcing one page reload per route key.
 */
export function lazyWithRetry<T extends ComponentType<unknown>>(
  importer: () => ModuleImport<T>,
  key: string
): LazyExoticComponent<T> {
  return lazy(async () => {
    const storageKey = `lazy-retry:${key}`;
    const hasReloaded = sessionStorage.getItem(storageKey) === '1';

    try {
      const module = await importer();
      sessionStorage.removeItem(storageKey);
      return module;
    } catch (error) {
      if (!hasReloaded) {
        sessionStorage.setItem(storageKey, '1');
        window.location.reload();
        await new Promise(() => {});
      }

      throw error;
    }
  });
}
