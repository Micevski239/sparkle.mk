-- Migration: Add homepage content tables and product flags
-- This migration adds new features without recreating existing tables

-- Add new columns to products table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='products' AND column_name='is_on_sale') THEN
    ALTER TABLE products ADD COLUMN is_on_sale BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='products' AND column_name='is_best_seller') THEN
    ALTER TABLE products ADD COLUMN is_best_seller BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Create indexes for new product columns if they don't exist
CREATE INDEX IF NOT EXISTS idx_products_is_on_sale ON products(is_on_sale);
CREATE INDEX IF NOT EXISTS idx_products_is_best_seller ON products(is_best_seller);

-- Create homepage hero slides table
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

-- Create homepage grid images table
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

-- Function to update updated_at timestamp (replace if exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for homepage tables
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

-- Enable RLS on new tables
ALTER TABLE homepage_hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_grid_images ENABLE ROW LEVEL SECURITY;

-- Create policies for homepage tables (drop and recreate to avoid conflicts)
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
