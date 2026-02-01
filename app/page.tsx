'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BrandStory from '@/components/home/BrandStory';
import Testimonials from '@/components/home/Testimonials';
import Marquee from '@/components/home/Marquee'; 

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // ✅ FIX: Removed extra 'http://' from the start
        const { data } = await axios.get('https://luxewatch-backend.onrender.com/api/products'); 
        const productList = Array.isArray(data) ? data : (data.products || []);
        setProducts(productList.slice(0, 3)); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main className="bg-black min-h-screen text-white selection:bg-[#D4AF37] selection:text-black">
      {/* 1. HERO SECTION (Pure Black) - Negative margin to overlap behind navbar */}
      <div className="relative z-10 bg-black -mt-32">
        <Hero />
      </div>

      {/* --- SEPARATOR 1: GOLD LINE WITH DIAMOND --- */}
      <div className="relative flex items-center justify-center py-12 bg-black">
         <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent max-w-4xl mx-auto"></div>
         <div className="absolute bg-black px-4 text-[#D4AF37] text-xl">◇</div>
      </div>

      {/* 2. FEATURED PRODUCTS (Dark Charcoal for Contrast) */}
      <div className="relative z-20 bg-[#050505] pb-12">
        {/* Top Fade Overlay */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black to-transparent pointer-events-none" />
        
        {loading ? (
          <div className="h-96 flex items-center justify-center">
             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D4AF37]"></div>
          </div>
        ) : (
          <FeaturedProducts products={products} />
        )}
      </div>

      {/* --- SEPARATOR 2: SCROLLING MARQUEE --- */}
      <div className="relative z-30 my-0">
        <Marquee />
      </div>

      {/* 3. BRAND STORY (Black with Texture) */}
      <div className="relative z-20 bg-[#000000]">
        <div className="absolute inset-0 opacity-[0.05]" 
             style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }}>
        </div>
        <BrandStory />
      </div>

      {/* --- SEPARATOR 3: SIMPLE GOLD LINE --- */}
      <div className="w-full h-[1px] bg-[#D4AF37]/20"></div>

      {/* 4. TESTIMONIALS (Dark Charcoal) */}
      <div className="relative z-20 bg-[#050505]">
         <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black to-transparent pointer-events-none" />
        <Testimonials />
      </div>

      {/* Footer Top Border */}
      <div className="w-full h-2 bg-gradient-to-r from-black via-[#D4AF37] to-black"></div>

    </main>
  );
}