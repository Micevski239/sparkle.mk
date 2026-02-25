import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './context/LanguageContext';
import { supabase } from './lib/supabase';
import App from './App';
import './index.css';

// Preconnect to Supabase early so DNS/TLS is ready before first fetch
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
if (supabaseUrl) {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = supabaseUrl;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Prefetch homepage data immediately (before React renders) to cut the fetch waterfall
if (window.location.pathname === '/') {
  queryClient.prefetchQuery({
    queryKey: ['homepage-hero-slides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_hero_slides')
        .select('id,image_url,headline_text_mk,headline_text_en,button_text_mk,button_text_en,button_link,order_index')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
