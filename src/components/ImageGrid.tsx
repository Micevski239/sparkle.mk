import { Link } from 'react-router-dom';
import { useHomepageGridImages } from '../hooks/useHomepage';
import { useLanguage } from '../context/LanguageContext';

// Instagram handle used across the app
const INSTAGRAM_HANDLE = '_sparkle.mk';

interface ImageGridProps {
  embedded?: boolean; // when inside a white section that already has gutters
}

export default function ImageGrid({ embedded = false }: ImageGridProps) {
  const { images, loading } = useHomepageGridImages();
  const { t } = useLanguage();

  if (loading) {
    return (
      <section className="py-16 bg-off-white-1/40">
        <div className={embedded ? 'w-full' : 'w-full px-8'}>
          <div className="text-gray-600">{t.common.loading}</div>
        </div>
      </section>
    );
  }

  // Choose up to 4 images, prefer a featured one for the large slot
  const featuredImage = images.find((img) => img.is_featured) || images[0];
  const remaining = images.filter((img) => img.id !== featuredImage?.id).slice(0, 3);

  const renderImageTile = (image?: typeof images[number]) => {
    if (!image) return <div className="h-full w-full bg-gray-100" />;

    const content = (
      <div className="relative h-full w-full overflow-hidden group">
        <img
          src={image.image_url}
          alt="Mosaic image"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
      </div>
    );

    return image.link_url ? (
      <Link to={image.link_url} aria-label="Featured" className="block h-full">
        {content}
      </Link>
    ) : (
      <div className="h-full">{content}</div>
    );
  };

  return (
    <section className="my-12 md:my-14">
      <div className={embedded ? 'w-full' : 'w-full px-8'}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 auto-rows-[220px] md:auto-rows-[256px]">
          {/* Row 1: 50% + 25% + 25% */}
          <div className="relative md:col-span-2 h-full">
            {renderImageTile(featuredImage)}
          </div>
          <div className="relative h-full">
            {renderImageTile(remaining[0])}
          </div>
          <div className="relative h-full">
            {renderImageTile(remaining[1])}
          </div>

          {/* Row 2: 25% + 50% (content) + 25% (instagram) */}
          <div className="relative h-full">
            {renderImageTile(remaining[2])}
          </div>

          {/* Content tile */}
          <div className="flex h-full flex-col justify-between bg-off-white-1 p-8 md:col-span-2 overflow-hidden">
            <div>
              <h2 className="mb-3 text-2xl font-bold text-dark-green font-sans">{t.home.mosaicTitle}</h2>
              <p className="text-sm leading-relaxed text-gray-700">
                {t.home.mosaicDescription}
              </p>
            </div>
            <a
              href="/products"
              className="mt-6 inline-flex items-center gap-3 text-sm tracking-wide text-dark-green hover:text-green transition-colors"
            >
              <span className="h-px w-10 bg-dark-green" />
              {t.home.visitStoreCTA}
            </a>
          </div>

          {/* Instagram tile */}
          <a
            href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full items-center justify-center border border-off-white-2 hover:bg-off-white-1/40 transition-colors overflow-hidden"
            aria-label={t.contact.followUs}
          >
            <div className="text-center">
              <p className="mb-2 text-sm text-gray-600">{t.contact.followUs}</p>
              <h3 className="text-xl font-serif text-dark-green">@{INSTAGRAM_HANDLE}</h3>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
