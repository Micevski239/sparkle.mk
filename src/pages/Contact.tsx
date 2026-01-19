import { useLanguage } from '../context/LanguageContext';

const INSTAGRAM_HANDLE = '_sparkle.mk';

export default function Contact() {
  const { language, t } = useLanguage();

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.2em] text-gray-400 uppercase mb-4">
            {language === 'mk' ? 'Поврзи се' : 'Get in Touch'}
          </p>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900">
            {t.contact.title}
          </h1>
        </div>

        {/* Content */}
        <div className="text-center">
          <p className="text-gray-500 mb-12 max-w-md mx-auto">
            {t.contact.orderInfo}
          </p>

          {/* Instagram Card */}
          <div className="bg-gray-50 p-12 mb-8">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>

            <h2 className="text-xl font-medium text-gray-900 mb-2">
              {t.contact.followUs}
            </h2>
            <p className="text-2xl font-light text-gray-900 mb-8">
              @{INSTAGRAM_HANDLE}
            </p>

            <a
              href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-gray-900 text-white text-sm tracking-wide hover:bg-gray-800 transition-all"
            >
              {t.contact.instagramButton}
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          <p className="text-sm text-gray-400">
            {language === 'mk'
              ? 'Одговараме на сите пораки во рок од 24 часа'
              : 'We respond to all messages within 24 hours'}
          </p>
        </div>
      </div>
    </div>
  );
}
