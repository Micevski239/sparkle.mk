import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useHomepageHeroSlides } from '../hooks/useHomepage';
import Button from './ui/Button';

export default function HeroCarousel() {
  const { language } = useLanguage();
  const { slides, loading } = useHomepageHeroSlides();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  if (loading || slides.length === 0) {
    return (
      <section className="h-[50vh] bg-beige flex items-center justify-center">
        <div className="text-dark-green">Loading...</div>
      </section>
    );
  }

  const slide = slides[currentSlide];
  const headline = language === 'mk' ? slide.headline_text_mk : slide.headline_text_en;
  const buttonText = language === 'mk' ? slide.button_text_mk : slide.button_text_en;

  return (
    <section className="relative h-[60vh] w-full overflow-hidden">
      {/* Slide Images — only render active + next to reduce image downloads */}
      <div className="relative h-full">
        {slides.map((slideItem, index) => {
          const nextSlide = (currentSlide + 1) % slides.length;
          const prevSlide = (currentSlide - 1 + slides.length) % slides.length;
          const shouldRender = index === currentSlide || index === nextSlide || index === prevSlide;
          if (!shouldRender) return null;

          return (
            <div
              key={slideItem.id}
              className={`absolute inset-0 transition-opacity duration-1000 bg-white ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="absolute inset-0 bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slideItem.image_url})`, backgroundSize: 'contain' }}
                aria-hidden
              />
              {/* Overlay for text readability */}
              <div className="absolute inset-0 bg-black/10" />
            </div>
          );
        })}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-8 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            {headline}
          </h1>
          <Link to={slide.button_link}>
            <Button size="lg" className="bg-white text-dark-green hover:bg-beige">
              {buttonText}
            </Button>
          </Link>
        </div>
      </div>

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
            aria-label="Previous slide"
          >
            <svg
              className="w-6 h-6 text-dark-green"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
            aria-label="Next slide"
          >
            <svg
              className="w-6 h-6 text-dark-green"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}
    </section>
  );
}
