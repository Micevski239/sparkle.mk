import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Admin pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProductForm from './pages/admin/ProductForm';
import Categories from './pages/admin/Categories';
import HeroSlides from './pages/admin/HeroSlides';
import GridImages from './pages/admin/GridImages';
import WelcomeTiles from './pages/admin/WelcomeTiles';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Admin login (no layout) */}
      <Route path="/admin/login" element={<Login />} />

      {/* Protected admin routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/products/new" element={<ProductForm />} />
          <Route path="/admin/products/:id/edit" element={<ProductForm />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin/hero-slides" element={<HeroSlides />} />
          <Route path="/admin/grid-images" element={<GridImages />} />
          <Route path="/admin/welcome-tiles" element={<WelcomeTiles />} />
        </Route>
      </Route>

      {/* 404 Catch-all */}
      <Route element={<Layout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
