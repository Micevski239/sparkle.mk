import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { formatPrice } from '../lib/utils';

export default function Products() {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);

  const { products, loading: productsLoading } = useProducts({
    categoryId: selectedCategory,
    status: ['published', 'sold'],
  });
  const { categories, loading: categoriesLoading } = useCategories();

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <p className="text-sm tracking-[0.2em] text-gray-400 uppercase mb-2">
            {language === 'mk' ? 'Колекција' : 'Collection'}
          </p>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-8">
            {t.products.title}
          </h1>

          {/* Category Filter */}
          {!categoriesLoading && categories.length > 0 && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleCategoryChange(null)}
                className={`px-4 py-2 text-sm transition-all ${
                  selectedCategory === null
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t.products.allCategories}
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 text-sm transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {language === 'mk' ? category.name_mk : category.name_en}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Products Grid */}
        {productsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-100 mb-4" />
                <div className="h-4 bg-gray-100 w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400">{t.products.noProducts}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const isSold = product.status === 'sold';
              return (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group"
                >
                  <div className="aspect-square bg-gray-50 mb-4 overflow-hidden relative">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={language === 'mk' ? product.title_mk : product.title_en}
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                          isSold ? 'opacity-50' : ''
                        }`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {isSold && (
                      <div className="absolute top-3 right-3 bg-gray-900 text-white text-xs px-3 py-1">
                        {t.products.sold}
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm text-gray-900 mb-1 group-hover:text-dark-green transition-colors">
                    {language === 'mk' ? product.title_mk : product.title_en}
                  </h3>
                  <p className={`text-sm ${isSold ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatPrice(product.price)}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
