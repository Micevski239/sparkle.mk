import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { usePaginatedProducts } from '../hooks/useProducts';
import { useCategoriesWithCounts } from '../hooks/useCategories';
import { formatPrice } from '../lib/utils';
import { SortOption, ViewMode, Category } from '../types';
import CategorySidebar from '../components/products/CategorySidebar';
import MobileCategoryDrawer from '../components/products/MobileCategoryDrawer';
import ProductGridControls from '../components/products/ProductGridControls';
import LoadMoreButton from '../components/products/LoadMoreButton';

const VIEW_MODE_KEY = 'sparkle_products_view_mode';

export default function Products() {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL parameters
  const categoryParam = searchParams.get('category');
  const sortParam = (searchParams.get('sort') as SortOption) || 'on_sale';
  const searchParam = searchParams.get('search') || '';

  // Local state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [sortBy, setSortBy] = useState<SortOption>(sortParam);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(VIEW_MODE_KEY);
    return saved ? (JSON.parse(saved) as ViewMode) : 4;
  });
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Fetch categories with counts and tree structure
  const {
    categories,
    categoryTree,
    loading: categoriesLoading,
    getTotalCount,
  } = useCategoriesWithCounts();

  // Get all category IDs for a category including its subcategories
  const getCategoryIds = useCallback((categoryId: string | null): string[] => {
    if (!categoryId) return [];

    const findCategory = (cats: Category[]): Category | undefined => {
      for (const cat of cats) {
        if (cat.id === categoryId) return cat;
        if (cat.subcategories) {
          const found = findCategory(cat.subcategories);
          if (found) return found;
        }
      }
      return undefined;
    };

    const category = findCategory(categoryTree);
    if (!category) return [categoryId];

    const collectIds = (cat: Category): string[] => {
      const ids = [cat.id];
      if (cat.subcategories) {
        cat.subcategories.forEach((sub) => {
          ids.push(...collectIds(sub));
        });
      }
      return ids;
    };

    return collectIds(category);
  }, [categoryTree]);

  // Get category IDs for selected category (including subcategories)
  const categoryIds = useMemo(() => {
    return getCategoryIds(selectedCategory);
  }, [selectedCategory, getCategoryIds]);

  // Fetch products with pagination
  const {
    products,
    loading: productsLoading,
    loadingMore,
    totalCount,
    hasMore,
    loadMore,
  } = usePaginatedProducts({
    categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
    status: ['published', 'sold'],
    sortBy,
    pageSize: 12,
  });

  // Calculate total product count for "All Categories"
  const totalProducts = useMemo(() => {
    return categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0);
  }, [categories]);

  // Sync URL params with state
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  useEffect(() => {
    setSortBy(sortParam);
  }, [sortParam]);

  // Save view mode preference
  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, JSON.stringify(viewMode));
  }, [viewMode]);

  // Update URL when state changes
  const updateParams = useCallback((updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    // Find the category to get its slug for the URL
    const category = categories.find((c) => c.id === categoryId);
    updateParams({ category: category?.slug || null });
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    updateParams({ sort: sort === 'on_sale' ? null : sort });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateParams({ search: value || null });
  };

  // Find selected category by slug from URL
  useEffect(() => {
    if (categoryParam && categories.length > 0) {
      const category = categories.find((c) => c.slug === categoryParam || c.id === categoryParam);
      if (category) {
        setSelectedCategory(category.id);
      }
    }
  }, [categoryParam, categories]);

  // Filter products by search query (client-side)
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase().trim();
    return products.filter((product) => {
      const titleMk = product.title_mk.toLowerCase();
      const titleEn = product.title_en.toLowerCase();
      const descMk = (product.description_mk || '').toLowerCase();
      const descEn = (product.description_en || '').toLowerCase();
      return (
        titleMk.includes(query) ||
        titleEn.includes(query) ||
        descMk.includes(query) ||
        descEn.includes(query)
      );
    });
  }, [products, searchQuery]);

  // Get grid columns class based on view mode
  const getGridClass = () => {
    if (viewMode === 'list') {
      return 'flex flex-col gap-4';
    }
    switch (viewMode) {
      case 3:
        return 'grid grid-cols-2 md:grid-cols-3 gap-6';
      case 5:
        return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6';
      case 4:
      default:
        return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6';
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm tracking-[0.2em] text-gray-400 uppercase mb-2">
            {language === 'mk' ? 'Колекција' : 'Collection'}
          </p>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            {t.products.title}
          </h1>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={language === 'mk' ? 'Пребарај производи...' : 'Search products...'}
              className="w-full px-4 py-3 pl-12 border border-gray-200 focus:border-gray-400 focus:outline-none transition-colors"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Main content with sidebar */}
        <div className="flex gap-8">
          {/* Sidebar - Desktop only */}
          {!categoriesLoading && categoryTree.length > 0 && (
            <div className="hidden lg:block">
              <CategorySidebar
                categories={categoryTree}
                selectedCategory={selectedCategory}
                onSelect={handleCategoryChange}
                getTotalCount={getTotalCount}
                totalProducts={totalProducts}
              />
            </div>
          )}

          {/* Products area */}
          <div className="flex-1 min-w-0">
            {/* Grid controls */}
            <ProductGridControls
              totalCount={searchQuery ? filteredProducts.length : totalCount}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onOpenMobileFilter={() => setMobileDrawerOpen(true)}
            />

            {/* Products Grid */}
            {productsLoading ? (
              <div className={getGridClass()}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-100 mb-4" />
                    <div className="h-4 bg-gray-100 w-3/4 mb-2" />
                    <div className="h-4 bg-gray-100 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-gray-400">
                  {searchQuery
                    ? language === 'mk'
                      ? 'Нема резултати за пребарувањето'
                      : 'No results found'
                    : t.products.noProducts}
                </p>
              </div>
            ) : viewMode === 'list' ? (
              // List view
              <div className="flex flex-col gap-4">
                {filteredProducts.map((product) => {
                  const isSold = product.status === 'sold';
                  return (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className="group flex gap-6 p-4 border border-gray-100 hover:border-gray-200 transition-colors"
                    >
                      <div className="w-32 h-32 flex-shrink-0 bg-gray-50 overflow-hidden relative">
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
                            <svg
                              className="w-8 h-8 text-gray-200"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                        {isSold && (
                          <div className="absolute top-2 right-2 bg-gray-900 text-white text-xs px-2 py-0.5">
                            {t.products.sold}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base text-gray-900 mb-2 group-hover:text-dark-green transition-colors">
                          {language === 'mk' ? product.title_mk : product.title_en}
                        </h3>
                        {product.category && (
                          <p className="text-sm text-gray-400 mb-2">
                            {language === 'mk' ? product.category.name_mk : product.category.name_en}
                          </p>
                        )}
                        <div className={`text-sm ${isSold ? 'text-gray-400' : 'text-gray-500'}`}>
                          {product.sale_price && product.is_on_sale ? (
                            <div className="flex items-center gap-2">
                              <span className="text-red-500 font-medium">
                                {formatPrice(product.sale_price)}
                              </span>
                              <span className="line-through text-gray-400">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                          ) : (
                            formatPrice(product.price)
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              // Grid view
              <div className={getGridClass()}>
                {filteredProducts.map((product) => {
                  const isSold = product.status === 'sold';
                  return (
                    <Link key={product.id} to={`/products/${product.id}`} className="group">
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
                            <svg
                              className="w-12 h-12 text-gray-200"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                        {isSold ? (
                          <div className="absolute top-3 right-3 bg-gray-900 text-white text-xs px-3 py-1">
                            {t.products.sold}
                          </div>
                        ) : product.is_on_sale && product.sale_price ? (
                          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1">
                            {language === 'mk' ? 'Попуст' : 'Sale'}
                          </div>
                        ) : null}
                      </div>
                      <h3 className="text-sm text-gray-900 mb-1 group-hover:text-dark-green transition-colors">
                        {language === 'mk' ? product.title_mk : product.title_en}
                      </h3>
                      <div className={`text-sm ${isSold ? 'text-gray-400' : 'text-gray-500'}`}>
                        {product.sale_price && product.is_on_sale ? (
                          <div className="flex items-center gap-2">
                            <span className="text-red-500 font-medium">
                              {formatPrice(product.sale_price)}
                            </span>
                            <span className="line-through text-gray-400">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        ) : (
                          formatPrice(product.price)
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Load More button */}
            {!searchQuery && hasMore && (
              <LoadMoreButton
                currentCount={products.length}
                totalCount={totalCount}
                loading={loadingMore}
                onLoadMore={loadMore}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Category Drawer */}
      <MobileCategoryDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        categories={categoryTree}
        selectedCategory={selectedCategory}
        onSelect={handleCategoryChange}
        getTotalCount={getTotalCount}
        totalProducts={totalProducts}
      />
    </div>
  );
}
