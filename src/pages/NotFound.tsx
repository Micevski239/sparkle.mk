import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useFadeIn';

export default function NotFound() {
  const { language } = useLanguage();
  const reveal = useScrollReveal();

  return (
    <div ref={reveal.ref} style={reveal.style} className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* 404 Number */}
        <h1 className="text-[120px] md:text-[180px] font-light text-gray-100 leading-none select-none">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-light text-gray-900 -mt-8 mb-4">
          {language === 'mk' ? 'Страницата не е пронајдена' : 'Page Not Found'}
        </h2>

        {/* Description */}
        <p className="text-gray-500 mb-8">
          {language === 'mk'
            ? 'Страницата што ја барате не постои или е преместена.'
            : 'The page you are looking for does not exist or has been moved.'}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white text-sm tracking-wide hover:bg-gray-800 transition-colors"
          >
            {language === 'mk' ? 'Почетна страница' : 'Go Home'}
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 text-sm tracking-wide hover:border-gray-400 transition-colors"
          >
            {language === 'mk' ? 'Погледни производи' : 'Browse Products'}
          </Link>
        </div>
      </div>
    </div>
  );
}
