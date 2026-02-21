import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import { lazyWithRetry } from './lib/lazyWithRetry';

const AdminLayout = lazy(() => import('./components/AdminLayout'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

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

export default function App() {
  useEffect(() => {
    const splash = document.getElementById('splash');
    if (!splash) return;

    const dismiss = () => {
      splash.style.opacity = '0';
      setTimeout(() => splash.remove(), 800);
    };

    // Dismiss splash once the main thread is idle (or after 1s max)
    if ('requestIdleCallback' in window) {
      (window as Window).requestIdleCallback(dismiss, { timeout: 1000 });
    } else {
      setTimeout(dismiss, 100);
    }
  }, []);

  return (
    <ErrorBoundary>
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
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
            <Route path="/admin/products/new" element={<ProductForm />} />
            <Route path="/admin/products/:id/edit" element={<ProductForm />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/hero-slides" element={<HeroSlides />} />
            <Route path="/admin/grid-images" element={<GridImages />} />
            <Route path="/admin/welcome-tiles" element={<WelcomeTiles />} />
            <Route path="/admin/about-section" element={<AboutSectionAdmin />} />
            <Route path="/admin/testimonials" element={<TestimonialsAdmin />} />
            <Route path="/admin/instagram-promo" element={<InstagramPromoAdmin />} />
          </Route>
        </Route>
      </Route>

      {/* 404 Catch-all */}
      <Route element={<Layout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </Suspense>
    </ErrorBoundary>
  );
}
