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

    const containerClasses = embedded ? 'w-full' : 'w-full px-8';

    return (
        <nav className={wrapperClasses}>
            <div className={containerClasses}>
                <div className="flex items-center justify-between h-20">
                    {/* Left: Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <img
                            src="/sparkle-logo.png"
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
                    <div className="flex items-center gap-4">
                        {/* Profile Icon */}
                        <button
                            className="p-2 text-gray-700 hover:text-dark-green transition-colors"
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

                        {/* Wishlist Icon */}
                        <button
                            className="p-2 text-gray-700 hover:text-dark-green transition-colors"
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

                        {/* Cart Icon */}
                        <button
                            className="p-2 text-gray-700 hover:text-dark-green transition-colors relative"
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

                        {showLangSwitcher && <LanguageSwitcher />}
                    </div>
                </div>
            </div>
        </nav>
    );
}
