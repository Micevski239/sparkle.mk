# Production Readiness Audit Prompt

> **One prompt to rule them all.** Paste this into Claude/ChatGPT/Cursor with your codebase context. It covers security, performance, accessibility, architecture, and deployment — every check that was battle-tested across real production audits.

---

## The Prompt

```
You are a senior full-stack engineer performing a production readiness audit on this codebase. This is a React + TypeScript + Supabase + Vite project deployed on Vercel (adapt as needed to the actual stack).

Perform a COMPLETE audit across all 7 categories below. For each issue found, provide:
- Severity: CRITICAL / HIGH / MEDIUM / LOW
- The exact file and line
- What's wrong
- The fix (code snippet or specific instruction)

Do NOT skip any category. Do NOT give vague advice. Every finding must be actionable with exact code.

---

## 1. SECURITY & AUTH

### 1.1 Row-Level Security (RLS)
- Check EVERY Supabase table has RLS enabled
- Verify public (anon) users can ONLY read published/active content
- Verify authenticated users have appropriate CRUD policies
- Check that no table allows unrestricted INSERT/UPDATE/DELETE for anon role
- Look for .eq('status', 'published') or similar filters that should be enforced at DB level, not just client

### 1.2 Authentication
- Verify admin routes are wrapped in auth guards (ProtectedRoute or equivalent)
- Check that auth state comes from Supabase onAuthStateChange, not just getSession (session can be stale)
- Verify logout clears all state and redirects
- Check for auth tokens in URLs or localStorage (should use Supabase's built-in session handling)
- Ensure admin pages lazy-load AuthProvider only when needed (not on public routes)

### 1.3 Environment Variables
- Verify .env is in .gitignore
- Check that only VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are exposed (never service_role key)
- Verify Supabase client uses anon key only
- Check for hardcoded API keys, secrets, or credentials anywhere in the codebase

### 1.4 HTTP Security Headers
- Verify deployment config (vercel.json / next.config.js / nginx) includes:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
  - Referrer-Policy: strict-origin-when-cross-origin
  - Content-Security-Policy (if applicable)
- Check for proper CORS configuration

### 1.5 Input Validation
- Check all user inputs for XSS vectors (especially raw HTML injection)
- Verify file upload validation: file type, file size, file name sanitization
- Check that Supabase storage upload paths use sanitized filenames (no user-controlled path traversal)
- Look for SQL injection vectors (rare with Supabase client, but check .rpc() calls)

### 1.6 Storage Security
- Verify Supabase storage bucket policies:
  - Public read for published content
  - Authenticated write only
  - No unrestricted delete
- Check image URL patterns for path traversal vulnerabilities

---

## 2. PERFORMANCE — CRITICAL PATH (First Load)

### 2.1 Bundle & Code Splitting
- Check Vite/Webpack config for manual chunk splitting:
  - react/react-dom should be a separate vendor chunk
  - Router library should be its own chunk
  - Supabase client should be its own chunk (it's ~170KB)
  - Data fetching library (TanStack Query etc.) should be its own chunk
- Verify all non-landing pages use lazy() + Suspense
- Check that lazy imports use a retry wrapper for network failures
- Run `npm run build` and check total bundle size. Flag if any single chunk > 250KB gzipped

### 2.2 Splash Screen / Loading
- If there's a splash screen, verify it dismisses on first React paint (requestAnimationFrame), NOT on a timer
- Check that Suspense has a visible fallback (spinner), NOT null or empty div
- Verify splash transition is fast (< 0.5s)

### 2.3 Critical CSS & Fonts
- Check that fonts use display=swap or are preloaded
- Verify font loading doesn't block render (use media="print" onload trick or font-display: swap)
- Check for render-blocking CSS in head
- Look for @import in CSS files (blocks parallel loading)

### 2.4 Third-Party Scripts
- Check ALL third-party scripts (analytics, embeds, chat widgets):
  - Are they loaded async/defer?
  - Are they gated behind user interaction or viewport entry (IntersectionObserver)?
  - Do they block the critical path?
- Flag any third-party script in head that isn't essential for first paint
- Check for synchronous script tags

### 2.5 Images on Critical Path
- Hero images / above-fold images should use loading="eager" and fetchPriority="high"
- Check logo/favicon size — if > 20KB for a small render, it needs optimization
- Verify logos use modern formats (WebP/AVIF) not oversized PNGs
- Check that og:image and favicon are properly sized (not a 640px image for a 80px render)

---

## 3. PERFORMANCE — DATA FETCHING

### 3.1 Query Efficiency
- Check for select('*') — should use specific column selects to reduce payload
- Check for count: 'exact' — this triggers a full table scan. Use pageSize+1 strategy instead
- Look for N+1 query patterns (fetching related data in loops)
- Verify queries include appropriate filters at the DB level, not just client-side filtering
- Check for unnecessary re-fetches when component re-renders

### 3.2 Caching Strategy
- Is there a data caching layer? (TanStack Query, SWR, or custom)
- If using TanStack Query:
  - Verify QueryClientProvider wraps the app
  - Check staleTime (should be > 0 for data that doesn't change frequently)
  - Check gcTime (garbage collection)
  - Verify refetchOnWindowFocus is appropriate for the use case
- If NOT using a caching library:
  - Flag this as HIGH — every navigation re-fetches all data
  - Same data fetched by multiple components hits the API multiple times

### 3.3 Pagination
- Verify paginated queries don't fetch entire dataset
- Check Load More / infinite scroll implementation:
  - Does it accumulate data correctly?
  - Is there proper loading state for "loading more"?
  - Does changing filters properly reset pagination?
- Verify count displays don't show off-by-one errors

### 3.4 Search
- Is search debounced? (should be 200-300ms minimum)
- Does search use replace:true for URL params? (prevents polluting browser history)
- For large datasets: is search server-side or client-side? Flag client-side search on > 100 items
- Check for search queries firing on every keystroke without debounce

### 3.5 Request Optimization
- Check for duplicate requests on mount (StrictMode double-mount is fine, but check for real duplicates)
- Verify requests are cancelled/ignored when component unmounts (abort signals or query cancellation)
- Look for waterfall requests that could be parallelized
- Check if homepage makes more than 3-4 separate API calls (should consolidate with RPC)

---

## 4. PERFORMANCE — RENDERING

### 4.1 Layout Shifts (CLS)
- Check for elements that change size after load (images without dimensions, dynamic content)
- Verify fixed headers/nav have stable spacers (not animated heights)
- Check that font loading doesn't cause text reflow
- Look for skeleton loaders that are a different size than the final content

### 4.2 Animation Performance
- Flag any use of transition-all — should be transition-colors, transition-opacity, transition-transform
- Check animations use transform/opacity only (GPU-accelerated), NOT width/height/top/left/margin/padding
- Verify max-height animations are replaced with:
  - transform: translateY for show/hide
  - grid-template-rows: 0fr/1fr for accordions
  - display: none with transition for simple toggle
- Check for layout thrashing in scroll handlers

### 4.3 React-Specific
- Are list items using stable keys? (not array index for dynamic lists)
- Check for expensive components that should be wrapped in React.memo
- Look for inline object/function creation in JSX that breaks memoization
- Verify large lists use virtualization (if > 100 items rendered at once)
- Check that context providers are properly scoped (not re-rendering entire app on every state change)

### 4.4 Image Loading
- Below-fold images should use loading="lazy"
- Check for images rendering at much larger resolution than display size
- Verify responsive images use srcset/sizes where appropriate
- Check for large decorative images that could be WebP/AVIF

---

## 5. ACCESSIBILITY & UX

### 5.1 Reduced Motion
- Verify there's a global @media (prefers-reduced-motion: reduce) rule that disables animations
- Check that essential information isn't conveyed only through animation

### 5.2 Semantic HTML
- Decorative images should have aria-hidden="true" and empty alt=""
- Interactive elements should be buttons or links, not divs with onClick
- Check for proper heading hierarchy (h1 > h2 > h3, no skipping)

### 5.3 Keyboard Navigation
- Verify all interactive elements are focusable
- Check that mobile menus/drawers trap focus
- Verify modals can be closed with Escape key

### 5.4 Custom Scrollbar
- If using custom scrollbar CSS, verify it works in Firefox (not just WebKit)

---

## 6. DATABASE & BACKEND

### 6.1 Indexes
- Check for queries that filter/sort on columns without indexes:
  - status columns (published/active filters)
  - foreign keys (category_id, parent_id)
  - sort columns (created_at, display_order, order_index)
  - boolean flags with WHERE clauses (is_active, is_on_sale)
- Recommend partial indexes for common filter patterns (WHERE is_active = true)

### 6.2 Database Functions (RPC)
- For pages with 4+ queries: suggest consolidating into a single RPC function
- Check if category counts are computed client-side (should be a DB aggregation)
- Verify any text search uses proper DB-level search (ILIKE, FTS, pg_trgm) not client-side filter

### 6.3 Data Integrity
- Check for cascading deletes where needed (e.g., deleting a category should handle its products)
- Verify updated_at timestamps are maintained
- Check for orphaned records (products with non-existent category_id)

---

## 7. DEPLOYMENT & BUILD

### 7.1 Build Verification
- Run `npx tsc --noEmit` — must pass with ZERO errors
- Run `npm run build` — must succeed
- Run `npm run lint` — flag any new errors (pre-existing warnings are acceptable)
- Check build output for chunks > 250KB gzipped

### 7.2 Deployment Config
- Verify SPA routing (all paths rewrite to /index.html)
- Check caching headers:
  - Built assets (with hash): Cache-Control max-age=31536000, immutable
  - Images: Cache 30 days with stale-while-revalidate
  - HTML: no-cache (always fresh)
- Verify environment variables are set in deployment platform

### 7.3 Error Handling
- Is there a global ErrorBoundary wrapping the app?
- Do lazy-loaded routes have retry logic for chunk loading failures?
- Are API errors shown to users gracefully (not raw error messages)?
- Check for unhandled promise rejections

### 7.4 SEO
- Verify meta tags: title, description, og:title, og:description, og:image
- Check for proper canonical URLs
- Verify robots.txt exists and is correct
- Check that 404 page exists and returns appropriate status

---

## OUTPUT FORMAT

After auditing, provide:

1. **Executive Summary** — 3-5 sentence overview of production readiness
2. **Critical Issues** — Must fix before deploy (security vulnerabilities, data exposure, crashes)
3. **High Impact Fixes** — Should fix, significant user impact (performance, UX)
4. **Medium Improvements** — Good to fix, moderate impact
5. **Low Priority Polish** — Nice to have

For each issue, provide the EXACT fix — not "consider doing X" but the actual code change with file path and line number. If it requires a SQL migration, provide the complete SQL.

Finally, provide a **1-day action plan** prioritized by impact-to-effort ratio, grouping changes that touch the same files.
```

