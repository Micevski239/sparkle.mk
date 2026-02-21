-- Sparkle MK Database Schema
--
-- SECURITY: Before deploying, you MUST disable public signup in:
--   Supabase Dashboard > Authentication > Settings > "Enable sign ups" → OFF
--
-- All "admin" RLS policies use auth.role() = 'authenticated'. If public signup
-- is left enabled, ANY user who signs up gets full write access to all tables.
-- For a single-admin app, disabling signup is the simplest fix. For multi-admin,
-- replace auth.role() = 'authenticated' with:
--   auth.uid() IN (SELECT id FROM admin_users)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_mk TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_mk TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_mk TEXT,
  description_en TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  sale_price NUMERIC(10, 2),
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'sold')),
  is_on_sale BOOLEAN DEFAULT FALSE,
  is_best_seller BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on category_id for faster joins
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_is_on_sale ON products(is_on_sale);
CREATE INDEX IF NOT EXISTS idx_products_is_best_seller ON products(is_best_seller);

-- Homepage Hero Slides table
CREATE TABLE IF NOT EXISTS homepage_hero_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  headline_text_mk TEXT NOT NULL,
  headline_text_en TEXT NOT NULL,
  button_text_mk TEXT NOT NULL DEFAULT 'Купи сега',
  button_text_en TEXT NOT NULL DEFAULT 'Shop Now',
  button_link TEXT NOT NULL DEFAULT '/products',
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Homepage Grid Images table
CREATE TABLE IF NOT EXISTS homepage_grid_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  link_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for homepage tables
CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON homepage_hero_slides(order_index);
CREATE INDEX IF NOT EXISTS idx_hero_slides_active ON homepage_hero_slides(is_active);
CREATE INDEX IF NOT EXISTS idx_grid_images_order ON homepage_grid_images(order_index);
CREATE INDEX IF NOT EXISTS idx_grid_images_active ON homepage_grid_images(is_active);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hero_slides_updated_at ON homepage_hero_slides;
CREATE TRIGGER update_hero_slides_updated_at
  BEFORE UPDATE ON homepage_hero_slides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_grid_images_updated_at ON homepage_grid_images;
CREATE TRIGGER update_grid_images_updated_at
  BEFORE UPDATE ON homepage_grid_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_grid_images ENABLE ROW LEVEL SECURITY;

-- Public can read published products and all categories
DROP POLICY IF EXISTS "Public can view categories" ON categories;
CREATE POLICY "Public can view categories" ON categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view published products" ON products;
CREATE POLICY "Public can view published products" ON products
  FOR SELECT USING (status = 'published' OR status = 'sold');

-- Authenticated users (admin) can do everything
DROP POLICY IF EXISTS "Admin can manage categories" ON categories;
CREATE POLICY "Admin can manage categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can manage products" ON products;
CREATE POLICY "Admin can manage products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Homepage content policies
DROP POLICY IF EXISTS "Public can view active hero slides" ON homepage_hero_slides;
CREATE POLICY "Public can view active hero slides" ON homepage_hero_slides
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Admin can manage hero slides" ON homepage_hero_slides;
CREATE POLICY "Admin can manage hero slides" ON homepage_hero_slides
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public can view active grid images" ON homepage_grid_images;
CREATE POLICY "Public can view active grid images" ON homepage_grid_images
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Admin can manage grid images" ON homepage_grid_images;
CREATE POLICY "Admin can manage grid images" ON homepage_grid_images
  FOR ALL USING (auth.role() = 'authenticated');

-- Storage bucket for product images
-- Run this in Supabase Dashboard > Storage:
-- 1. Create a new bucket called "product-images"
-- 2. Make it public
-- 3. Add the following policy for authenticated users to upload:

-- INSERT policy for authenticated users:
-- ((bucket_id = 'product-images'::text) AND (auth.role() = 'authenticated'::text))

-- SELECT policy for public access:
-- (bucket_id = 'product-images'::text)

-- Sample data (optional)
-- INSERT INTO categories (name_mk, name_en, slug) VALUES
--   ('Свеќи', 'Candles', 'candles'),
--   ('Божикни Декорации', 'Christmas Decorations', 'christmas-decorations'),
--   ('Декоративни Предмети', 'Decorative Items', 'decorative-items');
