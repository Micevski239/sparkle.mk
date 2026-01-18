import { useEffect, useState } from 'react';
import { Category } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface MobileCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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
  onClose: () => void;
  level?: number;
}

function CategoryItem({
  category,
  selectedCategory,
  onSelect,
  getTotalCount,
  onClose,
  level = 0,
}: CategoryItemProps) {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = category.subcategories && category.subcategories.length > 0;
  const isSelected = selectedCategory === category.id;
  const count = getTotalCount(category);

  const handleClick = () => {
    onSelect(category.id);
    onClose();
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={`w-full flex items-center justify-between py-3 px-4 text-left transition-colors ${
          isSelected
            ? 'bg-gray-900 text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        style={{ paddingLeft: `${16 + level * 20}px` }}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {hasChildren && (
            <button
              onClick={handleExpand}
              className={`flex-shrink-0 w-6 h-6 flex items-center justify-center transition-transform ${
                isExpanded ? 'rotate-90' : ''
              }`}
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
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
          <span className={`truncate ${level === 0 ? 'font-semibold' : ''}`}>
            {language === 'mk' ? category.name_mk : category.name_en}
          </span>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
            isSelected ? 'bg-white/20' : 'bg-gray-200 text-gray-600'
          }`}
        >
          {count}
        </span>
      </button>

      {hasChildren && isExpanded && (
        <div>
          {category.subcategories!.map((sub) => (
            <CategoryItem
              key={sub.id}
              category={sub}
              selectedCategory={selectedCategory}
              onSelect={onSelect}
              getTotalCount={getTotalCount}
              onClose={onClose}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MobileCategoryDrawer({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onSelect,
  getTotalCount,
  totalProducts,
}: MobileCategoryDrawerProps) {
  const { language, t } = useLanguage();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleAllClick = () => {
    onSelect(null);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 ease-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">
              {language === 'mk' ? 'Категории' : 'Categories'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
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
            </button>
          </div>

          {/* Categories list */}
          <div className="flex-1 overflow-y-auto">
            {/* All Categories option */}
            <button
              onClick={handleAllClick}
              className={`w-full flex items-center justify-between py-3 px-4 text-left transition-colors ${
                selectedCategory === null
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{t.products.allCategories}</span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
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
                onClose={onClose}
              />
            ))}
          </div>

          {/* Clear filters button */}
          {selectedCategory && (
            <div className="p-4 border-t">
              <button
                onClick={handleAllClick}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2"
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
            </div>
          )}
        </div>
      </div>
    </>
  );
}
