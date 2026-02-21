import { useLanguage } from '../../context/LanguageContext';

interface LoadMoreButtonProps {
  currentCount: number;
  loading: boolean;
  onLoadMore: () => void;
}

export default function LoadMoreButton({
  currentCount,
  loading,
  onLoadMore,
}: LoadMoreButtonProps) {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col items-center gap-3 mt-12 relative z-[1]">
      <p className="text-sm text-gray-500">
        {language === 'mk'
          ? `Прикажани ${currentCount} производи`
          : `Showing ${currentCount} products`}
      </p>
      <button
        onClick={onLoadMore}
        disabled={loading}
        className="px-8 py-3 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {language === 'mk' ? 'Вчитување...' : 'Loading...'}
          </>
        ) : (
          language === 'mk' ? 'Вчитај уште' : 'Load More'
        )}
      </button>
    </div>
  );
}