---

## What This Prompt Catches (Battle-Tested Findings)

The following are real issues found and fixed using this audit across production projects:

### Security
- Tables without RLS policies (full public read/write)
- Service role key exposed in client bundle
- Missing file upload validation (type, size, path sanitization)
- Admin routes accessible without auth guards
- Missing HTTP security headers

### Performance — First Load
- 202KB PNG logo rendered at 80px (replaced with 5.7KB WebP)
- Splash screen dismissed after 1s timer instead of first paint
- Suspense fallback was null (white flash instead of spinner)
- Third-party scripts (analytics, embeds) loaded synchronously in head
- No vendor chunk splitting (entire app in one 500KB bundle)

### Performance — Data
- select('*') on every query (fetching 20+ columns when 5 needed)
- count: 'exact' on paginated queries (extra full-table-scan query)
- No search debounce (API call on every keystroke)
- 8 separate homepage queries (could be 1 RPC call)
- No caching layer (every page navigation re-fetches everything)
- Category counts computed client-side by fetching all products

### Performance — Rendering
- transition-all on 15+ elements (animates every CSS property on hover)
- max-height: 0/500px for show/hide (causes reflow, janky on mobile)
- Header spacer with animated height (CLS on every page)
- All carousel slides rendered in DOM (only 3 visible at a time)
- Scroll-triggered section mounting causing visible pop-in glitch
- 34 decorative images rendered on mobile (most off-screen)

