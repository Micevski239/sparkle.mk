import { Category } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const { language, t } = useLanguage();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedCategory === null
            ? 'bg-dark-green text-white'
            : 'bg-off-white-1 text-dark-green hover:bg-off-white-2'
        }`}
      >
        {t.products.allCategories}
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category.id
              ? 'bg-dark-green text-white'
              : 'bg-off-white-1 text-dark-green hover:bg-off-white-2'
          }`}
        >
          {language === 'mk' ? category.name_mk : category.name_en}
        </button>
      ))}
    </div>
  );
}
