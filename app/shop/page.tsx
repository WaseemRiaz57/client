'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';

// ✅ 1. API URL Constant defined here
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://https://luxewatch-backend.onrender.com';

interface Product {
  _id: string;
  modelName: string;
  brand: string;
  price: number;
  images: string[];
  stock?: number;
}

const ITEMS_PER_PAGE = 9;

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get('/products');
        const productsList = Array.isArray(data) ? data : (Array.isArray(data.products) ? data.products : []);
        setAllProducts(productsList);
      } catch (error: any) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...allProducts];
    
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.modelName.toLowerCase().includes(searchQuery) ||
        product.brand.toLowerCase().includes(searchQuery)
      );
    }
    
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchQuery, allProducts]);

  // ✅ 2. Image URL Fix Function
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1200&auto=format&fit=crop';
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    if (imagePath.startsWith('/')) {
      // Yahan ab hum 'API_URL' use kar rahe hain bajaye localhost ke
      return `${API_URL}${imagePath}`;
    }
    return imagePath;
  };

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages || totalPages === 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <div className="border-b border-gold/20 bg-black/50 px-6 py-16 text-center">
        <div className="mx-auto max-w-7xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-5xl font-bold md:text-6xl"
          >
            Luxury Timepieces
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-body text-lg text-gray-400"
          >
            Discover exquisite craftsmanship and timeless elegance
          </motion.p>
          {searchQuery && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-gold"
            >
              Search results for: <span className="font-semibold">"{searchQuery}"</span>
            </motion.p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-12 lg:px-24">
        <div className="mb-12 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {loading ? 'Loading...' : `${filteredProducts.length} timepieces found`}
          </p>
          {totalPages > 0 && (
            <p className="text-sm text-gray-400">
              Page <span className="text-gold font-semibold">{currentPage}</span> of <span className="text-gold font-semibold">{totalPages}</span>
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold border-t-transparent" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-xl text-gray-400">
              {searchQuery ? `No timepieces found for '${searchQuery}'` : 'No products found'}
            </p>
            {searchQuery && (
              <button
                onClick={() => router.push('/shop')}
                className="mt-6 inline-block border-2 border-gold px-6 py-3 text-gold hover:bg-gold hover:text-black transition"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 mb-16">
              {paginatedProducts.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group"
                >
                  <Link href={`/product/${product._id}`}>
                    <div className="relative aspect-square overflow-hidden bg-gray-900/50 mb-4 rounded-sm border border-gold/10 transition-all group-hover:border-gold/50">
                      <Image
                        src={getImageUrl(product.images?.[0])}
                        alt={product.modelName}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </Link>

                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-gold">
                      {product.brand}
                    </p>
                    <Link href={`/product/${product._id}`}>
                      <h3 className="font-heading text-xl font-semibold transition-colors group-hover:text-gold">
                        {product.modelName}
                      </h3>
                    </Link>
                    <p className="text-lg font-bold text-gold">
                      ${product.price.toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      addItem({
                        id: product._id,
                        modelName: product.modelName,
                        price: product.price,
                        image: product.images?.[0] || '',
                        quantity: 1,
                      });
                      toast.success('Added to cart!');
                    }}
                    className="mt-4 w-full rounded-sm border-2 border-gold bg-transparent py-3 font-semibold text-gold transition hover:bg-gold hover:text-black"
                  >
                    Add to Cart
                  </button>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="border-t border-gold/20 pt-12 flex items-center justify-center gap-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={isPrevDisabled}
                  className={`flex items-center gap-2 px-6 py-3 border-2 border-gold rounded-sm font-semibold transition ${
                    isPrevDisabled
                      ? 'border-gold/30 text-gold/30 cursor-not-allowed'
                      : 'border-gold text-gold hover:bg-gold hover:text-black'
                  }`}
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>

                <div className="flex items-center gap-2 px-6 py-3">
                  <span className="text-sm text-gray-400">Page</span>
                  <span className="text-xl font-bold text-gold">{currentPage}</span>
                  <span className="text-sm text-gray-400">of</span>
                  <span className="text-xl font-bold text-gold">{totalPages}</span>
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={isNextDisabled}
                  className={`flex items-center gap-2 px-6 py-3 border-2 border-gold rounded-sm font-semibold transition ${
                    isNextDisabled
                      ? 'border-gold/30 text-gold/30 cursor-not-allowed'
                      : 'border-gold text-gold hover:bg-gold hover:text-black'
                  }`}
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            <div className="mt-16 text-center border-t border-white/10 pt-12">
              <p className="text-gray-400 mb-6 italic">Found what you were looking for?</p>
              <Link href="/cart">
                <button className="bg-transparent border border-[#D4AF37] text-[#D4AF37] px-10 py-4 uppercase tracking-[0.2em] font-bold hover:bg-[#D4AF37] hover:text-black transition-all duration-300">
                  View Cart & Checkout
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold border-t-transparent" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}