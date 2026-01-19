-- Create about_stats table for managing statistics on homepage
CREATE TABLE IF NOT EXISTS about_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  value VARCHAR(50) NOT NULL,
  label_en VARCHAR(100) NOT NULL,
  label_mk VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_about_stats_order ON about_stats(display_order);

-- Insert default stats
INSERT INTO about_stats (value, label_en, label_mk, display_order) VALUES
  ('200+', 'Products', 'Производи', 0),
  ('5+', 'Years Experience', 'Години искуство', 1),
  ('1000+', 'Happy Customers', 'Задоволни клиенти', 2),
  ('100%', 'Handmade', 'Рачна изработка', 3);

-- Create about_content table for managing text content
CREATE TABLE IF NOT EXISTS about_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section VARCHAR(50) NOT NULL UNIQUE,
  title_en TEXT,
  title_mk TEXT,
  subtitle_en TEXT,
  subtitle_mk TEXT,
  description_en TEXT,
  description_mk TEXT,
  image_url TEXT,
  founder_name VARCHAR(100),
  signature_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default content
INSERT INTO about_content (section, title_en, title_mk, subtitle_en, subtitle_mk, description_en, description_mk, founder_name) VALUES
  ('main', 'Created with Love', 'Создадено со љубов', 'Our Story', 'Нашата приказна',
   'Every product we create is unique. With years of experience and passion for the craft, we make candles and decorations that bring warmth and character to every home.',
   'Секој производ што го создаваме е единствен. Со години искуство и страст кон занаетот, правиме свеќи и декорации кои носат топлина и карактер во секој дом.',
   NULL),
  ('quote', 'Every piece I create carries a part of my heart. I believe handmade items bring warmth and soul to every home.',
   'Секој производ што го создавам носи дел од моето срце. Верувам дека рачно изработените предмети носат топлина и душа во секој дом.',
   NULL, NULL, NULL, NULL, 'Ana');

-- Create about_gallery table for managing gallery images
CREATE TABLE IF NOT EXISTS about_gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  alt_en VARCHAR(200),
  alt_mk VARCHAR(200),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_about_gallery_order ON about_gallery(display_order);

-- Insert placeholder gallery images (4 slots)
INSERT INTO about_gallery (image_url, alt_en, alt_mk, display_order) VALUES
  ('/about-1.jpg', 'Crafting process', 'Процес на изработка', 0),
  ('/about-2.jpg', 'Natural materials', 'Природни материјали', 1),
  ('/about-3.jpg', 'Finished products', 'Готови производи', 2),
  ('/about-4.jpg', 'Packaging with care', 'Пакување со грижа', 3);

-- Enable Row Level Security
ALTER TABLE about_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_gallery ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on about_stats" ON about_stats
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on about_content" ON about_content
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on about_gallery" ON about_gallery
  FOR SELECT USING (true);

-- Create policies for authenticated users to manage content
CREATE POLICY "Allow authenticated users to manage about_stats" ON about_stats
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage about_content" ON about_content
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage about_gallery" ON about_gallery
  FOR ALL USING (auth.role() = 'authenticated');
