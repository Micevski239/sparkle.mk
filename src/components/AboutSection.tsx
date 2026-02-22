import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAboutStats, useAboutContent, useAboutGallery } from '../hooks/useAbout';

// Default fallback content
const defaultContent = {
    main: {
        title_en: 'Created with Love',
        title_mk: 'Создадено со љубов',
        subtitle_en: 'Our Story',
        subtitle_mk: 'Нашата приказна',
        description_en: 'Every product we create is unique. With years of experience and passion for the craft, we make candles and decorations that bring warmth and character to every home.',
        description_mk: 'Секој производ што го создаваме е единствен. Со години искуство и страст кон занаетот, правиме свеќи и декорации кои носат топлина и карактер во секој дом.',
    },
    quote: {
        title_en: 'Every piece I create carries a part of my heart. I believe handmade items bring warmth and soul to every home.',
        title_mk: 'Секој производ што го создавам носи дел од моето срце. Верувам дека рачно изработените предмети носат топлина и душа во секој дом.',
        founder_name: 'Ana',
        signature_url: null as string | null,
    },
    stats: [
        { id: 'default-1', value: '200+', label_en: 'Products', label_mk: 'Производи' },
        { id: 'default-2', value: '5+', label_en: 'Years Experience', label_mk: 'Години искуство' },
        { id: 'default-3', value: '1000+', label_en: 'Happy Customers', label_mk: 'Задоволни клиенти' },
        { id: 'default-4', value: '100%', label_en: 'Handmade', label_mk: 'Рачна изработка' },
    ],
    gallery: [
        { image_url: '/about-1.jpg', alt_en: 'Crafting process', alt_mk: 'Процес на изработка' },
        { image_url: '/about-2.jpg', alt_en: 'Natural materials', alt_mk: 'Природни материјали' },
        { image_url: '/about-3.jpg', alt_en: 'Finished products', alt_mk: 'Готови производи' },
        { image_url: '/about-4.jpg', alt_en: 'Packaging with care', alt_mk: 'Пакување со грижа' },
    ],
};

