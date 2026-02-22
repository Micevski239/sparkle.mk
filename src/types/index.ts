export type ProductStatus = 'draft' | 'published' | 'sold';

// Analytics
export interface AnalyticsSummary {
  views_today: number;
  visitors_today: number;
  views_7d: number;
  visitors_7d: number;
  views_30d: number;
  visitors_30d: number;
  views_by_day: { date: string; views: number; visitors: number }[];
  top_pages: { page_path: string; views: number; visitors: number }[];
  devices: { device: string; count: number }[];
  referrers: { source: string; count: number }[];
}

export interface Category {
  id: string;
  name_mk: string;
  name_en: string;
  slug: string;
  parent_id?: string | null;
  display_order: number;
  created_at: string;
  // UI-only fields (not in DB)
  subcategories?: Category[];
  productCount?: number;
}

export type SortOption = 'on_sale' | 'newest' | 'price_asc' | 'price_desc' | 'name';
export type ViewMode = 2 | 3 | 4 | 5 | 'list';

export interface Product {
  id: string;
  title_mk: string;
  title_en: string;
  description_mk: string | null;
  description_en: string | null;
  price: number;
  sale_price: number | null;
  image_url: string | null;
  category_id: string | null;
  status: ProductStatus;
  is_on_sale?: boolean;
  is_best_seller?: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface HomepageHeroSlide {
  id: string;
  image_url: string;
  headline_text_mk: string;
  headline_text_en: string;
  button_text_mk: string;
  button_text_en: string;
  button_link: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomepageGridImage {
  id: string;
  image_url: string;
  link_url: string | null;
  order_index: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WelcomeTile {
  id: string;
  label_en: string;
  label_mk: string;
  image_url: string | null;
  bg_color: string;
  link_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type Language = 'mk' | 'en';

export interface User {
  id: string;
  email: string;
}

// About Section Types
export interface AboutStat {
  id: string;
  value: string;
  label_en: string;
  label_mk: string;
  icon: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface AboutContent {
  id: string;
  section: 'main' | 'quote';
  title_en: string | null;
  title_mk: string | null;
  subtitle_en: string | null;
  subtitle_mk: string | null;
  description_en: string | null;
  description_mk: string | null;
  image_url: string | null;
  founder_name: string | null;
  signature_url: string | null;
  updated_at: string;
}

export interface AboutGalleryImage {
  id: string;
  image_url: string;
  alt_en: string | null;
  alt_mk: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

// Instagram Promo Types
export interface InstagramPromo {
  id: string;
  subtitle_en: string | null;
  subtitle_mk: string | null;
  title_en: string | null;
  title_mk: string | null;
  description_en: string | null;
  description_mk: string | null;
  button1_text_en: string | null;
  button1_text_mk: string | null;
  button1_link: string | null;
  button2_text_en: string | null;
  button2_text_mk: string | null;
  button2_link: string | null;
  instagram_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Testimonials Types
export interface Testimonial {
  id: string;
  customer_name: string;
  customer_photo_url: string | null;
  customer_location_en: string | null;
  customer_location_mk: string | null;
  quote_en: string;
  quote_mk: string;
  rating: 1 | 2 | 3 | 4 | 5;
  display_order: number;
  is_active: boolean;
  is_featured: boolean;
  testimonial_date: string;
  created_at: string;
  updated_at: string;
}
