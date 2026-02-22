import { useEffect, useRef, useState } from 'react';

export default function InstagramPromoSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    // Only load embed script when section enters viewport
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.unobserve(el);
                }
            },
            { rootMargin: '200px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!inView) return;

        // If the script already exists, remove it so it re-executes on re-mount
        const existing = document.getElementById('EmbedSocialHashtagScript');
        if (existing) existing.remove();

        const script = document.createElement('script');
        script.id = 'EmbedSocialHashtagScript';
        script.src = 'https://embedsocial.com/cdn/ht.js';
        script.async = true;
        document.head.appendChild(script);
    }, [inView]);

    return (
        <section ref={containerRef} className="py-12 md:py-20 px-6 bg-white">
            <div className="max-w-5xl mx-auto">
                {inView ? (
                    <div
                        className="embedsocial-hashtag"
                        data-ref="5cb5f0e799a75dc479c645ee87ba49ac205fcd4c"
                        style={{ contain: 'content' }}
                    />
                ) : (
                    <div className="h-64 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
                    </div>
                )}
            </div>
        </section>
    );
}
