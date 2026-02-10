import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { language, t } = useLanguage();
  const title = language === 'mk' ? product.title_mk : product.title_en;
  const isSold = product.status === 'sold';

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-off-white-1">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-off-white-2">
            <svg
              className="w-16 h-16"
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

        {/* Sale badge */}
        {product.is_on_sale && !isSold && (
          <div className="absolute top-2 right-2 bg-red-1 text-white px-3 py-1 rounded-full text-sm font-medium">
            Sale
          </div>
        )}

        {/* Sold badge */}
        {isSold && (
          <div className="absolute top-2 right-2 bg-red-1 text-white px-3 py-1 rounded-full text-sm font-medium">
            {t.products.sold}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-dark-green font-medium group-hover:text-red-1 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className={`mt-2 font-bold ${isSold ? 'text-gray-400' : 'text-green'}`}>
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
