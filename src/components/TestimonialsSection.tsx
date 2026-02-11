import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTestimonials } from '../hooks/useTestimonials';
import { Testimonial } from '../types';

// Default fallback testimonials
const defaultTestimonials: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>[] = [
    {
        customer_name: 'Марија',
        customer_photo_url: null,
        customer_location_en: 'Skopje',
        customer_location_mk: 'Скопје',
        quote_en: 'Beautiful candles! The scent fills our entire home with warmth.',
        quote_mk: 'Прекрасни свеќи! Мирисот го исполнува целиот дом со топлина.',
        rating: 5,
        display_order: 0,
        is_active: true,
        is_featured: false,
        testimonial_date: new Date().toISOString(),
    },
    {
        customer_name: 'Ana',
        customer_photo_url: null,
        customer_location_en: 'Bitola',
        customer_location_mk: 'Битола',
        quote_en: 'Amazing quality and beautiful packaging. Perfect for gifts!',
        quote_mk: 'Одличен квалитет и прекрасно пакување. Совршено за подарок!',
        rating: 5,
        display_order: 1,
        is_active: true,
        is_featured: false,
        testimonial_date: new Date().toISOString(),
    },
    {
        customer_name: 'Иван',
        customer_photo_url: null,
        customer_location_en: 'Ohrid',
        customer_location_mk: 'Охрид',
        quote_en: 'Excellent service and fast delivery. Highly recommended!',
        quote_mk: 'Одлична услуга и брза достава. Препорачувам!',
        rating: 4,
        display_order: 2,
        is_active: true,
        is_featured: false,
        testimonial_date: new Date().toISOString(),
    },
    {
        customer_name: 'Elena',
        customer_photo_url: null,
        customer_location_en: 'Kumanovo',
        customer_location_mk: 'Куманово',
        quote_en: 'Love the handmade quality. Each piece is unique!',
        quote_mk: 'Ја сакам рачната изработка. Секое парче е уникатно!',
        rating: 5,
        display_order: 3,
        is_active: true,
        is_featured: false,
        testimonial_date: new Date().toISOString(),
    },
];

// Star Rating Component
function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

// Testimonial Card Component
function TestimonialCard({ testimonial, language }: { testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'> & { id?: string }; language: 'en' | 'mk' }) {
    const initials = testimonial.customer_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const location = language === 'mk' ? testimonial.customer_location_mk : testimonial.customer_location_en;
    const quote = language === 'mk' ? testimonial.quote_mk : testimonial.quote_en;

    return (
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col h-full min-w-[200px] sm:min-w-[280px] max-w-[320px]">
            <StarRating rating={testimonial.rating} />

            <p className="text-gray-700 mt-4 mb-6 flex-grow text-sm leading-relaxed italic">
                "{quote}"
            </p>

            <div className="flex items-center gap-3 mt-auto">
                {testimonial.customer_photo_url ? (
                    <img
                        src={testimonial.customer_photo_url}
                        alt={testimonial.customer_name}
                        className="w-10 h-10 rounded-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium">
                        {initials}
                    </div>
                )}
                <div>
                    <p className="text-gray-900 font-medium text-sm">{testimonial.customer_name}</p>
                    {location && (
                        <p className="text-gray-500 text-xs">{location}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function TestimonialsSection() {
    const { language } = useLanguage();
    const { testimonials, loading } = useTestimonials();
    const [isPaused, setIsPaused] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    // Pause animation when section is off-screen
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { rootMargin: '100px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Use fetched testimonials or fallback to defaults
    const displayTestimonials = testimonials.length > 0
        ? testimonials
        : defaultTestimonials.map((t, i) => ({ ...t, id: `default-${i}` }));

    // Duplicate for seamless loop
    const duplicatedTestimonials = [...displayTestimonials, ...displayTestimonials];

    const cardWidth = 320 + 24; // card width + gap
    const totalWidth = displayTestimonials.length * cardWidth;

    if (loading) {
        return (
            <section className="py-16 bg-white">
                <div className="w-full">
                    <div className="flex justify-center mb-10 px-6">
                        <div className="h-8 w-64 bg-gray-200 animate-pulse rounded" />
                    </div>
                    <div className="flex gap-6 overflow-hidden px-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-gray-100 rounded-lg p-6 min-w-[280px] max-w-[320px] animate-pulse">
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <div key={s} className="w-4 h-4 bg-gray-200 rounded" />
                                    ))}
                                </div>
                                <div className="h-20 bg-gray-200 rounded mb-6" />
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                    <div>
                                        <div className="h-4 w-20 bg-gray-200 rounded mb-1" />
                                        <div className="h-3 w-16 bg-gray-200 rounded" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section ref={sectionRef} className="py-16 bg-white">
            <style>{`
                @keyframes testimonial-scroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-${totalWidth}px); }
                }
            `}</style>
            <div className="w-full">
                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-10 px-6">
                    <div className="flex items-center gap-3 md:gap-4">
                        <span className="text-gray-400">&#10022;</span>
                        <h2 className="text-2xl md:text-3xl font-light tracking-wide text-gray-900 uppercase">
                            {language === 'mk' ? 'Што велат нашите клиенти' : 'What Our Customers Say'}
                        </h2>
                        <span className="text-gray-400">&#10022;</span>
                    </div>
                </div>

                {/* Carousel Container */}
                <div
                    className="relative px-4 sm:px-6 overflow-hidden"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Scrolling Container - CSS animation driven */}
                    <div
                        className="flex gap-4 sm:gap-6 pb-4"
                        style={{
                            animation: `testimonial-scroll ${displayTestimonials.length * 8}s linear infinite`,
                            animationPlayState: isPaused || !isVisible ? 'paused' : 'running',
                            width: 'max-content',
                        }}
                    >
                        {duplicatedTestimonials.map((testimonial, index) => (
                            <div key={`${testimonial.id || index}-${index}`} className="flex-shrink-0">
                                <TestimonialCard
                                    testimonial={testimonial}
                                    language={language}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Gradient Edges */}
                    <div className="absolute top-0 left-0 bottom-4 w-6 sm:w-16 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                    <div className="absolute top-0 right-0 bottom-4 w-6 sm:w-16 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                </div>
            </div>
        </section>
    );
}
