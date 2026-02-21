# Sparkle.mk - Website Documentation

**Client:** Sparkle.mk
**Website:** sparklemk.com
**Date:** February 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Environment Setup](#4-environment-setup)
5. [Development & Build Commands](#5-development--build-commands)
6. [Deployment (Vercel)](#6-deployment-vercel)
7. [Database (Supabase)](#7-database-supabase)
8. [Public Website Pages](#8-public-website-pages)
9. [Admin Panel (CMS) Guide](#9-admin-panel-cms-guide)
10. [Bilingual System](#10-bilingual-system)
11. [Third-Party Integrations](#11-third-party-integrations)
12. [Security](#12-security)
13. [Performance & Caching](#13-performance--caching)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Project Overview

Sparkle.mk is an e-commerce showcase website for a handcrafted artisan brand based in Gevgelija, North Macedonia. The website displays handmade products including aromatic candles, Christmas decorations, home decor, and gifts. Customers place orders through social media (Instagram, Facebook, TikTok) rather than a traditional shopping cart.

The site is fully bilingual (Macedonian and English) and includes a full-featured admin panel for managing all website content without touching code.

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | React | 19.0.0 |
| Language | TypeScript | 5.6.2 |
| Build Tool | Vite | 6.0.5 |
| Routing | React Router DOM | 7.1.1 |
| Styling | Tailwind CSS | 3.4.17 |
| Backend / Database | Supabase (PostgreSQL) | 2.39.0+ |
| Authentication | Supabase Auth | (included) |
| Image Storage | Supabase Storage | (included) |
| Hosting | Vercel | - |
| Social Feed | EmbedSocial | - |

### Key Libraries
- **clsx** - Conditional CSS class utility
- **PostCSS + Autoprefixer** - CSS processing
- **ESLint** - Code linting

---

## 3. Project Structure

```
sparklemk/
├── public/                      # Static assets (logos, hero images, decorative elements)
│   ├── sparkle-logo.png         # Brand logo
│   ├── hero1.jpg, hero2.jpg...  # Fallback hero images
│   ├── manifest.json            # PWA manifest
│   └── robots.txt               # Search engine crawling rules
│
├── src/
│   ├── components/
│   │   ├── ui/                  # Reusable UI components (Button, Input, Modal, Select, Textarea)
│   │   ├── products/            # Product-specific components (CategorySidebar, MobileCategoryDrawer, etc.)
│   │   ├── Layout.tsx           # Main layout wrapper (Navbar + Footer)
│   │   ├── Navbar.tsx           # Site navigation bar
│   │   ├── ProductCard.tsx      # Individual product display card
│   │   ├── ProductGrid.tsx      # Product grid layout
│   │   ├── AdminLayout.tsx      # Admin panel layout (sidebar navigation)
│   │   ├── ProtectedRoute.tsx   # Authentication guard for admin pages
│   │   └── ...                  # Section components (Welcome, Testimonials, About, Instagram)
│   │
│   ├── pages/
│   │   ├── Home.tsx             # Homepage
│   │   ├── Products.tsx         # Product catalog with filtering
│   │   ├── ProductDetail.tsx    # Individual product page
│   │   ├── About.tsx            # About page
│   │   ├── Contact.tsx          # Contact page
│   │   ├── NotFound.tsx         # 404 page
│   │   └── admin/               # All admin panel pages
│   │       ├── Login.tsx
│   │       ├── Dashboard.tsx    # Product management table
│   │       ├── ProductForm.tsx  # Create/edit product form
│   │       ├── Categories.tsx   # Category management
│   │       ├── HeroSlides.tsx   # Hero section management
│   │       ├── WelcomeTiles.tsx # Welcome tiles management
│   │       ├── GridImages.tsx   # Homepage grid images
│   │       ├── AboutSection.tsx # About page content management
│   │       ├── Testimonials.tsx # Testimonials management
│   │       └── InstagramPromo.tsx # Instagram promo section
│   │
│   ├── context/
│   │   ├── AuthContext.tsx       # Authentication state management
│   │   └── LanguageContext.tsx   # Language switching (MK/EN)
│   │
│   ├── hooks/                   # Custom React hooks for data fetching
│   │   ├── useProducts.ts       # Product CRUD operations
│   │   ├── useCategories.ts     # Category CRUD operations
│   │   ├── useHomepage.ts       # Hero slides, welcome tiles, grid images
│   │   ├── useAbout.ts          # About section content
│   │   ├── useTestimonials.ts   # Testimonials
│   │   ├── useInstagramPromo.ts # Instagram promo section
│   │   └── useFadeIn.ts         # Scroll animation hook
│   │
│   ├── i18n/
│   │   └── translations.ts     # All UI text translations (MK/EN)
│   │
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client initialization
│   │   ├── utils.ts            # Utility functions (price formatting, slugify)
│   │   └── lazyWithRetry.ts    # Lazy loading with retry logic
│   │
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   │
│   ├── App.tsx                 # Root component with routing
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles and Tailwind imports
│
├── supabase/
│   └── migrations/             # Database migration files
│
├── package.json
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
├── vercel.json                 # Vercel deployment configuration
└── index.html                  # HTML entry point with SEO meta tags
```

---

## 4. Environment Setup

### Environment Variables

The project requires two environment variables to connect to Supabase. These are set in a `.env` file at the project root (for local development) and in the Vercel dashboard (for production).

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL (e.g., `https://xxxxx.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase public anonymous key |

These are **public** keys and are safe to expose in the frontend. Row-Level Security (RLS) on the database controls data access.

### Local Development Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd sparklemk

# 2. Install dependencies
npm install

# 3. Create a .env file with your Supabase credentials
#    (copy from .env.example if available, or create manually)
echo "VITE_SUPABASE_URL=https://your-project.supabase.co" > .env
echo "VITE_SUPABASE_ANON_KEY=your-anon-key" >> .env

# 4. Start the development server
npm run dev
```

The development server will start at `http://localhost:5173`.

---

## 5. Development & Build Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local development server (Vite) |
| `npm run build` | Type-check with TypeScript, then build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check for code issues |

---

## 6. Deployment (Vercel)

The website is deployed on **Vercel**. Deployments happen automatically when code is pushed to the `main` branch.

### Vercel Configuration (`vercel.json`)

- **SPA Routing:** All routes rewrite to `/` so React Router handles navigation
- **Security Headers:** `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`
- **Asset Caching:** Built assets cached for 1 year (immutable); images cached for 30 days

### How to Deploy

1. Push changes to the `main` branch on GitHub
2. Vercel automatically builds and deploys
3. Production URL: **sparklemk.com**

### Setting Environment Variables on Vercel

1. Go to the Vercel project dashboard
2. Navigate to **Settings > Environment Variables**
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
4. Redeploy for changes to take effect

---

## 7. Database (Supabase)

### Overview

The backend uses **Supabase**, which provides a PostgreSQL database, authentication, and file storage. The Supabase dashboard is accessible at [app.supabase.com](https://app.supabase.com).

### Database Tables

| Table | Purpose |
|-------|---------|
| `products` | All products with bilingual titles, descriptions, pricing, images, and status |
| `categories` | Hierarchical product categories (supports parent/child relationships) |
| `homepage_hero_slides` | Hero section image cards on the homepage |
| `homepage_grid_images` | Image gallery grid on the homepage |
| `welcome_tiles` | Category shortcut tiles on the homepage |
| `about_content` | About page main content and quote sections |
| `about_stats` | Statistics displayed on the about page |
| `about_gallery_images` | Image gallery on the about page |
| `testimonials` | Customer reviews with ratings |
| `instagram_promo` | Instagram promotion section content |

### Product Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier (auto-generated) |
| `title_mk` | Text | Product title in Macedonian |
| `title_en` | Text | Product title in English |
| `description_mk` | Text | Product description in Macedonian (optional) |
| `description_en` | Text | Product description in English (optional) |
| `price` | Number | Price in MKD (Macedonian Denar) |
| `sale_price` | Number | Discounted price (optional, null if not on sale) |
| `image_url` | Text | URL to the product image in Supabase Storage |
| `category_id` | UUID | Reference to the category (optional) |
| `status` | Enum | `draft`, `published`, or `sold` |
| `is_on_sale` | Boolean | Whether to show in "Sale Items" section |
| `is_best_seller` | Boolean | Whether to show in "Best Sellers" section on homepage |
| `created_at` | Timestamp | When the product was created |
| `updated_at` | Timestamp | When the product was last modified |

### Category Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `name_mk` | Text | Category name in Macedonian |
| `name_en` | Text | Category name in English |
| `slug` | Text | URL-friendly identifier (auto-generated from English name) |
| `parent_id` | UUID | Reference to parent category (null for top-level) |
| `display_order` | Integer | Sort order (lower numbers appear first) |

### Image Storage

Product and content images are stored in a Supabase Storage bucket called **`product-images`**. When uploading through the admin panel, images are automatically uploaded to this bucket and the URL is saved to the database.

---

## 8. Public Website Pages

### Homepage (`/`)

The homepage consists of the following sections (top to bottom):

1. **Hero Section** - Three image cards (1 large left, 2 stacked right) with headlines and call-to-action buttons. Managed via Admin > Hero Slides.
2. **Welcome Tiles** - Category shortcut tiles with custom colors. Managed via Admin > Welcome Tiles.
3. **Instagram Feed** - Embedded Instagram hashtag feed via EmbedSocial. Managed via Admin > Instagram Promo.
4. **Testimonials** - Customer reviews with star ratings. Managed via Admin > Testimonials.
5. **Best Sellers** - Up to 4 products flagged as "Best Seller". Controlled by the `is_best_seller` flag on products.
6. **About Preview** - Brief about section with link to the full about page.

### Products Page (`/products`)

- **Category Sidebar** (desktop) / **Category Drawer** (mobile) for filtering
- **Sorting Options:** On Sale, Newest, Price Low to High, Price High to Low, Name
- **View Modes:** 2, 3, 4, or 5 column grid, plus a list view
- **Pagination:** "Load More" button to show additional products
- Filters and sort are preserved in the URL as query parameters

### Product Detail Page (`/products/:id`)

- Full product image
- Bilingual title and description
- Price display (with original price crossed out if on sale)
- "SOLD" overlay if the product status is `sold`
- Social media order buttons (Instagram, Facebook, TikTok)
- Related products from the same category

### About Page (`/about`)

- Company mission and vision
- Core values (5 items with icons)
- Founder information with signature
- Image gallery
- Social media links

### Contact Page (`/contact`)

- Social media contact cards (Instagram, Facebook, TikTok)
- Direct links to each social media profile
- 24-hour response time message

### 404 Page

- Friendly "page not found" message with a link back to the homepage

---

## 9. Admin Panel (CMS) Guide

### Accessing the Admin Panel

1. Navigate to **sparklemk.com/admin/login**
2. Enter your admin email and password
3. You will be redirected to the admin dashboard

The admin panel is protected by Supabase Authentication. Only authenticated users can access admin pages.

---

### 9.1 Dashboard (Product Management)

**URL:** `/admin`

The dashboard is the main product management page. It displays all products in a table with the following columns:

- **Image** - Product thumbnail
- **Title** - Product name (English + Macedonian)
- **Category** - Assigned category
- **Price** - Product price in MKD
- **Status** - Dropdown to change between Draft, Published, and Sold
- **Actions** - Edit and Delete buttons

#### Product Statuses

| Status | Meaning |
|--------|---------|
| **Draft** | Product is saved but NOT visible on the public website |
| **Published** | Product is live and visible to all visitors |
| **Sold** | Product is visible but shows a "SOLD" overlay and cannot be ordered |

#### Adding a New Product

1. Click **"+ Add Product"** in the top right
2. Fill in the form:
   - **Product Image** - Upload an image file (PNG, JPG, GIF up to 5MB)
   - **Title (Macedonian)** - Product name in Macedonian (required)
   - **Title (English)** - Product name in English (required)
   - **Description (Macedonian)** - Product description in Macedonian
   - **Description (English)** - Product description in English
   - **Price (MKD)** - Regular price in Macedonian Denar (required)
   - **Sale Price (MKD)** - Discounted price (leave empty if not on sale)
   - **Category** - Select a category or "No category"
   - **Status** - Draft, Published, or Sold
   - **Product Flags:**
     - **On Sale** - Marks the product as on sale (shown in Sale Items section)
     - **Best Seller** - Shows the product in the Best Sellers section on the homepage
3. Click **"Create Product"**

#### Editing a Product

1. Find the product in the dashboard table
2. Click the **pencil icon** in the Actions column
3. Modify any fields
4. Click **"Update Product"**

#### Deleting a Product

1. Click the **trash icon** in the Actions column
2. Confirm the deletion in the popup modal
3. **Warning:** This action cannot be undone

#### Changing Product Status Quickly

You can change a product's status directly from the dashboard table using the **Status dropdown** in each row. No need to open the edit form.

---

### 9.2 Categories

**URL:** `/admin/categories`

Categories organize your products. The system supports **hierarchical categories** (parent and child categories).

#### Adding a Category

1. Click **"+ Add Category"**
2. Fill in:
   - **Name (English)** - Category name in English (required)
   - **Name (Macedonian)** - Category name in Macedonian (required)
   - **Parent Category** - Select a parent to create a subcategory, or "No Parent" for top-level
   - **Display Order** - Number controlling sort order (lower = first)
   - **Slug** - Auto-generated from the English name (URL-friendly identifier)
3. Click **"Create"**

#### Editing a Category

1. Click the **pencil icon** next to any category
2. Modify the fields
3. Click **"Update"**

#### Deleting a Category

1. Click the **trash icon** next to the category
2. If the category has subcategories, you will see a warning that subcategories will also be deleted
3. Products in the deleted category will have their category set to "none"
4. Confirm the deletion

---

### 9.3 Hero Slides

**URL:** `/admin/hero-slides`

Hero slides are the large image cards displayed at the top of the homepage. The homepage displays up to 3 active slides in a layout: 1 large card on the left and 2 smaller stacked cards on the right.

#### Adding a Hero Slide

1. Click **"+ Add Slide"**
2. Fill in:
   - **Background Image** - Upload an image or enter an image URL
   - **Headline (English)** - Text overlay in English (required)
   - **Headline (Macedonian)** - Text overlay in Macedonian (required)
   - **Button Text (English)** - Call-to-action button text in English
   - **Button Text (Macedonian)** - Call-to-action button text in Macedonian
   - **Button Link** - Where the button navigates to (e.g., `/products`)
   - **Order Index** - Controls the display position (0 = first/large card)
   - **Active** checkbox - Whether this slide is visible on the homepage
3. Click **"Create"**

#### Editing / Deleting

- Use the pencil/trash icons in the table to edit or delete slides

---

### 9.4 Welcome Tiles

**URL:** `/admin/welcome-tiles`

Welcome tiles are colored shortcut tiles displayed below the hero section. Each tile links to a category or page.

#### Tile Fields

- **Label (English/Macedonian)** - Text displayed on the tile
- **Image** - Optional background image
- **Background Color** - Hex color code for the tile background
- **Link URL** - Where the tile navigates to (e.g., `/products?category=candles`)
- **Display Order** - Sort order (lower = first)
- **Active** - Whether the tile is visible

---

### 9.5 Instagram Promo Section

**URL:** `/admin/instagram-promo`

This section manages the Instagram feed area on the homepage. It includes:

- **Subtitle and Title** (bilingual) - Section headings
- **Description** (bilingual) - Promotional text
- **Button 1 & Button 2** - Call-to-action buttons with custom text and links
- **Instagram URL** - Link to the Instagram profile
- **Active** toggle - Show/hide the section

The actual Instagram feed is embedded via EmbedSocial (see [Third-Party Integrations](#11-third-party-integrations)).

---

### 9.6 Grid Images

**URL:** `/admin/grid-images`

Manages the image gallery displayed on the homepage. Each image can have:

- **Image** - Upload or URL
- **Link URL** - Optional link when the image is clicked
- **Order Index** - Display position
- **Featured** flag - Highlights the image
- **Active** flag - Show/hide

---

### 9.7 About Section

**URL:** `/admin/about-section`

Manages all content displayed on the About page:

- **Main Content** - Mission/vision text, founder name, signature image
- **Quote Section** - Inspirational quote or company motto
- **Stats** - Company statistics (e.g., "500+ Products", "3 Years")
- **Gallery Images** - Photo gallery on the about page

---

### 9.8 Testimonials

**URL:** `/admin/testimonials`

Manages customer reviews displayed on the homepage.

#### Testimonial Fields

- **Customer Name** - Name of the reviewer
- **Customer Photo** - Optional profile photo
- **Customer Location (English/Macedonian)** - Where the customer is from
- **Quote (English/Macedonian)** - The review text
- **Rating** - 1 to 5 stars
- **Display Order** - Sort order
- **Active** - Whether the testimonial is visible
- **Featured** - Highlight special testimonials
- **Date** - Date of the testimonial

---

### 9.9 Admin Navigation Summary

The admin sidebar provides quick access to all sections:

| Menu Item | Description |
|-----------|-------------|
| **Dashboard** | Product management table |
| **Add Product** | Create a new product |
| **Categories** | Manage product categories |
| **Hero Slides** | Homepage hero image cards |
| **Welcome Tiles** | Homepage category shortcut tiles |
| **Instagram Promo** | Instagram feed section content |
| **Grid Images** | Homepage image gallery |
| **About Section** | About page content |
| **Testimonials** | Customer reviews |

A **"View Public Site"** link at the bottom of the sidebar opens the live website in a new tab.

---

## 10. Bilingual System

The website supports two languages:

- **Macedonian (MK)** - Default language
- **English (EN)**

### How It Works

- Users can switch languages using the language toggle in the navigation bar
- The language preference is saved in **localStorage** and persists between visits
- All database content has dual fields (e.g., `title_mk` / `title_en`, `description_mk` / `description_en`)
- Static UI text (buttons, labels, navigation) is managed in `src/i18n/translations.ts`

### Adding/Modifying Static Translations

All static text translations live in `src/i18n/translations.ts`. Each entry has a `mk` and `en` value. To modify text:

1. Open `src/i18n/translations.ts`
2. Find or add the translation key
3. Update the `mk` and/or `en` values

---

## 11. Third-Party Integrations

### Supabase

- **Dashboard:** [app.supabase.com](https://app.supabase.com)
- **Purpose:** Database, authentication, and image storage
- **Storage Bucket:** `product-images` (used for all uploaded images)

### Vercel

- **Dashboard:** [vercel.com/dashboard](https://vercel.com/dashboard)
- **Purpose:** Website hosting and deployment
- **Auto-deploy:** Triggered on push to `main` branch

### EmbedSocial

- **Purpose:** Embeds an Instagram hashtag feed on the homepage
- **Integration:** Script tag injected in the Instagram promo section component
- **Reference ID:** `5cb5f0e799a75dc479c645ee87ba49ac205fcd4c`
- **To modify the feed:** Log in to the EmbedSocial dashboard and update the widget configuration

### Google Fonts

The website uses the following fonts loaded from Google Fonts:

| Font | Usage |
|------|-------|
| **Inter** (400, 500, 700) | Primary body and UI text |
| **Satisfy** | Decorative script text |
| **Great Vibes** | Cursive accent text |

---

## 12. Security

### Authentication

- Admin login is handled by **Supabase Auth** (email/password)
- Admin routes are protected by the `ProtectedRoute` component which checks for an authenticated session
- Unauthenticated users are redirected to the login page

### Row-Level Security (RLS)

All database tables have RLS enabled:

- **Public (anonymous) users** can only **read** published/active content
- **Authenticated (admin) users** have full CRUD access (create, read, update, delete)

### HTTP Security Headers

Set via `vercel.json`:

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing |
| `X-Frame-Options` | `DENY` | Prevents the site from being embedded in iframes |
| `X-XSS-Protection` | `1; mode=block` | Enables browser XSS filtering |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls referrer information |

---

## 13. Performance & Caching

### Code Splitting

The application uses **React lazy loading** to split code into smaller chunks. Pages are loaded on demand, reducing initial load time.

### Image Optimization

- Product images support **WebP** format
- Non-critical images use **lazy loading** (`loading="lazy"`)
- Hero and product detail images load eagerly for better perceived performance

### Caching Strategy (Vercel)

| Asset Type | Cache Duration |
|------------|---------------|
| Built JS/CSS (`/assets/`) | 1 year (immutable) |
| Images (PNG, JPG, WebP, SVG) | 30 days + 1 day stale-while-revalidate |
| HTML pages | No cache (always fresh) |

### Animations

Fade-in animations are triggered by the **Intersection Observer API**, which only animates elements as they scroll into view. This avoids unnecessary rendering.

---

## 14. Troubleshooting

### Common Issues

#### Website shows a blank page

- Check that environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) are correctly set
- Check the browser console for errors
- Verify Supabase is accessible

#### Products not showing on the website

- Ensure product status is set to **"Published"** (not Draft or Sold)
- Check that the product has all required fields (title_mk, title_en, price)

#### Images not uploading

- Verify the Supabase Storage bucket `product-images` exists and has proper permissions
- Check that the image file is under 5MB
- Supported formats: PNG, JPG, GIF, WebP

#### Admin login not working

- Verify the email/password in Supabase Auth (Authentication > Users)
- Check that the Supabase URL and anon key are correct
- Clear browser cache/cookies and try again

#### Hero section not displaying

- Go to Admin > Hero Slides and ensure at least one slide is **Active**
- Verify the slide has an image uploaded

#### Language switch not working

- Clear localStorage in the browser (Developer Tools > Application > Local Storage)
- The language key stored is `sparkle-lang`

#### Instagram feed not loading

- This is handled by EmbedSocial. Check the EmbedSocial dashboard for issues
- Verify the script is loading (check browser Network tab)
- Ad blockers may prevent the embed from loading

### Getting Help

- **Supabase issues:** [supabase.com/docs](https://supabase.com/docs)
- **Vercel issues:** [vercel.com/docs](https://vercel.com/docs)
- **EmbedSocial issues:** Contact EmbedSocial support through their dashboard

---

## Appendix: URL Structure

| URL | Page |
|-----|------|
| `/` | Homepage |
| `/products` | Product catalog |
| `/products?category=<slug>&sort=<option>` | Filtered product catalog |
| `/products/:id` | Product detail page |
| `/about` | About page |
| `/contact` | Contact page |
| `/admin/login` | Admin login |
| `/admin` | Admin dashboard (products) |
| `/admin/products/new` | Add new product |
| `/admin/products/:id/edit` | Edit product |
| `/admin/categories` | Category management |
| `/admin/hero-slides` | Hero slides management |
| `/admin/welcome-tiles` | Welcome tiles management |
| `/admin/instagram-promo` | Instagram promo management |
| `/admin/grid-images` | Grid images management |
| `/admin/about-section` | About section management |
| `/admin/testimonials` | Testimonials management |

---

## Appendix: Social Media Profiles

| Platform | Handle | URL |
|----------|--------|-----|
| Instagram | @_sparkle.mk | instagram.com/_sparkle.mk |
| Facebook | Sparkle.mk | facebook.com/61567398783026 |
| TikTok | @_sparkle.mk | tiktok.com/@_sparkle.mk |
