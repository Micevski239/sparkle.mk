import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFadeIn } from '../hooks/useFadeIn';

const INSTAGRAM_URL = 'https://instagram.com/_sparkle.mk';
const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61567398783026';
const TIKTOK_URL = 'https://www.tiktok.com/@_sparkle.mk';

export default function About() {
  const { t } = useLanguage();
  const fadeIn = useFadeIn();

  const values = [
    {
      title: t.about.valueAuthenticity,
      desc: t.about.valueAuthenticityDesc,
      border: 'border-rose-400',
      icon: (
        <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
    },
    {
      title: t.about.valueCreativity,
      desc: t.about.valueCreativityDesc,
      border: 'border-violet-400',
      icon: (
        <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
        </svg>
      ),
    },
    {
      title: t.about.valueEco,
      desc: t.about.valueEcoDesc,
      border: 'border-emerald-400',
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.592L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.03a9 9 0 10-8.862 12.872M12.75 3.03a9 9 0 016.69 14.036" />
        </svg>
      ),
    },
    {
      title: t.about.valueWarmth,
      desc: t.about.valueWarmthDesc,
      border: 'border-amber-400',
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      ),
    },
    {
      title: t.about.valueMoments,
      desc: t.about.valueMomentsDesc,
      border: 'border-sky-400',
      icon: (
        <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      ),
    },
  ];

  return (
    <div ref={fadeIn.ref} className={`bg-white min-h-screen ${fadeIn.className}`}>
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900">
            {t.about.title}
          </h1>
        </div>

        <div className="space-y-16">
          {/* Intro */}
          <p className="text-lg text-gray-600 leading-relaxed">
            {t.about.content}
          </p>

          {/* Values — stacked full-width rows */}
          <section>
            <h2 className="text-2xl font-medium text-gray-900 mb-8">
              {t.about.valuesTitle}
            </h2>
            <div className="space-y-5">
              {values.map((v, i) => (
                <div key={i} className={`flex items-start gap-5 border-l-2 ${v.border} pl-6 py-4`}>
                  <div className="flex-shrink-0 mt-0.5">{v.icon}</div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      {v.title}
                    </h3>
                    <p className="text-sm text-gray-500">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Vision & Mission — side by side cards */}
          <section className="relative z-[1] bg-white">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#fef1d6]/40 rounded-2xl p-8">
                <h2 className="text-2xl font-medium text-[#073f35] mb-4">
                  {t.about.vision}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {t.about.visionText}
                </p>
              </div>
              <div className="bg-[#fef1d6]/40 rounded-2xl p-8">
                <h2 className="text-2xl font-medium text-[#073f35] mb-4">
                  {t.about.mission}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {t.about.missionText}
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center py-8 relative z-10 bg-white">
            <p className="text-lg text-gray-600 mb-8">
              {t.about.ctaText}
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <Link
                to="/products"
                className="flex items-center justify-center min-h-[56px] px-4 py-4 text-sm tracking-wider uppercase text-white transition-colors hover:opacity-80"
                style={{ backgroundColor: '#68adbb' }}
              >
                {t.about.ctaBrowse}
              </Link>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center min-h-[56px] px-4 py-4 text-sm tracking-wider uppercase text-white transition-colors hover:opacity-80"
                style={{ backgroundColor: '#d978a2' }}
              >
                {t.about.ctaInstagram}
              </a>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center min-h-[56px] px-4 py-4 text-sm tracking-wider uppercase text-white transition-colors hover:opacity-80"
                style={{ backgroundColor: '#cbc1aa' }}
              >
                {t.about.ctaFacebook}
              </a>
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center min-h-[56px] px-4 py-4 text-sm tracking-wider uppercase text-white transition-colors hover:opacity-80"
                style={{ backgroundColor: '#333' }}
              >
                {t.about.ctaTikTok}
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
