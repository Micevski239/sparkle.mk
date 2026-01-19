-- Create testimonials table
CREATE TABLE testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_photo_url TEXT,
    customer_location_en VARCHAR(100),
    customer_location_mk VARCHAR(100),
    quote_en TEXT NOT NULL,
    quote_mk TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    testimonial_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient queries
CREATE INDEX idx_testimonials_active_order ON testimonials (is_active, display_order);

-- Enable Row Level Security
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active testimonials
CREATE POLICY "Public read access" ON testimonials
    FOR SELECT USING (is_active = true);

-- Policy: Authenticated users have full access
CREATE POLICY "Admin full access" ON testimonials
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample testimonials
INSERT INTO testimonials (customer_name, customer_location_en, customer_location_mk, quote_en, quote_mk, rating, display_order, is_active) VALUES
('Marija', 'Skopje', 'Скопје', 'Beautiful candles! The scent fills our entire home with warmth.', 'Прекрасни свеќи! Мирисот го исполнува целиот дом со топлина.', 5, 0, true),
('Ana', 'Bitola', 'Битола', 'Amazing quality and beautiful packaging. Perfect for gifts!', 'Одличен квалитет и прекрасно пакување. Совршено за подарок!', 5, 1, true),
('Ivan', 'Ohrid', 'Охрид', 'Excellent service and fast delivery. Highly recommended!', 'Одлична услуга и брза достава. Препорачувам!', 4, 2, true),
('Elena', 'Kumanovo', 'Куманово', 'Love the handmade quality. Each piece is unique!', 'Ја сакам рачната изработка. Секое парче е уникатно!', 5, 3, true);
