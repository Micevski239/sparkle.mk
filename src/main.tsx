import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import App from './App';
import './index.css';

const GA_MEASUREMENT_ID = 'G-FSKHSFMK61';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer.push(args));
window.gtag('js', new Date());
window.gtag('config', GA_MEASUREMENT_ID);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
