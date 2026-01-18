-- Add subcategories support
-- Run this migration in your Supabase SQL editor

-- Add parent_id column for category hierarchy
ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES categories(id) ON DELETE CASCADE;

-- Add display_order column for custom ordering
ALTER TABLE categories ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Create index for faster parent lookups
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- Update existing categories to have display_order of 0 if null
UPDATE categories SET display_order = 0 WHERE display_order IS NULL;
