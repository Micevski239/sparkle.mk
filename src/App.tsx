import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import { lazyWithRetry } from './lib/lazyWithRetry';

const AdminLayout = lazy(() => import('./components/AdminLayout'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const Analytics = lazy(() => import('@vercel/analytics/react').then(m => ({ default: m.Analytics })));
const SpeedInsights = lazy(() => import('@vercel/speed-insights/react').then(m => ({ default: m.SpeedInsights })));

function AdminAuthWrapper() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

// Public pages — only Home is eager (landing page)
import Home from './pages/Home';
const Products = lazyWithRetry(() => import('./pages/Products'), 'products');
const ProductDetail = lazyWithRetry(() => import('./pages/ProductDetail'), 'product-detail');
const About = lazyWithRetry(() => import('./pages/About'), 'about');
const Contact = lazyWithRetry(() => import('./pages/Contact'), 'contact');
const NotFound = lazyWithRetry(() => import('./pages/NotFound'), 'not-found');

// Admin pages — all lazy (behind auth wall)
const Login = lazyWithRetry(() => import('./pages/admin/Login'), 'admin-login');
const Dashboard = lazyWithRetry(() => import('./pages/admin/Dashboard'), 'admin-dashboard');
const ProductForm = lazyWithRetry(() => import('./pages/admin/ProductForm'), 'admin-product-form');
const Categories = lazyWithRetry(() => import('./pages/admin/Categories'), 'admin-categories');
const HeroSlides = lazyWithRetry(() => import('./pages/admin/HeroSlides'), 'admin-hero-slides');
const GridImages = lazyWithRetry(() => import('./pages/admin/GridImages'), 'admin-grid-images');
const WelcomeTiles = lazyWithRetry(() => import('./pages/admin/WelcomeTiles'), 'admin-welcome-tiles');
const AboutSectionAdmin = lazyWithRetry(() => import('./pages/admin/AboutSection'), 'admin-about-section');
const TestimonialsAdmin = lazyWithRetry(() => import('./pages/admin/Testimonials'), 'admin-testimonials');
const InstagramPromoAdmin = lazyWithRetry(() => import('./pages/admin/InstagramPromo'), 'admin-instagram-promo');
const ProductsAdmin = lazyWithRetry(() => import('./pages/admin/ProductsAdmin'), 'admin-products');
const GenerateThumbnails = lazyWithRetry(() => import('./pages/admin/GenerateThumbnails'), 'admin-thumbnails');

/** Fade-out and remove the HTML splash overlay. Safe to call multiple times. */
export function dismissSplash() {
  const splash = document.getElementById('splash');
  if (!splash || splash.dataset.dismissing) return;
  splash.dataset.dismissing = '1';
  splash.style.opacity = '0';
  setTimeout(() => splash.remove(), 300);
}

export default function App() {
  useEffect(() => {
    // Fallback: if no page signals readiness within 4s, dismiss anyway
    const fallback = setTimeout(dismissSplash, 4000);
    const handler = () => { clearTimeout(fallback); dismissSplash(); };
    window.addEventListener('app:content-ready', handler, { once: true });
    return () => {
      clearTimeout(fallback);
      window.removeEventListener('app:content-ready', handler);
    };
  }, []);

  return (
    <ErrorBoundary>
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <img src="/sparkle-logo.png" alt="" width="64" height="64" className="animate-pulse" />
      </div>
    }>
    <Routes>
      {/* Public routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Admin routes — AuthProvider only loads here */}
      <Route element={<AdminAuthWrapper />}>
        <Route path="/admin/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/products" element={<ProductsAdmin />} />
            <Route path="/admin/products/new" element={<ProductForm />} />
            <Route path="/admin/products/:id/edit" element={<ProductForm />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/hero-slides" element={<HeroSlides />} />
            <Route path="/admin/grid-images" element={<GridImages />} />
            <Route path="/admin/welcome-tiles" element={<WelcomeTiles />} />
            <Route path="/admin/about-section" element={<AboutSectionAdmin />} />
            <Route path="/admin/testimonials" element={<TestimonialsAdmin />} />
            <Route path="/admin/instagram-promo" element={<InstagramPromoAdmin />} />
            <Route path="/admin/generate-thumbnails" element={<GenerateThumbnails />} />
          </Route>
        </Route>
      </Route>

      {/* 404 Catch-all */}
      <Route element={<Layout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </Suspense>
    <Suspense fallback={null}>
      <Analytics />
      <SpeedInsights />
    </Suspense>
    </ErrorBoundary>
  );
}
