import { useLanguage } from '../context/LanguageContext';
import { InstagramIcon, FacebookIcon, TikTokIcon } from '../components/icons';

const INSTAGRAM_HANDLE = '_sparkle.mk';
const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61567398783026';
const TIKTOK_URL = 'https://www.tiktok.com/@_sparkle.mk';

export default function Contact() {
  const { language, t } = useLanguage();

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.2em] text-gray-400 uppercase mb-4">
            {language === 'mk' ? 'Стапете во контакт' : 'Get in Touch'}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Instagram Card */}
            <div className="bg-gray-50 p-12 relative z-[1]">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <InstagramIcon className="w-10 h-10 text-gray-400" />
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
                className="inline-flex items-center px-8 py-4 text-white text-sm tracking-wide hover:opacity-80 transition-all"
                style={{ backgroundColor: '#d978a2' }}
              >
                {t.contact.instagramButton}
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Facebook Card */}
            <div className="bg-gray-50 p-12 relative z-[1]">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <FacebookIcon className="w-10 h-10 text-gray-400" />
              </div>

              <h2 className="text-xl font-medium text-gray-900 mb-2">
                {t.contact.followFacebook}
              </h2>
              <p className="text-2xl font-light text-gray-900 mb-8">
                Sparkle.mk
              </p>

              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 text-white text-sm tracking-wide hover:opacity-80 transition-all"
                style={{ backgroundColor: '#68adbb' }}
              >
                {t.contact.facebookButton}
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* TikTok Card */}
            <div className="bg-gray-50 p-12 relative z-[1]">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <TikTokIcon className="w-10 h-10 text-gray-400" />
              </div>

              <h2 className="text-xl font-medium text-gray-900 mb-2">
                {t.contact.followTikTok}
              </h2>
              <p className="text-2xl font-light text-gray-900 mb-8">
                @{INSTAGRAM_HANDLE}
              </p>

              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 text-white text-sm tracking-wide hover:opacity-80 transition-all"
                style={{ backgroundColor: '#333' }}
              >
                {t.contact.tiktokButton}
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
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
