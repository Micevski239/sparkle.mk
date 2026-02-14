import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useInstagramPromo } from '../hooks/useInstagramPromo';

declare global {
    interface Window {
        instgrm?: { Embeds: { process: () => void } };
    }
}

function InstagramEmbed({ url }: { url: string }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Inject the blockquote directly into the DOM (bypasses React vDOM)
        container.innerHTML = `
            <blockquote class="instagram-media"
                data-instgrm-permalink="${url}?utm_source=ig_embed"
                data-instgrm-version="14"
                style="background:#FFF; border:0; border-radius:12px;
                       box-shadow:0 4px 24px rgba(0,0,0,0.08);
                       margin:0; max-width:540px; min-width:326px; padding:0; width:100%;">
                <a href="${url}" target="_blank"></a>
            </blockquote>
        `;

        // Load or re-trigger embed.js
        const process = () => {
            if (window.instgrm) {
                window.instgrm.Embeds.process();
            }
        };

        if (window.instgrm) {
            // Script already loaded — just re-process
            process();
        } else {
            // Remove any stale embed script first
            const old = document.querySelector('script[src*="instagram.com/embed.js"]');
            if (old) old.remove();

            const script = document.createElement('script');
            script.src = 'https://www.instagram.com/embed.js';
            script.async = true;
            script.onload = process;
            document.body.appendChild(script);
        }

        return () => {
            container.innerHTML = '';
        };
    }, [url]);

    return (
        <>
            <style>{`
                .ig-embed-container iframe {
                    border-radius: 12px !important;
                    border: none !important;
                    box-shadow: none !important;
                    margin-bottom: -88px !important;
                    clip-path: inset(0 0 110px 0 round 12px) !important;
                }
            `}</style>
            <div ref={containerRef} className="ig-embed-container w-full max-w-[540px]" style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.15)) drop-shadow(0 4px 10px rgba(0,0,0,0.08))' }} />
        </>
    );
}

export default function InstagramPromoSection() {
    const { language } = useLanguage();
    const { promo, loading } = useInstagramPromo();

    if (loading) {
        return (
            <section className="py-12 md:py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="animate-pulse space-y-4">
                            <div className="h-4 w-32 bg-gray-200 rounded" />
                            <div className="h-8 w-64 bg-gray-200 rounded" />
                            <div className="h-20 bg-gray-200 rounded" />
                            <div className="flex gap-4">
                                <div className="h-12 w-32 bg-gray-200 rounded" />
                                <div className="h-12 w-32 bg-gray-200 rounded" />
                            </div>
                        </div>
                        <div className="animate-pulse">
                            <div className="aspect-[9/16] max-h-[500px] bg-gray-200 rounded-lg" />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!promo) return null;

    const subtitle = language === 'mk' ? promo.subtitle_mk : promo.subtitle_en;
    const title = language === 'mk' ? promo.title_mk : promo.title_en;
    const description = language === 'mk' ? promo.description_mk : promo.description_en;
    const button1Text = language === 'mk' ? promo.button1_text_mk : promo.button1_text_en;
    const button2Text = language === 'mk' ? promo.button2_text_mk : promo.button2_text_en;

    return (
        <section className="py-12 md:py-20 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                    {/* Left Column - Text & Buttons */}
                    <div className="text-center md:text-left">
                        {subtitle && (
                            <p className="text-sm tracking-[0.3em] text-gray-400 uppercase mb-3">
                                {subtitle}
                            </p>
                        )}
                        {title && (
                            <h2 className="text-3xl md:text-4xl font-light tracking-wide text-gray-900 mb-4">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="text-gray-600 leading-relaxed mb-8 max-w-lg mx-auto md:mx-0">
                                {description}
                            </p>
                        )}
                        <div className="relative z-10 flex flex-wrap justify-center md:justify-start gap-4">
                            {button1Text && promo.button1_link && (
                                <Link
                                    to={promo.button1_link}
                                    className="inline-flex items-center px-6 py-3 bg-gray-900 text-white text-sm tracking-wider uppercase hover:bg-gray-800 transition-colors"
                                >
                                    {button1Text}
                                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            )}
                            {button2Text && promo.button2_link && (
                                <a
                                    href={promo.button2_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-6 py-3 border border-gray-900 text-gray-900 text-sm tracking-wider uppercase hover:bg-gray-900 hover:text-white transition-colors"
                                >
                                    {button2Text}
                                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Instagram Embed */}
                    <div className="relative z-10 flex justify-center md:justify-end">
                        <InstagramEmbed url={promo.instagram_url} />
                    </div>
                </div>
            </div>
        </section>
    );
}
