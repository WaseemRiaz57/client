'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  brand: string;
}

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  
  // Image URL Helper
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  return (
    <section className="bg-[#050505] py-24 px-6 md:px-12 border-t border-white/5">
      
      {/* Section Header */}
      <div className="max-w-[1800px] mx-auto mb-16 flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-8">
        <div>
          <span className="text-[#D4AF37] tracking-[0.3em] text-xs font-bold uppercase mb-2 block">
            Selected for you
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white">
            Signature Collection
          </h2>
        </div>
        <Link href="/shop" className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors group mt-4 md:mt-0">
          <span className="uppercase tracking-[0.2em] text-xs">View All</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Products Grid */}
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <Link href={`/product/${product._id}`} key={product._id}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-[#0a0a0a] border border-white/5 p-4 hover:border-[#D4AF37]/50 transition-colors duration-500"
            >
              
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-[#111]">
                <img
                  src={getImageUrl(product.images?.[0])}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                
                {/* Overlay Tag */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1">
                  <span className="text-[10px] uppercase tracking-widest text-white">
                    {product.brand}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-serif text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm">Automatic Movement</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium text-white">
                    Rs. {product.price.toLocaleString()}
                  </p>
                </div>
              </div>

            </motion.div>
          </Link>
        ))}
      </div>

      {/* Mobile View All Button */}
      <div className="mt-12 text-center md:hidden">
        <Link href="/shop" className="inline-block border border-white/20 px-8 py-4 text-white uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all">
          View All Timepieces
        </Link>
      </div>
    </section>
  );
}