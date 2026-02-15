import { useEffect, useRef } from 'react';

export default function InstagramPromoSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only load the script once
        if (document.getElementById('EmbedSocialHashtagScript')) return;

        const script = document.createElement('script');
        script.id = 'EmbedSocialHashtagScript';
        script.src = 'https://embedsocial.com/cdn/ht.js';
        document.head.appendChild(script);
    }, []);

    return (
        <section className="py-12 md:py-20 px-6 bg-white">
            <div className="max-w-5xl mx-auto">
                <div
                    ref={containerRef}
                    className="embedsocial-hashtag"
                    data-ref="5cb5f0e799a75dc479c645ee87ba49ac205fcd4c"
                />
            </div>
        </section>
    );
}
