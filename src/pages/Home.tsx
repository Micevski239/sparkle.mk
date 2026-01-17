import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../hooks/useProducts';
import { useHomepageHeroSlides } from '../hooks/useHomepage';
import { formatPrice } from '../lib/utils';

export default function Home() {
  const { language } = useLanguage();

  // Fetch published products (best sellers will be sorted first via the query)
  const { products, loading: productsLoading } = useProducts({
    status: ['published'],
    limit: 8,
  });

  const { slides, loading: slidesLoading } = useHomepageHeroSlides();

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
    <div className="bg-white">
      {/* ============================================
          HERO SECTION - 3 Image Cards (Dynamic from Supabase)
          Left: 1 big card | Right: 2 stacked cards
          ============================================ */}
      <section className="bg-white">
        <div className="px-[72px] py-8">
          {slidesLoading ? (
            // Loading skeleton
            <div className="grid lg:grid-cols-12 gap-4 lg:gap-6 h-[calc(100vh-160px)] min-h-[500px] max-h-[800px]">
              <div className="lg:col-span-7 bg-gray-100 animate-pulse" />
              <div className="lg:col-span-5 flex flex-col gap-4 lg:gap-6">
                <div className="flex-1 bg-gray-100 animate-pulse" />
                <div className="flex-1 bg-gray-100 animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-4 lg:gap-6 h-[calc(100vh-160px)] min-h-[500px] max-h-[800px]">

              {/* LEFT - Big Card */}
              <Link
                to={leftSlide?.button_link || defaultSlides.left.link}
                className="lg:col-span-7 relative overflow-hidden group h-full"
              >
                <img
                  src={leftSlide?.image_url || defaultSlides.left.image}
                  alt={language === 'mk'
                    ? (leftSlide?.headline_text_mk || defaultSlides.left.headline_mk)
                    : (leftSlide?.headline_text_en || defaultSlides.left.headline_en)}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-12">
                  <p className="text-xs tracking-[0.2em] text-white/70 uppercase mb-2">
                    {language === 'mk' ? 'Нова колекција' : 'New Collection'}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
                    {language === 'mk'
                      ? (leftSlide?.headline_text_mk || defaultSlides.left.headline_mk)
                      : (leftSlide?.headline_text_en || defaultSlides.left.headline_en)}
                  </h2>
                  <span className="inline-flex items-center text-sm text-white/90 group-hover:text-white transition-colors">
                    {language === 'mk'
                      ? (leftSlide?.button_text_mk || defaultSlides.left.button_mk)
                      : (leftSlide?.button_text_en || defaultSlides.left.button_en)}
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>

              {/* RIGHT - 2 Stacked Cards */}
              <div className="lg:col-span-5 flex flex-col gap-4 lg:gap-6">

                {/* Top Card */}
                <Link
                  to={topRightSlide?.button_link || defaultSlides.topRight.link}
                  className="flex-1 relative overflow-hidden group min-h-0"
                >
                  <img
                    src={topRightSlide?.image_url || defaultSlides.topRight.image}
                    alt={language === 'mk'
                      ? (topRightSlide?.headline_text_mk || defaultSlides.topRight.headline_mk)
                      : (topRightSlide?.headline_text_en || defaultSlides.topRight.headline_en)}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-9">
                    <p className="text-xs tracking-[0.2em] text-white/70 uppercase mb-2">
                      {language === 'mk' ? 'Подароци' : 'Gifts'}
                    </p>
                    <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                      {language === 'mk'
                        ? (topRightSlide?.headline_text_mk || defaultSlides.topRight.headline_mk)
                        : (topRightSlide?.headline_text_en || defaultSlides.topRight.headline_en)}
                    </h3>
                    <span className="inline-flex items-center text-sm text-white/90 group-hover:text-white transition-colors">
                      {language === 'mk'
                        ? (topRightSlide?.button_text_mk || defaultSlides.topRight.button_mk)
                        : (topRightSlide?.button_text_en || defaultSlides.topRight.button_en)}
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </Link>

                {/* Bottom Card */}
                <Link
                  to={bottomRightSlide?.button_link || defaultSlides.bottomRight.link}
                  className="flex-1 relative overflow-hidden group min-h-0"
                >
                  <img
                    src={bottomRightSlide?.image_url || defaultSlides.bottomRight.image}
                    alt={language === 'mk'
                      ? (bottomRightSlide?.headline_text_mk || defaultSlides.bottomRight.headline_mk)
                      : (bottomRightSlide?.headline_text_en || defaultSlides.bottomRight.headline_en)}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-9">
                    <p className="text-xs tracking-[0.2em] text-white/70 uppercase mb-2">
                      {language === 'mk' ? 'Декорации' : 'Decorations'}
                    </p>
                    <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                      {language === 'mk'
                        ? (bottomRightSlide?.headline_text_mk || defaultSlides.bottomRight.headline_mk)
                        : (bottomRightSlide?.headline_text_en || defaultSlides.bottomRight.headline_en)}
                    </h3>
                    <span className="inline-flex items-center text-sm text-white/90 group-hover:text-white transition-colors">
                      {language === 'mk'
                        ? (bottomRightSlide?.button_text_mk || defaultSlides.bottomRight.button_mk)
                        : (bottomRightSlide?.button_text_en || defaultSlides.bottomRight.button_en)}
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          FEATURED PRODUCTS
          ============================================ */}
      <section className="py-12 md:py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center mb-10">
            <p className="text-sm tracking-[0.3em] text-gray-400 uppercase mb-2">
              {language === 'mk' ? 'Колекција' : 'Collection'}
            </p>
            <div className="flex items-center gap-3 md:gap-4">
              <img src="/leaf.png" alt="" className="h-6 md:h-7 w-auto opacity-80 select-none" aria-hidden="true" />
              <h2 className="text-2xl md:text-3xl font-light tracking-[0.1em] text-gray-900 uppercase">
                {language === 'mk' ? 'Издвоени производи' : 'Featured Products'}
              </h2>
              <img src="/leaf.png" alt="" className="h-6 md:h-7 w-auto opacity-80 select-none" aria-hidden="true" />
            </div>
            <Link
              to="/products"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors group mt-5"
            >
              {language === 'mk' ? 'Види ги сите' : 'View All'}
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-100 mb-4" />
                  <div className="h-4 bg-gray-100 w-3/4 mb-2" />
                  <div className="h-4 bg-gray-100 w-1/2" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group"
                >
                  <div className="aspect-[3/4] bg-gray-50 mb-4 overflow-hidden relative">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={language === 'mk' ? product.title_mk : product.title_en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm text-gray-900 mb-1 group-hover:text-dark-green transition-colors">
                    {language === 'mk' ? product.title_mk : product.title_en}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatPrice(product.price)}
                  </p>
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
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Single big image */}
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="/about.jpg"
                alt={language === 'mk' ? 'Рачна изработка' : 'Handcrafted'}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div>
              <p className="text-sm tracking-[0.3em] text-gray-400 uppercase mb-4">
                {language === 'mk' ? 'Нашата приказна' : 'Our Story'}
              </p>
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
                {language === 'mk' ? 'Создадено со љубов' : 'Created with Love'}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {language === 'mk'
                  ? 'Секој производ што го создаваме е единствен. Со години искуство и страст кон занаетот, правиме свеќи и декорации кои носат топлина и карактер во секој дом.'
                  : 'Every product we create is unique. With years of experience and passion for the craft, we make candles and decorations that bring warmth and character to every home.'}
              </p>
              <Link
                to="/about"
                className="inline-flex items-center px-6 py-3 border border-gray-900 text-gray-900 text-sm tracking-wider uppercase hover:bg-gray-900 hover:text-white transition-all"
              >
                {language === 'mk' ? 'Повеќе за нас' : 'Learn More'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          INSTAGRAM CTA - Full width banner
          ============================================ */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        {/* Background Image */}
        <img
          src="/instagram-bg.jpg"
          alt="Instagram"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />

        {/* Content */}
        <div className="relative h-full flex items-center justify-center px-6">
          <div className="text-center max-w-2xl">
            {/* Instagram Icon */}
            <div className="w-20 h-20 mx-auto mb-8 rounded-full border-2 border-white/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>

            {/* Text */}
            <p className="text-sm tracking-[0.3em] text-white/60 uppercase mb-4">
              {language === 'mk' ? 'Следи нè на Instagram' : 'Follow us on Instagram'}
            </p>

            <h2 className="text-4xl md:text-6xl font-light tracking-[0.15em] text-white mb-6">
              @sparkle.mk
            </h2>

            <p className="text-white/70 mb-10 max-w-md mx-auto text-lg">
              {language === 'mk'
                ? 'Погледни ги нашите најнови творби и инспирирај се за твојот дом'
                : 'See our latest creations and get inspired for your home'}
            </p>

            {/* Button */}
            <a
              href="https://instagram.com/sparkle.mk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-10 py-4 bg-white text-gray-900 text-sm tracking-wider uppercase hover:bg-white/90 transition-all group"
            >
              <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
              </svg>
              {language === 'mk' ? 'Следи нè' : 'Follow Us'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