export default function AboutSection() {
    const { language } = useLanguage();
    const { stats, loading: statsLoading } = useAboutStats();
    const { content, loading: contentLoading } = useAboutContent();
    const { images, loading: galleryLoading } = useAboutGallery();

    const isLoading = statsLoading || contentLoading || galleryLoading;

    // Use fetched content or fallback to defaults
    const mainContent = content.main || defaultContent.main;
    const quoteContent = content.quote || defaultContent.quote;
    const displayStats = stats.length > 0 ? stats : defaultContent.stats;
    const galleryImages = images.length > 0 ? images : defaultContent.gallery;

    if (isLoading) {
        return (
            <section className="relative z-[1] py-20 px-6" style={{ backgroundColor: '#f9f7f4' }}>
                <div className="max-w-7xl mx-auto">
                    {/* Loading skeleton */}
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
                        {/* Gallery skeleton */}
                        <div className="max-w-md mx-auto lg:mx-0">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="aspect-square bg-gray-200 animate-pulse rounded-sm" />
                                <div className="aspect-square bg-gray-200 animate-pulse rounded-sm" />
                                <div className="aspect-square bg-gray-200 animate-pulse rounded-sm" />
                                <div className="aspect-square bg-gray-200 animate-pulse rounded-sm" />
                            </div>
                        </div>
                        {/* Content skeleton */}
                        <div className="space-y-4">
                            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
                            <div className="h-24 bg-gray-200 animate-pulse rounded" />
                            <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative z-[1] py-20 px-6" style={{ backgroundColor: '#f9f7f4' }}>
            <div className="max-w-7xl mx-auto">
                {/* Main Content Area with Gallery */}
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center mb-16">
                    {/* 4-Image Gallery - Compact 2x2 grid */}
                    <div className="max-w-md mx-auto lg:mx-0">
                        <div className="grid grid-cols-2 gap-2">
                            {/* Image 1 */}
                            <div className="aspect-square overflow-hidden rounded-sm">
                                <img
                                    src={galleryImages[0]?.image_url || '/about-1.jpg'}
                                    alt={language === 'mk'
                                        ? (galleryImages[0]?.alt_mk || 'Процес на изработка')
                                        : (galleryImages[0]?.alt_en || 'Crafting process')}
                                    className="w-full h-full object-cover md:hover:scale-105 md:transition-transform md:duration-700"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>

                            {/* Image 2 */}
                            <div className="aspect-square overflow-hidden rounded-sm">
                                <img
                                    src={galleryImages[1]?.image_url || '/about-2.jpg'}
                                    alt={language === 'mk'
                                        ? (galleryImages[1]?.alt_mk || 'Природни материјали')
                                        : (galleryImages[1]?.alt_en || 'Natural materials')}
                                    className="w-full h-full object-cover md:hover:scale-105 md:transition-transform md:duration-700"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>

                            {/* Image 3 */}
                            <div className="aspect-square overflow-hidden rounded-sm">
                                <img
                                    src={galleryImages[2]?.image_url || '/about-3.jpg'}
                                    alt={language === 'mk'
                                        ? (galleryImages[2]?.alt_mk || 'Готови производи')
                                        : (galleryImages[2]?.alt_en || 'Finished products')}
                                    className="w-full h-full object-cover md:hover:scale-105 md:transition-transform md:duration-700"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>

                            {/* Image 4 */}
                            <div className="aspect-square overflow-hidden rounded-sm">
                                <img
                                    src={galleryImages[3]?.image_url || '/about-4.jpg'}
                                    alt={language === 'mk'
                                        ? (galleryImages[3]?.alt_mk || 'Пакување со грижа')
                                        : (galleryImages[3]?.alt_en || 'Packaging with care')}
                                    className="w-full h-full object-cover md:hover:scale-105 md:transition-transform md:duration-700"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div>
                        <p className="text-sm tracking-[0.3em] text-gray-500 uppercase mb-4">
                            {language === 'mk'
                                ? (mainContent.subtitle_mk || defaultContent.main.subtitle_mk)
                                : (mainContent.subtitle_en || defaultContent.main.subtitle_en)}
                        </p>
                        <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
                            {language === 'mk'
                                ? (mainContent.title_mk || defaultContent.main.title_mk)
                                : (mainContent.title_en || defaultContent.main.title_en)}
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-8">
                            {language === 'mk'
                                ? (mainContent.description_mk || defaultContent.main.description_mk)
                                : (mainContent.description_en || defaultContent.main.description_en)}
                        </p>
                        <Link
                            to="/about"
                            className="inline-flex items-center px-6 py-3 border border-gray-900 text-gray-900 text-sm tracking-wider uppercase hover:bg-gray-900 hover:text-white transition-colors"
                        >
                            {language === 'mk' ? 'Повеќе за нас' : 'Learn More'}
                        </Link>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="bg-white/80 rounded-lg p-8 mb-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {displayStats.map((stat, index) => (
                            <div key={stat.id || index} className="text-center">
                                <div className="text-3xl md:text-4xl font-light text-gray-900 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600 uppercase tracking-wider">
                                    {language === 'mk' ? stat.label_mk : stat.label_en}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Founder Quote */}
                <div className="text-center max-w-3xl mx-auto">
                    <svg className="w-10 h-10 mx-auto mb-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <blockquote className="text-xl md:text-2xl font-light text-gray-800 italic mb-6 leading-relaxed">
                        {language === 'mk'
                            ? (quoteContent.title_mk || defaultContent.quote.title_mk)
                            : (quoteContent.title_en || defaultContent.quote.title_en)}
                    </blockquote>
                    <div className="flex flex-col items-center">
                        <span className="text-gray-600">
                            - {quoteContent.founder_name || defaultContent.quote.founder_name}, {language === 'mk' ? 'Основач' : 'Founder'}
                        </span>
                        {quoteContent.signature_url && (
                            <img
                                src={quoteContent.signature_url}
                                alt="Signature"
                                className="h-12 mt-4 opacity-70"
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
