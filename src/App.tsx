import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';

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
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin pages — all lazy (behind auth wall)
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProductForm = lazy(() => import('./pages/admin/ProductForm'));
const Categories = lazy(() => import('./pages/admin/Categories'));
const HeroSlides = lazy(() => import('./pages/admin/HeroSlides'));
const GridImages = lazy(() => import('./pages/admin/GridImages'));
const WelcomeTiles = lazy(() => import('./pages/admin/WelcomeTiles'));
const AboutSectionAdmin = lazy(() => import('./pages/admin/AboutSection'));
const TestimonialsAdmin = lazy(() => import('./pages/admin/Testimonials'));

export default function App() {
  useEffect(() => {
    const splash = document.getElementById('splash');
    if (splash) {
      setTimeout(() => {
        splash.style.opacity = '0';
        setTimeout(() => splash.remove(), 800);
      }, 400);
    }
  }, []);

  return (
    <ErrorBoundary>
    <Suspense fallback={null}>
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
