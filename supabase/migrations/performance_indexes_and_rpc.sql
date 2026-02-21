-- ============================================================
-- Performance Indexes & Server-Side Functions
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. PERFORMANCE INDEXES
-- --------------------------------------------------------

-- Products: speed up filtered/sorted queries
CREATE INDEX IF NOT EXISTS idx_products_status ON products (status);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_category_status ON products (category_id, status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_is_on_sale ON products (is_on_sale) WHERE is_on_sale = true;
CREATE INDEX IF NOT EXISTS idx_products_is_best_seller ON products (is_best_seller) WHERE is_best_seller = true;

-- Categories: speed up tree traversal
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories (parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories (display_order);

-- Homepage tables: speed up active-item queries
CREATE INDEX IF NOT EXISTS idx_hero_slides_active ON homepage_hero_slides (is_active, order_index) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_grid_images_active ON homepage_grid_images (is_active, order_index) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_welcome_tiles_active ON welcome_tiles (is_active, display_order) WHERE is_active = true;

-- Testimonials & About: active-item indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON testimonials (is_active, display_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_about_stats_active ON about_stats (is_active, display_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_about_gallery_active ON about_gallery (is_active, display_order) WHERE is_active = true;


-- 2. CATEGORY PRODUCT COUNTS (replaces JS-side counting)
-- --------------------------------------------------------

CREATE OR REPLACE FUNCTION get_category_counts()
RETURNS TABLE (category_id uuid, product_count bigint)
LANGUAGE sql STABLE
AS $$
  SELECT p.category_id, COUNT(*) as product_count
  FROM products p
  WHERE p.status IN ('published', 'sold')
    AND p.category_id IS NOT NULL
  GROUP BY p.category_id;
$$;


-- 3. HOMEPAGE DATA CONSOLIDATION RPC
-- --------------------------------------------------------
-- Returns all homepage data in a single round-trip

CREATE OR REPLACE FUNCTION get_homepage_data()
RETURNS json
LANGUAGE plpgsql STABLE
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'hero_slides', (
      SELECT COALESCE(json_agg(row_to_json(s) ORDER BY s.order_index), '[]'::json)
      FROM (
        SELECT id, image_url, headline_text_mk, headline_text_en,
               button_text_mk, button_text_en, button_link, order_index
        FROM homepage_hero_slides
        WHERE is_active = true
        ORDER BY order_index
      ) s
    ),
    'grid_images', (
      SELECT COALESCE(json_agg(row_to_json(g) ORDER BY g.order_index), '[]'::json)
      FROM (
        SELECT id, image_url, link_url, order_index, is_featured
        FROM homepage_grid_images
        WHERE is_active = true
        ORDER BY order_index
      ) g
    ),
    'welcome_tiles', (
      SELECT COALESCE(json_agg(row_to_json(w) ORDER BY w.display_order), '[]'::json)
      FROM (
        SELECT id, label_en, label_mk, image_url, bg_color, link_url, display_order
        FROM welcome_tiles
        WHERE is_active = true
        ORDER BY display_order
      ) w
    ),
    'testimonials', (
      SELECT COALESCE(json_agg(row_to_json(t) ORDER BY t.display_order), '[]'::json)
      FROM (
        SELECT id, customer_name, customer_photo_url, customer_location_en,
               customer_location_mk, quote_en, quote_mk, rating, display_order
        FROM testimonials
        WHERE is_active = true
        ORDER BY display_order
      ) t
    ),
    'about_stats', (
      SELECT COALESCE(json_agg(row_to_json(a) ORDER BY a.display_order), '[]'::json)
      FROM (
        SELECT id, value, label_en, label_mk, display_order
        FROM about_stats
        WHERE is_active = true
        ORDER BY display_order
      ) a
    ),
    'about_content', (
      SELECT COALESCE(json_agg(row_to_json(c)), '[]'::json)
      FROM (
        SELECT id, section, title_en, title_mk, subtitle_en, subtitle_mk,
               description_en, description_mk, founder_name, signature_url
        FROM about_content
      ) c
    ),
    'about_gallery', (
      SELECT COALESCE(json_agg(row_to_json(ag) ORDER BY ag.display_order), '[]'::json)
      FROM (
        SELECT id, image_url, alt_en, alt_mk, display_order
        FROM about_gallery
        WHERE is_active = true
        ORDER BY display_order
      ) ag
    ),
    'featured_products', (
      SELECT COALESCE(json_agg(row_to_json(p) ORDER BY p.created_at DESC), '[]'::json)
      FROM (
        SELECT id, title_mk, title_en, price, sale_price, image_url,
               status, is_best_seller, is_on_sale, category_id, created_at
        FROM products
        WHERE status IN ('published')
        ORDER BY created_at DESC
        LIMIT 8
      ) p
    )
  ) INTO result;

  RETURN result;
END;
$$;


-- 4. FULL-TEXT SEARCH FUNCTION
-- --------------------------------------------------------
-- Searches products by title in both languages using ILIKE
-- For better performance with large datasets, consider adding
-- pg_trgm extension and GIN indexes

CREATE OR REPLACE FUNCTION search_products(
  search_term text,
  category_filter uuid DEFAULT NULL,
  status_filter text[] DEFAULT ARRAY['published', 'sold'],
  sort_by text DEFAULT 'newest',
  page_size int DEFAULT 12,
  page_offset int DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  title_mk text,
  title_en text,
  description_mk text,
  description_en text,
  price numeric,
  sale_price numeric,
  image_url text,
  status text,
  is_best_seller boolean,
  is_on_sale boolean,
  category_id uuid,
  created_at timestamptz,
  category_name_mk text,
  category_name_en text,
  category_slug text,
  total_count bigint
)
LANGUAGE plpgsql STABLE
AS $$
BEGIN
  RETURN QUERY
  WITH filtered AS (
    SELECT p.*,
           c.name_mk as cat_name_mk,
           c.name_en as cat_name_en,
           c.slug as cat_slug,
           COUNT(*) OVER() as total
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.status = ANY(status_filter)
      AND (search_term IS NULL OR search_term = '' OR
           p.title_mk ILIKE '%' || search_term || '%' OR
           p.title_en ILIKE '%' || search_term || '%')
      AND (category_filter IS NULL OR p.category_id = category_filter)
    ORDER BY
      CASE WHEN sort_by = 'newest' THEN p.created_at END DESC,
      CASE WHEN sort_by = 'price_asc' THEN p.price END ASC,
      CASE WHEN sort_by = 'price_desc' THEN p.price END DESC,
      CASE WHEN sort_by = 'name' THEN p.title_en END ASC,
      CASE WHEN sort_by = 'on_sale' THEN
        CASE WHEN p.is_on_sale THEN 0 ELSE 1 END
      END ASC,
      p.created_at DESC
    LIMIT page_size + 1
    OFFSET page_offset
  )
  SELECT
    filtered.id,
    filtered.title_mk,
    filtered.title_en,
    filtered.description_mk,
    filtered.description_en,
    filtered.price,
    filtered.sale_price,
    filtered.image_url,
    filtered.status,
    filtered.is_best_seller,
    filtered.is_on_sale,
    filtered.category_id,
    filtered.created_at,
    filtered.cat_name_mk,
    filtered.cat_name_en,
    filtered.cat_slug,
    filtered.total
  FROM filtered;
END;
$$;
