import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
      <button
        onClick={() => setLanguage('mk')}
        className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
          language === 'mk'
            ? 'bg-white text-dark-green shadow-sm'
            : 'text-gray-500 hover:text-dark-green'
        }`}
        aria-label="Switch to Macedonian"
      >
        МК
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
          language === 'en'
            ? 'bg-white text-dark-green shadow-sm'
            : 'text-gray-500 hover:text-dark-green'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}
