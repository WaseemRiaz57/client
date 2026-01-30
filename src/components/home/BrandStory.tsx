'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function BrandStory() {
  return (
    <section className="relative bg-[#080808] text-white py-24 md:py-32 overflow-hidden border-t border-white/5">
      
      {/* Background Subtle Pattern (Optional decorative element) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full fill-current text-[#D4AF37]">
          <circle cx="100" cy="100" r="90" />
        </svg>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left: Image Composition */}
        <div className="relative order-2 lg:order-1">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative z-10 aspect-[4/5] md:aspect-square overflow-hidden bg-[#111]"
          >
            {/* Watchmaker Image */}
            <img 
              src="https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=2000&auto=format&fit=crop" 
              alt="Master Watchmaker at work" 
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-700 scale-105 hover:scale-100 transition-transform"
            />
            
            {/* Dark Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

            {/* Floating Badge */}
            <div className="absolute bottom-8 left-8 bg-black/80 backdrop-blur-md border border-white/10 px-6 py-4">
               <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-1">Handcrafted</p>
               <p className="text-white text-lg font-serif italic">Since 1875</p>
            </div>
          </motion.div>
          
          {/* Gold Border Offset (Decorative Frame) */}
          <div className="absolute -top-6 -left-6 w-full h-full border border-[#D4AF37]/20 z-0 hidden md:block"></div>
        </div>

        {/* Right: Content */}
        <div className="relative order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-[#D4AF37] tracking-[0.3em] uppercase text-xs font-bold mb-6 block">
              Our Philosophy
            </span>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-8 leading-[1.1]">
              The Art of <br />
              <span className="italic text-gray-500">Precision.</span>
            </h2>

            <div className="space-y-6 text-gray-400 font-light text-lg leading-relaxed max-w-xl">
              <p>
                At Chronos, we believe a watch is more than a device to tell time—it is a keeper of moments. Our journey began with a simple philosophy: perfection is not a destination, but a continuous pursuit.
              </p>
              <p>
                Each timepiece in our collection is curated from the world's finest artisans, ensuring that when you wear a Chronos watch, you are wearing a piece of history engineered for the future.
              </p>
            </div>

            <div className="mt-12 flex items-center gap-8">
               <Link href="/about" className="group inline-flex items-center gap-4 text-white uppercase tracking-[0.2em] text-xs hover:text-[#D4AF37] transition-colors">
                 Read Our Story
                 <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
               </Link>
               
               {/* Signature (Optional Visual) */}
               <div className="font-serif italic text-2xl text-white/30 select-none">
                  Chronos.
               </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}