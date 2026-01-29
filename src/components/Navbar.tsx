'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const totalItems = useCartStore((state) => state.totalItems);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <svg
                className="h-6 w-6 text-gold"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="font-heading text-2xl font-bold text-primary">
              LuxWatch
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="font-body text-sm font-medium uppercase tracking-wider text-gray-700 transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="font-body text-sm font-medium uppercase tracking-wider text-gray-700 transition-colors hover:text-primary"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="font-body text-sm font-medium uppercase tracking-wider text-gray-700 transition-colors hover:text-primary"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="font-body text-sm font-medium uppercase tracking-wider text-gray-700 transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link href="/cart" className="relative">
              <svg
                className="h-6 w-6 text-gray-700 transition-colors hover:text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-bold text-black">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="hidden items-center gap-3 md:flex">
                <span className="font-body text-sm text-gray-700">
                  {user.name}
                </span>
                <Link
                  href="/orders"
                  className="font-body text-sm font-medium uppercase tracking-wider text-gray-700 transition-colors hover:text-primary"
                >
                  Orders
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="rounded-lg bg-primary px-4 py-2 font-body text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-gray-800"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="font-body text-sm font-medium uppercase tracking-wider text-gray-700 transition-colors hover:text-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-3 md:flex">
                <Link
                  href="/login"
                  className="font-body text-sm font-medium uppercase tracking-wider text-gray-700 transition-colors hover:text-primary"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-primary px-4 py-2 font-body text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-gray-800"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              <svg
                className="h-6 w-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="space-y-1 px-4 py-4">
            <Link
              href="/"
              className="block py-2 font-body text-sm font-medium uppercase tracking-wider text-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block py-2 font-body text-sm font-medium uppercase tracking-wider text-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/about"
              className="block py-2 font-body text-sm font-medium uppercase tracking-wider text-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block py-2 font-body text-sm font-medium uppercase tracking-wider text-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {user ? (
              <>
                <div className="border-t border-gray-200 pt-2">
                  <p className="py-2 font-body text-sm text-gray-700">
                    {user.name}
                  </p>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="block py-2 font-body text-sm font-medium uppercase tracking-wider text-gray-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block py-2 font-body text-sm font-medium uppercase tracking-wider text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-gray-200 pt-2">
                <Link
                  href="/login"
                  className="block py-2 font-body text-sm font-medium uppercase tracking-wider text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block py-2 font-body text-sm font-medium uppercase tracking-wider text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
