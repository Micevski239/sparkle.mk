import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useWelcomeTiles } from '../hooks/useHomepage';

// Fallback tiles if database is empty
const fallbackTiles = [
  {
    id: '1',
    label_en: 'Gift Ideas',
    label_mk: 'Идеи за подарок',
    image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop',
    bg_color: '#c53c3c',
    link_url: '/products',
    display_order: 0,
    is_active: true,
  },
  {
    id: '2',
    label_en: 'Home Decor',
    label_mk: 'Декорација',
    image_url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400&h=400&fit=crop',
    bg_color: '#abbf80',
    link_url: '/products',
    display_order: 1,
    is_active: true,
  },
  {
    id: '3',
    label_en: 'Kids & Babies',
    label_mk: 'Деца и бебиња',
    image_url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop',
    bg_color: '#e3ded1',
    link_url: '/products',
    display_order: 2,
    is_active: true,
  },
  {
    id: '4',
    label_en: 'Kitchen',
    label_mk: 'Кујна',
    image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    bg_color: '#e7be45',
    link_url: '/products',
    display_order: 3,
    is_active: true,
  },
];

export default function WelcomeSection() {
  const { language } = useLanguage();
  const { tiles: dbTiles, loading } = useWelcomeTiles();

  // Use database tiles if available, otherwise fallback
  const tiles = dbTiles.length > 0 ? dbTiles : fallbackTiles;

  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-14">
          <p className="text-sm tracking-[0.3em] text-gray-400 uppercase mb-2">
            {language === 'mk' ? 'Добредојдовте' : 'Welcome'}
          </p>
          <div className="flex items-center gap-3 md:gap-4">
            <img src="/leaf.png" alt="" className="h-6 md:h-7 w-auto opacity-80 select-none" aria-hidden="true" />
            <h2 className="text-2xl md:text-3xl font-light tracking-[0.1em] text-gray-900 uppercase">
              {language === 'mk' ? 'Sparkle.mk' : 'Sparkle.mk'}
            </h2>
            <img src="/leaf.png" alt="" className="h-6 md:h-7 w-auto opacity-80 select-none" aria-hidden="true" />
          </div>

          {/* Subtitle */}
          <p
            className="text-center mx-auto text-sm md:text-base mt-5"
            style={{
              fontWeight: 400,
              color: '#888888',
              maxWidth: '800px',
              lineHeight: 1.6,
            }}
          >
            {language === 'mk'
              ? 'Откријте ја нашата колекција на рачно изработени уникати - свеќи, декорации и подароци создадени со љубов и внимание на деталите. Секој производ носи уникатен дизајн и лична приказна.'
              : 'Discover our collection of handcrafted unique pieces - candles, decorations and gifts created with love and attention to detail. Each product carries a unique design and a personal story.'}
          </p>
        </div>

        {/* Tiles Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-100 mb-6" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {tiles.map((tile) => (
              <Link
                key={tile.id}
                to={tile.link_url || '/products'}
                className="group cursor-pointer"
              >
                {/* Tile Container with extra padding for label */}
                <div className="relative pb-6">
                  {/* Tile Image */}
                  <div className="w-full overflow-hidden aspect-square shadow-sm">
                    {tile.image_url ? (
                      <img
                        src={tile.image_url}
                        alt={language === 'mk' ? tile.label_mk : tile.label_en}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: tile.bg_color }}
                      >
                        <span className="text-white text-lg font-medium">
                          {language === 'mk' ? tile.label_mk : tile.label_en}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tile Label - 50% overlap */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 bottom-0 flex items-center justify-center shadow-sm text-sm md:text-base font-medium"
                    style={{
                      width: '75%',
                      height: '48px',
                      backgroundColor: tile.bg_color,
                      color: '#FFFFFF',
                    }}
                  >
                    {language === 'mk' ? tile.label_mk : tile.label_en}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
