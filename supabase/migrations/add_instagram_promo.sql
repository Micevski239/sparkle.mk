-- Create instagram_promo table for managing the promo section between categories and testimonials
CREATE TABLE IF NOT EXISTS instagram_promo (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subtitle_en VARCHAR(100),
  subtitle_mk VARCHAR(100),
  title_en TEXT,
  title_mk TEXT,
  description_en TEXT,
  description_mk TEXT,
  button1_text_en VARCHAR(100),
  button1_text_mk VARCHAR(100),
  button1_link TEXT,
  button2_text_en VARCHAR(100),
  button2_text_mk VARCHAR(100),
  button2_link TEXT,
  instagram_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default row
INSERT INTO instagram_promo (
  subtitle_en, subtitle_mk,
  title_en, title_mk,
  description_en, description_mk,
  button1_text_en, button1_text_mk, button1_link,
  button2_text_en, button2_text_mk, button2_link,
  instagram_url
) VALUES (
  'NEW ARRIVALS', 'НОВИ ПРОИЗВОДИ',
  'Fresh Artworks', 'Нови Уметнички Дела',
  'Discover our latest handmade creations, crafted with love and attention to detail. Each piece is unique and brings warmth to your home.',
  'Откријте ги нашите најнови рачно изработени креации, создадени со љубов и внимание кон деталите. Секое парче е уникатно и носи топлина во вашиот дом.',
  'Shop Now', 'Купи Сега', '/products',
  'Follow Us', 'Следи Не', 'https://instagram.com',
  'https://www.instagram.com/reel/example/embed'
);

-- Enable Row Level Security
ALTER TABLE instagram_promo ENABLE ROW LEVEL SECURITY;

-- Public read access for active records
CREATE POLICY "Allow public read access on instagram_promo" ON instagram_promo
  FOR SELECT USING (true);

-- Authenticated users can manage content
CREATE POLICY "Allow authenticated users to manage instagram_promo" ON instagram_promo
  FOR ALL USING (auth.role() = 'authenticated');