### Rendering Fixes Applied
- transition-all replaced with transition-colors / transition-opacity
- max-height animation replaced with transform: translateY (GPU-accelerated)
- Accordion max-height replaced with grid-template-rows: 0fr/1fr
- Header spacer: fixed height, no animation
- HeroCarousel: only render active + prev + next slides
- ProductCard wrapped in React.memo
- Testimonial keyframe moved from inline style tag to global CSS with CSS custom property

### Architecture
- No data caching: added TanStack Query with 5min staleTime
- useState+useEffect for all fetching: migrated to useQuery/useInfiniteQuery
- Load More with fake totalCount: simplified display without off-by-one errors
- No database indexes: added 16 targeted indexes on filter/sort columns
- Client-side search on full dataset: debounced + server-side ready

### Accessibility
- No prefers-reduced-motion support: added global CSS rule disabling all animations
- Decorative images missing aria-hidden

### Build & Deploy
- Missing chunk splitting in Vite config (manualChunks)
- Lazy imports without retry wrapper (chunk load failures on slow networks)
- No ErrorBoundary at app root

---

## SQL Migration Template

When the audit recommends database changes, generate a migration file like this:

```sql
-- Performance indexes (run in Supabase SQL Editor)

-- Products
CREATE INDEX IF NOT EXISTS idx_products_status ON products (status);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_category_status ON products (category_id, status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at DESC);

-- Active-item partial indexes (smaller, faster)
CREATE INDEX IF NOT EXISTS idx_products_on_sale ON products (is_on_sale) WHERE is_on_sale = true;
CREATE INDEX IF NOT EXISTS idx_products_best_seller ON products (is_best_seller) WHERE is_best_seller = true;

-- Foreign keys & sort columns
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories (parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories (display_order);

-- Active content queries (adjust table/column names to your schema)
-- Pattern: CREATE INDEX idx_tablename_active ON tablename (is_active, sort_col) WHERE is_active = true;
```

