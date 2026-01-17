import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { language, t } = useLanguage();

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <div className="mb-16">
          <p className="text-sm tracking-[0.2em] text-gray-400 uppercase mb-4">
            {language === 'mk' ? 'Нашата приказна' : 'Our Story'}
          </p>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900">
            {t.about.title}
          </h1>
        </div>

        {/* Content */}
        <div className="space-y-12">
          <p className="text-lg text-gray-600 leading-relaxed">
            {t.about.content}
          </p>

          {/* Mission */}
          <div className="border-l-2 border-gray-200 pl-8">
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              {t.about.mission}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t.about.missionText}
            </p>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-3 gap-8 pt-8">
            <div>
              <div className="w-10 h-10 mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                {language === 'mk' ? 'Со љубов' : 'Made with Love'}
              </h3>
              <p className="text-sm text-gray-500">
                {language === 'mk'
                  ? 'Секој производ е направен со грижа и внимание'
                  : 'Every product is made with care and attention'}
              </p>
            </div>

            <div>
              <div className="w-10 h-10 mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                {language === 'mk' ? 'Уникатност' : 'Unique'}
              </h3>
              <p className="text-sm text-gray-500">
                {language === 'mk'
                  ? 'Секој производ е единствен и оригинален'
                  : 'Each product is one-of-a-kind and original'}
              </p>
            </div>

            <div>
              <div className="w-10 h-10 mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                {language === 'mk' ? 'Квалитет' : 'Quality'}
              </h3>
              <p className="text-sm text-gray-500">
                {language === 'mk'
                  ? 'Користиме само висококвалитетни материјали'
                  : 'We use only high-quality materials'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
