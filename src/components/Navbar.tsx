'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';

export default function Navbar() {
  const router = useRouter();
  const [hidden, setHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { scrollY } = useScroll();
  
  // ✅ Cart Store Integration (Old Functionality Kept)
  const totalItems = useCartStore((state) => state.totalItems);

  // Scroll Logic: Hide on scroll down, Show on scroll up
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true); 
      setIsMobileMenuOpen(false); // Close mobile menu on scroll
    } else {
      setHidden(false);
    }
  });

  const navLinks = [
    { name: 'Collections', href: '/shop' },
    { name: 'Heritage', href: '/heritage' },
    { name: 'Artisans', href: '/artisans' }
  ];

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -100, opacity: 0 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
      >
        {/* Glass Pill Container */}
        <div className="pointer-events-auto backdrop-blur-xl bg-black/40 border border-white/10 rounded-full px-6 md:px-8 py-3 md:py-4 flex items-center justify-between gap-6 md:gap-24 shadow-2xl shadow-black/50">
          
          {/* Left: Brand */}
          <Link href="/" className="font-serif text-lg md:text-xl tracking-[0.2em] text-white font-bold whitespace-nowrap">
            CHRONOS
          </Link>

          {/* Center: Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="text-[10px] lg:text-xs uppercase tracking-[0.15em] text-gray-300 hover:text-[#D4AF37] transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-300 hover:text-white transition-colors hidden sm:block"
            >
              <Search className="w-4 h-4" />
            </button>
            
            {/* Cart Icon with Count */}
            <Link href="/cart" className="relative text-gray-300 hover:text-white transition-colors">
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#D4AF37] text-[9px] font-bold text-black animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Search Input Field */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-20 left-1/2 transform -translate-x-1/2 w-80 max-w-[90vw]"
            >
              <input
                type="text"
                placeholder="Search timepieces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                autoFocus
                className="w-full bg-black/80 border border-[#D4AF37] text-white placeholder-gray-500 px-4 py-3 rounded-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Full Screen Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-32 px-6 md:hidden flex flex-col items-center"
          >
            <div className="flex flex-col items-center gap-8 w-full">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-serif text-white uppercase tracking-[0.2em] hover:text-[#D4AF37] transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="w-12 h-[1px] bg-white/10 my-4"></div>

              <Link
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-gray-400 uppercase tracking-widest hover:text-white"
              >
                Shop All
              </Link>

              {/* Admin Link (Only in Mobile Menu for discretion) */}
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs text-gray-600 uppercase tracking-widest mt-8 hover:text-gray-400"
              >
                Admin Panel
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}