---

## TanStack Query Migration Template

When the audit recommends adding a caching layer:

```typescript
// main.tsx — wrap app with QueryClientProvider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 min — data treated as fresh
      gcTime: 10 * 60 * 1000,     // 10 min — cache garbage collection
      retry: 1,                    // 1 retry on failure
      refetchOnWindowFocus: false, // disable for content sites
    },
  },
});

// Wrap: <QueryClientProvider client={queryClient}>...</QueryClientProvider>
```

```typescript
// Hook migration pattern:
// BEFORE (useState + useEffect)
export function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => { /* fetch and setState */ }, []);
  return { items, loading, error };
}

// AFTER (useQuery — same return shape)
export function useItems() {
  const { data: items = [], isLoading: loading, error } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const { data, error } = await supabase.from('items').select('col1,col2,col3');
      if (error) throw error;
      return data;
    },
  });
  return { items, loading, error: error?.message ?? null };
}
```

---

## Vite Chunk Splitting Template

```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'router': ['react-router-dom'],
        'supabase': ['@supabase/supabase-js'],
        'query': ['@tanstack/react-query'],
      },
    },
  },
},
```

---

## Image Optimization Checklist

| Check | Fix |
|-------|-----|
| Logo > 20KB for small render | Resize to 2x display size, convert to WebP |
| Hero images > 200KB | Compress, serve responsive sizes via srcset |
| Decorative PNGs with transparency | Convert to WebP (typically 70-97% smaller) |
| Favicon is a full-size image | Create dedicated 32x32 or 64x64 favicon |
| No srcset on content images | Add srcset with 1x, 2x sizes at minimum |

Command to optimize (macOS):
```bash
# Resize then convert to WebP
sips -Z <max-dimension> input.png --out resized.png
cwebp -q 85 resized.png -o output.webp
```
