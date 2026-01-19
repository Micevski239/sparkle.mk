import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useProduct, useProducts } from '../hooks/useProducts';
import { formatPrice } from '../lib/utils';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const { product, loading, error } = useProduct(id);

  // Fetch related products from the same category
  const { products: categoryProducts } = useProducts({
    categoryId: product?.category_id,
    status: ['published', 'sold'],
    limit: 5,
  });

  // Filter out current product and limit to 4
  const relatedProducts = useMemo(() => {
    if (!product || !categoryProducts.length) return [];
    return categoryProducts
      .filter((p) => p.id !== product.id)
      .slice(0, 4);
  }, [product, categoryProducts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">{t.common.error}</p>
          <Link to="/products" className="text-sm text-gray-900 hover:text-dark-green">
            {t.product.backToProducts}
          </Link>
        </div>
      </div>
    );
  }

  const title = language === 'mk' ? product.title_mk : product.title_en;
  const description = language === 'mk' ? product.description_mk : product.description_en;
  const categoryName = product.category
    ? language === 'mk'
      ? product.category.name_mk
      : product.category.name_en
    : null;
  const isSold = product.status === 'sold';

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back link */}
        <Link
          to="/products"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          {t.product.backToProducts}
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square bg-gray-50 overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={title}
                  className={`w-full h-full object-cover ${isSold ? 'opacity-60' : ''}`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            {isSold && (
              <div className="absolute top-4 right-4 bg-gray-900 text-white text-sm px-4 py-2">
                {t.products.sold}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {/* Category */}
            {categoryName && (
              <p className="text-sm tracking-[0.2em] text-gray-400 uppercase mb-4">
                {categoryName}
              </p>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
              {title}
            </h1>

            {/* Price */}
            <div className={`text-2xl mb-8 ${isSold ? 'text-gray-400' : 'text-gray-900'}`}>
              {product.sale_price && product.is_on_sale ? (
                <div className="flex items-center gap-3">
                  <span className="text-red-500 font-medium">{formatPrice(product.sale_price)}</span>
                  <span className="line-through text-gray-400 text-xl">{formatPrice(product.price)}</span>
                  <span className="text-sm bg-red-500 text-white px-2 py-1">
                    -{Math.round(((product.price - product.sale_price) / product.price) * 100)}%
                  </span>
                </div>
              ) : (
                formatPrice(product.price)
              )}
            </div>

            {/* Status */}
            <div className="mb-8">
              <span className={`inline-flex items-center px-3 py-1 text-sm ${
                isSold
                  ? 'bg-gray-100 text-gray-500'
                  : 'bg-green/10 text-green'
              }`}>
                {isSold ? t.product.sold : t.product.available}
              </span>
            </div>

            {/* Description */}
            {description && (
              <div className="mb-8">
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {description}
                </p>
              </div>
            )}

            {/* CTA */}
            {!isSold && (
              <div className="mt-auto pt-8 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-4">
                  {language === 'mk'
                    ? 'Заинтересирани за овој производ?'
                    : 'Interested in this product?'}
                </p>
                <a
                  href="https://instagram.com/_sparkle.mk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-4 bg-gray-900 text-white text-sm tracking-wide hover:bg-gray-800 transition-all"
                >
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                  </svg>
                  {t.product.orderOnInstagram}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-100">
            <h2 className="text-xl md:text-2xl font-light text-gray-900 mb-8">
              {language === 'mk' ? 'Слични производи' : 'Related Products'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => {
                const relatedIsSold = relatedProduct.status === 'sold';
                return (
                  <Link
                    key={relatedProduct.id}
                    to={`/products/${relatedProduct.id}`}
                    className="group"
                  >
                    <div className="aspect-square bg-gray-50 mb-4 overflow-hidden relative">
                      {relatedProduct.image_url ? (
                        <img
                          src={relatedProduct.image_url}
                          alt={language === 'mk' ? relatedProduct.title_mk : relatedProduct.title_en}
                          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                            relatedIsSold ? 'opacity-50' : ''
                          }`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {relatedIsSold ? (
                        <div className="absolute top-3 right-3 bg-gray-900 text-white text-xs px-2 py-1">
                          {t.products.sold}
                        </div>
                      ) : relatedProduct.is_on_sale && relatedProduct.sale_price ? (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1">
                          {language === 'mk' ? 'Попуст' : 'Sale'}
                        </div>
                      ) : null}
                    </div>
                    <h3 className="text-sm text-gray-900 mb-1 group-hover:text-dark-green transition-colors truncate">
                      {language === 'mk' ? relatedProduct.title_mk : relatedProduct.title_en}
                    </h3>
                    <div className={`text-sm ${relatedIsSold ? 'text-gray-400' : 'text-gray-500'}`}>
                      {relatedProduct.sale_price && relatedProduct.is_on_sale ? (
                        <div className="flex items-center gap-2">
                          <span className="text-red-500 font-medium">{formatPrice(relatedProduct.sale_price)}</span>
                          <span className="line-through text-gray-400 text-xs">{formatPrice(relatedProduct.price)}</span>
                        </div>
                      ) : (
                        formatPrice(relatedProduct.price)
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
