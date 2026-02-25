import { lazy, Suspense, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../hooks/useProducts';
import { useHomepageHeroSlides } from '../hooks/useHomepage';
import { useScrollReveal } from '../hooks/useFadeIn';
import { formatPrice, getThumbnailUrl } from '../lib/utils';

const WelcomeSection = lazy(() => import('../components/WelcomeSection'));
const InstagramPromoSection = lazy(() => import('../components/InstagramPromoSection'));
const TestimonialsSection = lazy(() => import('../components/TestimonialsSection'));
const AboutSection = lazy(() => import('../components/AboutSection'));

export default function Home() {
  const { language } = useLanguage();

  // Scroll reveal animations for each section
  const heroReveal = useScrollReveal();
  const welcomeReveal = useScrollReveal();
  const instagramReveal = useScrollReveal();
  const testimonialsReveal = useScrollReveal();
  const featuredReveal = useScrollReveal();
  const aboutReveal = useScrollReveal();

  // Fetch published products (best sellers will be sorted first via the query)
  const { products, loading: productsLoading } = useProducts({
    status: ['published'],
    limit: 8,
  });

  const { slides, loading: slidesLoading } = useHomepageHeroSlides();

  // Dismiss the splash overlay once hero data is ready
  useEffect(() => {
    if (!slidesLoading && !productsLoading) {
      window.dispatchEvent(new Event('app:content-ready'));
    }
  }, [slidesLoading, productsLoading]);

  // Sort: best sellers first, then take first 4
  const featuredProducts = [...products]
    .sort((a, b) => (b.is_best_seller ? 1 : 0) - (a.is_best_seller ? 1 : 0))
    .slice(0, 4);

  // Get slides by position (order_index: 0 = left, 1 = top-right, 2 = bottom-right)
  const leftSlide = slides.find(s => s.order_index === 0) || slides[0];
  const topRightSlide = slides.find(s => s.order_index === 1) || slides[1];
  const bottomRightSlide = slides.find(s => s.order_index === 2) || slides[2];

  // Fallback images if no slides in database
  const defaultSlides = {
    left: {
      image: '/hero1.jpg',
      headline_mk: 'Ароматични свеќи',
      headline_en: 'Aromatic Candles',
      button_mk: 'Купи сега',
      button_en: 'Shop Now',
      link: '/products'
    },
    topRight: {
      image: '/hero2.jpg',
      headline_mk: 'Празнични подароци',
      headline_en: 'Holiday Gifts',
      button_mk: 'Разгледај',
      button_en: 'Explore',
      link: '/products'
    },
    bottomRight: {
      image: '/hero3.jpg',
      headline_mk: 'За домот',
      headline_en: 'Home Decor',
      button_mk: 'Разгледај',
      button_en: 'Explore',
      link: '/products'
    }
  };

  return (
    <div>
      {/* ============================================
          HERO SECTION - 3 Image Cards (Dynamic from Supabase)
          Left: 1 big card | Right: 2 stacked cards
          ============================================ */}
      <section ref={heroReveal.ref} style={heroReveal.style}>
        <div className="px-4 sm:px-6 lg:px-[72px] py-4 md:py-8">
          {slidesLoading ? (
            // Loading skeleton
            <div className="grid min-[700px]:grid-cols-12 gap-4 min-[700px]:gap-6 h-auto min-[700px]:h-[calc(100vh-160px)] min-h-0 min-[700px]:min-h-[500px] min-[700px]:max-h-[800px]">
              <div className="min-[700px]:col-span-7 bg-gray-100 animate-pulse" />
              <div className="min-[700px]:col-span-5 flex flex-col gap-4 min-[700px]:gap-6">
                <div className="flex-1 bg-gray-100 animate-pulse" />
                <div className="flex-1 bg-gray-100 animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="grid min-[700px]:grid-cols-12 gap-4 min-[700px]:gap-6 h-auto min-[700px]:h-[calc(100vh-160px)] min-h-0 min-[700px]:min-h-[500px] min-[700px]:max-h-[800px]">

              {/* LEFT - Big Card */}
              <Link
                to={leftSlide?.button_link || defaultSlides.left.link}
                className="min-[700px]:col-span-7 relative overflow-hidden group h-full min-h-[250px]"
              >
                <img
                  src={leftSlide?.image_url || defaultSlides.left.image}
                  alt={language === 'mk'
                    ? (leftSlide?.headline_text_mk || defaultSlides.left.headline_mk)
                    : (leftSlide?.headline_text_en || defaultSlides.left.headline_en)}
                  className="absolute inset-0 w-full h-full object-cover md:group-hover:scale-105 md:transition-transform md:duration-700"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-9 lg:p-12">
                  <p className="text-xs tracking-[0.2em] text-white/70 uppercase mb-2">
                    {language === 'mk' ? 'Нова колекција' : 'New Collection'}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
                    {language === 'mk'
                      ? (leftSlide?.headline_text_mk || defaultSlides.left.headline_mk)
                      : (leftSlide?.headline_text_en || defaultSlides.left.headline_en)}
                  </h2>
                  <span className="inline-flex items-center text-sm text-white/90 md:group-hover:text-white md:transition-colors">
                    {language === 'mk'
                      ? (leftSlide?.button_text_mk || defaultSlides.left.button_mk)
                      : (leftSlide?.button_text_en || defaultSlides.left.button_en)}
                    <svg className="w-4 h-4 ml-2 md:group-hover:translate-x-1 md:transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>

              {/* RIGHT - 2 Stacked Cards */}
              <div className="min-[700px]:col-span-5 flex flex-col gap-4 min-[700px]:gap-6">

                {/* Top Card */}
                <Link
                  to={topRightSlide?.button_link || defaultSlides.topRight.link}
                  className="flex-1 relative overflow-hidden group min-h-[180px]"
                >
                  <img
                    src={topRightSlide?.image_url || defaultSlides.topRight.image}
                    alt={language === 'mk'
                      ? (topRightSlide?.headline_text_mk || defaultSlides.topRight.headline_mk)
                      : (topRightSlide?.headline_text_en || defaultSlides.topRight.headline_en)}
                    className="absolute inset-0 w-full h-full object-cover md:group-hover:scale-105 md:transition-transform md:duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-9">
                    <p className="text-xs tracking-[0.2em] text-white/70 uppercase mb-2">
                      {language === 'mk' ? 'Подароци' : 'Gifts'}
                    </p>
                    <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                      {language === 'mk'
                        ? (topRightSlide?.headline_text_mk || defaultSlides.topRight.headline_mk)
                        : (topRightSlide?.headline_text_en || defaultSlides.topRight.headline_en)}
                    </h3>
                    <span className="inline-flex items-center text-sm text-white/90 md:group-hover:text-white md:transition-colors">
                      {language === 'mk'
                        ? (topRightSlide?.button_text_mk || defaultSlides.topRight.button_mk)
                        : (topRightSlide?.button_text_en || defaultSlides.topRight.button_en)}
                      <svg className="w-4 h-4 ml-2 md:group-hover:translate-x-1 md:transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </Link>

                {/* Bottom Card */}
                <Link
                  to={bottomRightSlide?.button_link || defaultSlides.bottomRight.link}
                  className="flex-1 relative overflow-hidden group min-h-[180px]"
                >
                  <img
                    src={bottomRightSlide?.image_url || defaultSlides.bottomRight.image}
                    alt={language === 'mk'
                      ? (bottomRightSlide?.headline_text_mk || defaultSlides.bottomRight.headline_mk)
                      : (bottomRightSlide?.headline_text_en || defaultSlides.bottomRight.headline_en)}
                    className="absolute inset-0 w-full h-full object-cover md:group-hover:scale-105 md:transition-transform md:duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-9">
                    <p className="text-xs tracking-[0.2em] text-white/70 uppercase mb-2">
                      {language === 'mk' ? 'Декорации' : 'Decorations'}
                    </p>
                    <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                      {language === 'mk'
                        ? (bottomRightSlide?.headline_text_mk || defaultSlides.bottomRight.headline_mk)
                        : (bottomRightSlide?.headline_text_en || defaultSlides.bottomRight.headline_en)}
                    </h3>
                    <span className="inline-flex items-center text-sm text-white/90 md:group-hover:text-white md:transition-colors">
                      {language === 'mk'
                        ? (bottomRightSlide?.button_text_mk || defaultSlides.bottomRight.button_mk)
                        : (bottomRightSlide?.button_text_en || defaultSlides.bottomRight.button_en)}
                      <svg className="w-4 h-4 ml-2 md:group-hover:translate-x-1 md:transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================================
          WELCOME SECTION + CATEGORY TILES
          ============================================ */}
      <div ref={welcomeReveal.ref} style={welcomeReveal.style}>
        <Suspense fallback={<div className="py-16" />}>
          <WelcomeSection />
        </Suspense>
      </div>

      {/* ============================================
          INSTAGRAM PROMO SECTION
          ============================================ */}
      <div ref={instagramReveal.ref} style={instagramReveal.style}>
        <Suspense fallback={<div className="py-16" />}>
          <InstagramPromoSection />
        </Suspense>
      </div>

      {/* ============================================
          TESTIMONIALS SECTION
          ============================================ */}
      <div ref={testimonialsReveal.ref} style={testimonialsReveal.style}>
        <Suspense fallback={<div className="py-16" />}>
          <TestimonialsSection />
        </Suspense>
      </div>

      {/* ============================================
          FEATURED PRODUCTS
          ============================================ */}
      <section ref={featuredReveal.ref} style={featuredReveal.style} className="py-12 md:py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center mb-10">
            <p className="text-sm tracking-[0.3em] text-gray-400 uppercase mb-2">
              {language === 'mk' ? 'Колекција' : 'Collection'}
            </p>
            <div className="flex items-center gap-3 md:gap-4">
              <img src="/leaf.webp" alt="" className="hidden sm:block h-6 md:h-7 w-auto opacity-80 select-none" aria-hidden="true" />
              <h2 className="text-2xl md:text-3xl font-light tracking-[0.1em] text-gray-900 uppercase">
                {language === 'mk' ? 'Издвоени производи' : 'Featured Products'}
              </h2>
              <img src="/leaf.webp" alt="" className="hidden sm:block h-6 md:h-7 w-auto opacity-80 select-none" aria-hidden="true" />
            </div>
            <Link
              to="/products"
              className="inline-flex items-center text-sm text-gray-500 md:hover:text-gray-900 group mt-5"
            >
              {language === 'mk' ? 'Види ги сите' : 'View All'}
              <svg className="w-4 h-4 ml-2 md:group-hover:translate-x-1 md:transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-100 mb-4" />
                  <div className="h-4 bg-gray-100 w-3/4 mb-2" />
                  <div className="h-4 bg-gray-100 w-1/2" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group"
                >
                  <div className="aspect-[3/4] bg-gray-50 mb-4 overflow-hidden relative">
                    {product.image_url ? (
                      <img
                        src={getThumbnailUrl(product.image_url) || product.image_url}
                        alt={language === 'mk' ? product.title_mk : product.title_en}
                        className="w-full h-full object-cover md:group-hover:scale-105 md:transition-transform md:duration-500"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = product.image_url!; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {product.is_on_sale && product.sale_price && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1">
                        {language === 'mk' ? 'Попуст' : 'Sale'}
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm text-gray-900 mb-1 md:group-hover:text-dark-green">
                    {language === 'mk' ? product.title_mk : product.title_en}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {product.sale_price && product.is_on_sale ? (
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 font-medium">{formatPrice(product.sale_price)}</span>
                        <span className="line-through text-gray-400">{formatPrice(product.price)}</span>
                      </div>
                    ) : (
                      formatPrice(product.price)
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400">
                {language === 'mk' ? 'Наскоро ќе има производи' : 'Products coming soon'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ============================================
          ABOUT SECTION
          ============================================ */}
      <div ref={aboutReveal.ref} style={aboutReveal.style}>
        <Suspense fallback={<div className="py-20" />}>
          <AboutSection />
        </Suspense>
      </div>

    </div>
  );
}
