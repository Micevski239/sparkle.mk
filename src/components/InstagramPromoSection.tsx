import { useEffect } from 'react';

export default function InstagramPromoSection() {
    // Load embed script immediately on mount
    useEffect(() => {
        const existing = document.getElementById('EmbedSocialHashtagScript');
        if (existing) existing.remove();

        const script = document.createElement('script');
        script.id = 'EmbedSocialHashtagScript';
        script.src = 'https://embedsocial.com/cdn/ht.js';
        script.async = true;
        document.head.appendChild(script);
    }, []);

    return (
        <section className="py-12 md:py-20 px-6">
            <div className="max-w-5xl mx-auto">
                <div
                    className="embedsocial-hashtag"
                    data-ref="5cb5f0e799a75dc479c645ee87ba49ac205fcd4c"
                />
            </div>
        </section>
    );
}
