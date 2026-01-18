-- Create welcome_tiles table for managing category tiles on homepage
CREATE TABLE IF NOT EXISTS welcome_tiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label_en VARCHAR(100) NOT NULL,
  label_mk VARCHAR(100) NOT NULL,
  image_url TEXT,
  bg_color VARCHAR(20) NOT NULL DEFAULT '#333333',
  link_url VARCHAR(255) DEFAULT '/products',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_welcome_tiles_order ON welcome_tiles(display_order);

-- Insert default tiles
INSERT INTO welcome_tiles (label_en, label_mk, image_url, bg_color, link_url, display_order) VALUES
  ('Gift Ideas', 'Идеи за подарок', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop', '#c53c3c', '/products', 0),
  ('Home Decor', 'Декорација', 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400&h=400&fit=crop', '#abbf80', '/products', 1),
  ('Kids & Babies', 'Деца и бебиња', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop', '#e3ded1', '/products', 2),
  ('Kitchen', 'Кујна', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', '#e7be45', '/products', 3);
