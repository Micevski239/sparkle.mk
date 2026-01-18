import { ReactNode } from 'react';
import { SortOption, ViewMode } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ProductGridControlsProps {
  totalCount: number;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenMobileFilter: () => void;
}

const sortOptions: { value: SortOption; labelEn: string; labelMk: string }[] = [
  { value: 'on_sale', labelEn: 'On Sale', labelMk: 'На попуст' },
  { value: 'newest', labelEn: 'Newest', labelMk: 'Најнови' },
  { value: 'price_asc', labelEn: 'Price: Low to High', labelMk: 'Цена: Ниска до Висока' },
  { value: 'price_desc', labelEn: 'Price: High to Low', labelMk: 'Цена: Висока до Ниска' },
  { value: 'name', labelEn: 'Name: A-Z', labelMk: 'Име: А-Ш' },
];

const viewModes: { value: ViewMode; icon: ReactNode; label: string }[] = [
  {
    value: 3,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="3" width="5" height="8" strokeWidth="1.5" rx="1" />
        <rect x="10" y="3" width="5" height="8" strokeWidth="1.5" rx="1" />
        <rect x="17" y="3" width="4" height="8" strokeWidth="1.5" rx="1" />
        <rect x="3" y="13" width="5" height="8" strokeWidth="1.5" rx="1" />
        <rect x="10" y="13" width="5" height="8" strokeWidth="1.5" rx="1" />
        <rect x="17" y="13" width="4" height="8" strokeWidth="1.5" rx="1" />
      </svg>
    ),
    label: '3 columns',
  },
  {
    value: 4,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="3" width="4" height="8" strokeWidth="1.5" rx="1" />
        <rect x="8" y="3" width="4" height="8" strokeWidth="1.5" rx="1" />
        <rect x="13" y="3" width="4" height="8" strokeWidth="1.5" rx="1" />
        <rect x="18" y="3" width="3" height="8" strokeWidth="1.5" rx="1" />
        <rect x="3" y="13" width="4" height="8" strokeWidth="1.5" rx="1" />
        <rect x="8" y="13" width="4" height="8" strokeWidth="1.5" rx="1" />
        <rect x="13" y="13" width="4" height="8" strokeWidth="1.5" rx="1" />
        <rect x="18" y="13" width="3" height="8" strokeWidth="1.5" rx="1" />
      </svg>
    ),
    label: '4 columns',
  },
  {
    value: 5,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="2" y="3" width="3" height="8" strokeWidth="1.5" rx="1" />
        <rect x="6" y="3" width="3" height="8" strokeWidth="1.5" rx="1" />
        <rect x="10" y="3" width="3" height="8" strokeWidth="1.5" rx="1" />
        <rect x="14" y="3" width="3" height="8" strokeWidth="1.5" rx="1" />
        <rect x="18" y="3" width="4" height="8" strokeWidth="1.5" rx="1" />
        <rect x="2" y="13" width="3" height="8" strokeWidth="1.5" rx="1" />
        <rect x="6" y="13" width="3" height="8" strokeWidth="1.5" rx="1" />
        <rect x="10" y="13" width="3" height="8" strokeWidth="1.5" rx="1" />
        <rect x="14" y="13" width="3" height="8" strokeWidth="1.5" rx="1" />
        <rect x="18" y="13" width="4" height="8" strokeWidth="1.5" rx="1" />
      </svg>
    ),
    label: '5 columns',
  },
  {
    value: 'list',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="4" width="18" height="4" strokeWidth="1.5" rx="1" />
        <rect x="3" y="10" width="18" height="4" strokeWidth="1.5" rx="1" />
        <rect x="3" y="16" width="18" height="4" strokeWidth="1.5" rx="1" />
      </svg>
    ),
    label: 'List',
  },
];

export default function ProductGridControls({
  totalCount,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onOpenMobileFilter,
}: ProductGridControlsProps) {
  const { language } = useLanguage();

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      {/* Left side: Mobile filter button + Results count */}
      <div className="flex items-center gap-4">
        {/* Mobile filter button */}
        <button
          onClick={onOpenMobileFilter}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          {language === 'mk' ? 'Филтри' : 'Filters'}
        </button>

        {/* Results count */}
        <p className="text-sm text-gray-500 hidden sm:block">
          {totalCount} {language === 'mk' ? 'производи' : 'products'}
        </p>
      </div>

      {/* Right side: Sort + View mode */}
      <div className="flex items-center gap-4">
        {/* Sort dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="appearance-none bg-white border border-gray-200 rounded-md py-2 pl-3 pr-10 text-sm text-gray-700 cursor-pointer hover:border-gray-300 focus:outline-none focus:border-gray-400"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {language === 'mk' ? option.labelMk : option.labelEn}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* View mode toggle - desktop only */}
        <div className="hidden lg:flex items-center border border-gray-200 rounded-md">
          {viewModes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => onViewModeChange(mode.value)}
              className={`p-2 transition-colors ${
                viewMode === mode.value
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              } ${mode.value === 3 ? 'rounded-l-md' : ''} ${
                mode.value === 'list' ? 'rounded-r-md' : ''
              }`}
              title={mode.label}
            >
              {mode.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
