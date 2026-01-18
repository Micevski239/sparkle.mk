export const translations = {
  mk: {
    // Navigation
    nav: {
      home: 'Почетна',
      products: 'Производи',
      about: 'За нас',
      contact: 'Контакт',
    },
    // Home page
    home: {
      heroTitle: 'Рачно изработени уникати',
      heroSubtitle: 'Свеќи, божикни декорации и декоративни предмети создадени со љубов',
      shopNow: 'Погледни ги производите',
      featuredProducts: 'Издвоени производи',
      viewAll: 'Види ги сите',
      categories: 'Категории',
      mosaicTitle: 'Sparkle.mk',
      mosaicDescription:
        'Креативна работилница од Гевгелија која создава рачно изработени подароци, декорации и свеќи. Секој производ носи уникатен дизајн и лична приказна, изработен со љубов и внимание на деталите. Совршен избор за подарок или украс кој внесува топлина и шарм во секој дом.',
      visitStoreCTA: 'ПОСЕТИ ЈА ОНЛАЈН ПРОДАВНИЦАТА',
    },
    // Products page
    products: {
      title: 'Производи',
      allCategories: 'Сите категории',
      noProducts: 'Нема производи во оваа категорија',
      sold: 'Продадено',
      filters: 'Филтри',
      clearFilters: 'Исчисти филтри',
      categories: 'Категории',
      sortOnSale: 'На попуст',
      sortNewest: 'Најнови',
      sortPriceAsc: 'Цена: Ниска до Висока',
      sortPriceDesc: 'Цена: Висока до Ниска',
      sortName: 'Име: А-Ш',
      loadMore: 'Вчитај уште',
      showing: 'Прикажани',
      of: 'од',
      productsCount: 'производи',
    },
    // Product detail
    product: {
      orderOnInstagram: 'Нарачај преку Instagram',
      description: 'Опис',
      price: 'Цена',
      status: 'Статус',
      available: 'Достапно',
      sold: 'Продадено',
      backToProducts: '← Назад кон производите',
    },
    // About page
    about: {
      title: 'За нас',
      content: 'Sparkle MK е мал бизнис посветен на создавање прекрасни рачно изработени производи. Секој предмет е направен со внимание и љубов, користејќи висококвалитетни материјали.',
      mission: 'Нашата мисија',
      missionText: 'Да донесеме искра на радост и убавина во секој дом преку нашите уникатни рачно изработени творби.',
    },
    // Contact page
    contact: {
      title: 'Контакт',
      followUs: 'Следи нè на Instagram',
      orderInfo: 'За нарачки и прашања, контактирај нè преку Instagram.',
      instagramButton: 'Посети нè на Instagram',
    },
    // Footer
    footer: {
      rights: 'Сите права задржани.',
      madeWith: 'Направено со',
    },
    // Common
    common: {
      loading: 'Вчитување...',
      error: 'Настана грешка',
      language: 'Јазик',
    },
  },
  en: {
    // Navigation
    nav: {
      home: 'Home',
      products: 'Products',
      about: 'About',
      contact: 'Contact',
    },
    // Home page
    home: {
      heroTitle: 'Handcrafted Unique Pieces',
      heroSubtitle: 'Candles, Christmas decorations, and decorative items made with love',
      shopNow: 'Browse Products',
      featuredProducts: 'Featured Products',
      viewAll: 'View All',
      categories: 'Categories',
      mosaicTitle: 'Sparkle.mk',
      mosaicDescription:
        'Creative workshop from Gevgelija crafting handmade gifts, decorations, and candles. Each piece carries a unique design and a personal story, made with love and attention to detail. The perfect choice for a gift or decor that brings warmth and charm to any home.',
      visitStoreCTA: 'VISIT ONLINE STORE',
    },
    // Products page
    products: {
      title: 'Products',
      allCategories: 'All Categories',
      noProducts: 'No products in this category',
      sold: 'Sold',
      filters: 'Filters',
      clearFilters: 'Clear filters',
      categories: 'Categories',
      sortOnSale: 'On Sale',
      sortNewest: 'Newest',
      sortPriceAsc: 'Price: Low to High',
      sortPriceDesc: 'Price: High to Low',
      sortName: 'Name: A-Z',
      loadMore: 'Load More',
      showing: 'Showing',
      of: 'of',
      productsCount: 'products',
    },
    // Product detail
    product: {
      orderOnInstagram: 'Order on Instagram',
      description: 'Description',
      price: 'Price',
      status: 'Status',
      available: 'Available',
      sold: 'Sold',
      backToProducts: '← Back to Products',
    },
    // About page
    about: {
      title: 'About Us',
      content: 'Sparkle MK is a small business dedicated to creating beautiful handcrafted products. Each item is made with attention and love, using high-quality materials.',
      mission: 'Our Mission',
      missionText: 'To bring a spark of joy and beauty to every home through our unique handmade creations.',
    },
    // Contact page
    contact: {
      title: 'Contact',
      followUs: 'Follow us on Instagram',
      orderInfo: 'For orders and inquiries, contact us through Instagram.',
      instagramButton: 'Visit us on Instagram',
    },
    // Footer
    footer: {
      rights: 'All rights reserved.',
      madeWith: 'Made with',
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      language: 'Language',
    },
  },
} as const;

export type TranslationKey = keyof typeof translations.mk;
