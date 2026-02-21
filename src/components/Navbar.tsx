import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

interface NavbarProps {
    embedded?: boolean; // when true, used inside a page section (not sticky, no outer gutters)
    showLangSwitcher?: boolean; // optionally hide duplicated switcher on pages
}

export default function Navbar({ embedded = false, showLangSwitcher = true }: NavbarProps) {
    const { t } = useLanguage();
    const location = useLocation();

    const navLinks = [
        { path: '/', label: t.nav.home },
        { path: '/products', label: 'Shop' },
        { path: '/products', label: 'Categories' }, // Will link to products with categories
        { path: '/products', label: 'Gallery' }, // Will link to products page as gallery
    ];

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const wrapperClasses = embedded
        ? 'bg-white border-b border-gray-200'
        : 'sticky top-0 z-50 bg-white border-b border-gray-200';

    const containerClasses = embedded ? 'w-full' : 'w-full px-4 sm:px-8';

    return (
        <nav className={wrapperClasses}>
            <div className={containerClasses}>
                <div className="flex items-center justify-between h-16 md:h-20 relative">
                    {/* Left: Language switcher on mobile, Logo on desktop */}
                    <Link to="/" className="hidden lg:flex items-center gap-3">
                        <img
                            src="/sparkle-logo.webp"
                            alt="Sparkle.mk logo"
                            className="h-12 md:h-14 w-auto"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                        <span className="text-2xl md:text-3xl font-brand text-dark-green leading-none">
                            sparkle.mk
                        </span>
                    </Link>
                    <div className="lg:hidden">
                        {showLangSwitcher && <LanguageSwitcher />}
                    </div>

                    {/* Center: Logo on mobile */}
                    <Link to="/" className="lg:hidden absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                        <span className="text-xl font-brand text-dark-green leading-none whitespace-nowrap">
                            sparkle.mk
                        </span>
                    </Link>

                    {/* Center: Navigation Links */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link, index) => (
                            <Link
                                key={link.path + index}
                                to={link.path}
                                className={`text-sm font-medium transition-colors ${isActive(link.path)
                                        ? 'text-dark-green'
                                        : 'text-gray-700 hover:text-dark-green'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right: Icon Buttons */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Profile Icon - desktop only */}
                        <button
                            className="hidden lg:block p-2 text-gray-700 hover:text-dark-green transition-colors"
                            aria-label="Profile"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </button>

                        {/* Wishlist Icon - desktop only */}
                        <button
                            className="hidden lg:block p-2 text-gray-700 hover:text-dark-green transition-colors"
                            aria-label="Wishlist"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        </button>

                        {/* Cart Icon - desktop only */}
                        <button
                            className="hidden lg:block p-2 text-gray-700 hover:text-dark-green transition-colors relative"
                            aria-label="Cart"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </button>

                        {showLangSwitcher && <div className="hidden lg:block"><LanguageSwitcher /></div>}

                        {/* Mobile: social icons + hamburger */}
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hidden sm:block lg:hidden p-1.5 text-gray-700 hover:text-dark-green transition-colors" aria-label="Instagram">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hidden sm:block lg:hidden p-1.5 text-gray-700 hover:text-dark-green transition-colors" aria-label="Facebook">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                        <button
                            className="lg:hidden p-1.5 text-gray-700 hover:text-dark-green transition-colors"
                            aria-label="Menu"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
