export type ProductStatus = 'draft' | 'published' | 'sold';

export interface Category {
  id: string;
  name_mk: string;
  name_en: string;
  slug: string;
  created_at: string;
}

export interface Product {
  id: string;
  title_mk: string;
  title_en: string;
  description_mk: string | null;
  description_en: string | null;
  price: number;
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

export type Language = 'mk' | 'en';

export interface User {
  id: string;
  email: string;
}
