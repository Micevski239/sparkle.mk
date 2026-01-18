import { useState } from 'react';
import { Category } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelect: (categoryId: string | null) => void;
  getTotalCount: (category: Category) => number;
  totalProducts: number;
}

interface CategoryItemProps {
  category: Category;
  selectedCategory: string | null;
  onSelect: (categoryId: string | null) => void;
  getTotalCount: (category: Category) => number;
  level?: number;
}

function CategoryItem({
  category,
  selectedCategory,
  onSelect,
  getTotalCount,
  level = 0,
}: CategoryItemProps) {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = category.subcategories && category.subcategories.length > 0;
  const isSelected = selectedCategory === category.id;
  const count = getTotalCount(category);

  const handleClick = () => {
    onSelect(category.id);
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={`w-full flex items-center justify-between py-2 px-3 text-left transition-colors rounded-md ${
          isSelected
            ? 'bg-gray-900 text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        style={{ paddingLeft: `${12 + level * 16}px` }}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {hasChildren && (
            <button
              onClick={handleExpand}
              className={`flex-shrink-0 w-5 h-5 flex items-center justify-center transition-transform ${
                isExpanded ? 'rotate-90' : ''
              }`}
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
          <span className={`truncate text-sm ${level === 0 ? 'font-semibold' : ''}`}>
            {language === 'mk' ? category.name_mk : category.name_en}
          </span>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
            isSelected ? 'bg-white/20' : 'bg-gray-200 text-gray-600'
          }`}
        >
          {count}
        </span>
      </button>

      {hasChildren && isExpanded && (
        <div className="mt-1">
          {category.subcategories!.map((sub) => (
            <CategoryItem
              key={sub.id}
              category={sub}
              selectedCategory={selectedCategory}
              onSelect={onSelect}
              getTotalCount={getTotalCount}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategorySidebar({
  categories,
  selectedCategory,
  onSelect,
  getTotalCount,
  totalProducts,
}: CategorySidebarProps) {
  const { language, t } = useLanguage();

  return (
    <div className="w-64 flex-shrink-0">
      <div className="sticky top-24">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {language === 'mk' ? 'Категории' : 'Categories'}
        </h2>

        <div className="space-y-1">
          {/* All Categories option */}
          <button
            onClick={() => onSelect(null)}
            className={`w-full flex items-center justify-between py-2 px-3 text-left transition-colors rounded-md ${
              selectedCategory === null
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-sm">{t.products.allCategories}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                selectedCategory === null
                  ? 'bg-white/20'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {totalProducts}
            </span>
          </button>

          {/* Category tree */}
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              selectedCategory={selectedCategory}
              onSelect={onSelect}
              getTotalCount={getTotalCount}
            />
          ))}
        </div>

        {/* Clear filters */}
        {selectedCategory && (
          <button
            onClick={() => onSelect(null)}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            {language === 'mk' ? 'Исчисти филтри' : 'Clear filters'}
          </button>
        )}
      </div>
    </div>
  );
}
