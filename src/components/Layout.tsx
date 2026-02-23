import { Link, Outlet, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect, lazy, Suspense } from 'react';
import { InstagramIcon, FacebookIcon, TikTokIcon } from './icons';
import ScrollToTop from './ScrollToTop';
import { usePageTracking } from '../hooks/usePageTracking';
import { dismissSplash } from '../App';

const ScatteredOrnaments = lazy(() => import('./ScatteredOrnaments'));

export default function Layout() {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  usePageTracking();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Only track scroll on desktop where the header collapses
    const mql = window.matchMedia('(min-width: 768px)');
    if (!mql.matches) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 20;
          setScrolled(prev => prev === isScrolled ? prev : isScrolled);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScrollTop = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScrollTop, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollTop);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // On non-home pages, dismiss the splash immediately on mount
  useEffect(() => {
    if (location.pathname !== '/') {
      dismissSplash();
    }
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/products', label: t.nav.products },
    { path: '/about', label: t.nav.about },
    { path: '/contact', label: t.nav.contact },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ScrollToTop />
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white md:transition-shadow md:duration-300 ${
          scrolled ? 'md:shadow-sm' : ''
        }`}
      >
        {/* Top Utilities Bar - hides on scroll (desktop) */}
        <div className={`hidden md:block border-b border-gray-100 md:transition-[transform,opacity] md:duration-300 ${
          scrolled ? '-translate-y-full opacity-0 absolute left-0 right-0' : 'translate-y-0 opacity-100'
        }`}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-14">
              {/* Left - Language Selector */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setLanguage(language === 'mk' ? 'en' : 'mk')}
                  className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span className="uppercase tracking-wide">{language}</span>
                </button>
              </div>

              {/* Center - Logo */}
              <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-3">
                <span className="w-8 h-px bg-gray-300" />
                <span className="text-xl md:text-2xl font-light tracking-[0.3em] text-gray-900">
                  sparkle.mk
                </span>
                <span className="w-8 h-px bg-gray-300" />
              </Link>

              {/* Right - Action Icons */}
              <div className="flex items-center gap-1 sm:gap-3">
                {/* Instagram */}
                <a
                  href="https://instagram.com/_sparkle.mk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/profile.php?id=61567398783026"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                  aria-label="Facebook"
                >
                  <FacebookIcon />
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@_sparkle.mk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                  aria-label="TikTok"
                >
                  <TikTokIcon />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation - Desktop */}
        <nav className="hidden md:block border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-center h-12">
              {/* Center - Nav Links */}
              <div className="flex items-center gap-10">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative text-xs tracking-[0.15em] uppercase transition-colors ${
                      isActive(link.path)
                        ? 'text-gray-900'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {link.label}
                    {isActive(link.path) && (
                      <span className="absolute -bottom-[13px] left-0 right-0 h-px bg-gray-900" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Header Bar */}
        <div className="md:hidden border-b border-gray-100">
          <div className="px-6">
            <div className="flex items-center justify-between h-14">
              {/* Left - Hamburger menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {/* Center - Logo */}
              <Link
                to="/"
                className="absolute left-1/2 transform -translate-x-1/2 text-lg font-light tracking-[0.2em] text-gray-900"
              >
                sparkle.mk
              </Link>

              {/* Right - Icons + Language */}
              <div className="flex items-center gap-1">
                <a
                  href="https://instagram.com/_sparkle.mk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:block p-2 text-gray-500 hover:text-gray-900 transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61567398783026"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:block p-2 text-gray-500 hover:text-gray-900 transition-colors"
                  aria-label="Facebook"
                >
                  <FacebookIcon />
                </a>
                <a
                  href="https://www.tiktok.com/@_sparkle.mk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:block p-2 text-gray-500 hover:text-gray-900 transition-colors"
                  aria-label="TikTok"
                >
                  <TikTokIcon />
                </a>
                <button
                  onClick={() => setLanguage(language === 'mk' ? 'en' : 'mk')}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors p-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span className="uppercase tracking-wide">{language}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-in-out grid ${
            mobileMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <nav className="bg-white border-b border-gray-100 min-h-0 overflow-hidden">
            <div className="px-6 py-4">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-3 text-sm tracking-wide uppercase transition-colors ${
                      isActive(link.path)
                        ? 'text-gray-900 bg-gray-50'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-4 px-4 pt-4 mt-2 border-t border-gray-100">
                <a href="https://instagram.com/_sparkle.mk" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-gray-900 transition-colors" aria-label="Instagram">
                  <InstagramIcon />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61567398783026" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-gray-900 transition-colors" aria-label="Facebook">
                  <FacebookIcon />
                </a>
                <a href="https://www.tiktok.com/@_sparkle.mk" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-gray-900 transition-colors" aria-label="TikTok">
                  <TikTokIcon />
                </a>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Spacer for fixed header — fixed height prevents CLS */}
      <div className="h-14 md:h-[104px]" />

      {/* Main content */}
      <main className="flex-1 relative">
        <Suspense fallback={null}>
          <ScatteredOrnaments />
        </Suspense>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-[1]" style={{ backgroundColor: '#004232' }}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-12 gap-8">
            {/* Brand */}
            <div className="md:col-span-5">
              <div className="mb-6">
                <span className="text-xl font-light tracking-[0.2em] text-white">sparkle.mk</span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed max-w-sm">
                {t.about.missionText}
              </p>

             
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3">
              <h4 className="text-xs font-medium tracking-[0.15em] uppercase text-white mb-4">
                {language === 'mk' ? 'Навигација' : 'Navigation'}
              </h4>
              <div className="space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="md:col-span-4">
              <h4 className="text-xs font-medium tracking-[0.15em] uppercase text-white mb-4">
                {t.contact.title}
              </h4>
              <p className="text-sm text-white/70 mb-4">
                {t.contact.orderInfo}
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="https://instagram.com/_sparkle.mk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-white hover:text-white/80 transition-colors"
                >
                  <InstagramIcon className="w-4 h-4 mr-2" />
                  @_sparkle.mk
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61567398783026"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-white hover:text-white/80 transition-colors"
                >
                  <FacebookIcon className="w-4 h-4 mr-2" />
                  Sparkle.mk
                </a>
                <a
                  href="https://www.tiktok.com/@_sparkle.mk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-white hover:text-white/80 transition-colors"
                >
                  <TikTokIcon className="w-4 h-4 mr-2" />
                  @_sparkle.mk
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/60">
              © 2026 Sparkle.mk. All rights reserved. · Built by{' '}
              <a href="https://www.godevlabagency.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">GoDevLab</a>
            </p>
          
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-white text-gray-600 border border-gray-200 flex items-center justify-center shadow-sm hover:text-gray-900 hover:border-gray-300 transition-all duration-300 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
