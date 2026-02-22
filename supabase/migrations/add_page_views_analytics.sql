-- ============================================================
-- Page Views Analytics — table, indexes, RLS, and RPC function
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Create the page_views table
CREATE TABLE IF NOT EXISTS page_views (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path     text NOT NULL,
  referrer      text,
  device_type   text,        -- 'mobile' | 'tablet' | 'desktop'
  user_agent    text,
  visitor_id    text,        -- daily-rotating fingerprint hash
  session_id    text,        -- per-tab session
  created_at    timestamptz DEFAULT now() NOT NULL
);

-- 2. Indexes for fast aggregation queries
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path  ON page_views (page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views (visitor_id);

-- 3. Row Level Security
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Public can INSERT (tracking from frontend)
CREATE POLICY "Allow public inserts" ON page_views
  FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can SELECT (admin dashboard)
CREATE POLICY "Allow authenticated select" ON page_views
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only authenticated users can DELETE (cleanup)
CREATE POLICY "Allow authenticated delete" ON page_views
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- 4. RPC function — returns all analytics in one call
CREATE OR REPLACE FUNCTION get_analytics_summary(days_back int DEFAULT 30)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    -- Total views & visitors for today
    'views_today', (
      SELECT count(*) FROM page_views
      WHERE created_at >= date_trunc('day', now())
    ),
    'visitors_today', (
      SELECT count(DISTINCT visitor_id) FROM page_views
      WHERE created_at >= date_trunc('day', now())
    ),

    -- Total views & visitors for last 7 days
    'views_7d', (
      SELECT count(*) FROM page_views
      WHERE created_at >= now() - interval '7 days'
    ),
    'visitors_7d', (
      SELECT count(DISTINCT visitor_id) FROM page_views
      WHERE created_at >= now() - interval '7 days'
    ),

    -- Total views & visitors for last 30 days
    'views_30d', (
      SELECT count(*) FROM page_views
      WHERE created_at >= now() - interval '30 days'
    ),
    'visitors_30d', (
      SELECT count(DISTINCT visitor_id) FROM page_views
      WHERE created_at >= now() - interval '30 days'
    ),

    -- Views by day (for line chart)
    'views_by_day', (
      SELECT coalesce(json_agg(row_to_json(d) ORDER BY d.date), '[]'::json)
      FROM (
        SELECT
          date_trunc('day', created_at)::date AS date,
          count(*)                            AS views,
          count(DISTINCT visitor_id)          AS visitors
        FROM page_views
        WHERE created_at >= now() - (days_back || ' days')::interval
        GROUP BY date_trunc('day', created_at)::date
      ) d
    ),

    -- Top pages
    'top_pages', (
      SELECT coalesce(json_agg(row_to_json(p) ORDER BY p.views DESC), '[]'::json)
      FROM (
        SELECT
          page_path,
          count(*)                   AS views,
          count(DISTINCT visitor_id) AS visitors
        FROM page_views
        WHERE created_at >= now() - (days_back || ' days')::interval
        GROUP BY page_path
        ORDER BY count(*) DESC
        LIMIT 10
      ) p
    ),

    -- Device breakdown
    'devices', (
      SELECT coalesce(json_agg(row_to_json(dv)), '[]'::json)
      FROM (
        SELECT
          coalesce(device_type, 'unknown') AS device,
          count(*)                         AS count
        FROM page_views
        WHERE created_at >= now() - (days_back || ' days')::interval
        GROUP BY device_type
      ) dv
    ),

    -- Referrer sources
    'referrers', (
      SELECT coalesce(json_agg(row_to_json(r) ORDER BY r.count DESC), '[]'::json)
      FROM (
        SELECT
          CASE
            WHEN referrer IS NULL OR referrer = '' THEN 'Direct'
            ELSE split_part(
              replace(replace(referrer, 'https://', ''), 'http://', ''),
              '/', 1
            )
          END AS source,
          count(*) AS count
        FROM page_views
        WHERE created_at >= now() - (days_back || ' days')::interval
        GROUP BY source
        ORDER BY count(*) DESC
        LIMIT 10
      ) r
    )
  ) INTO result;

  RETURN result;
END;
$$;
