'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ArtisansPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER SECTION */}
      <section className="px-6 py-24 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gold text-xs md:text-sm uppercase tracking-[0.3em] mb-4"
          >
            The Hands Behind the Time
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold"
          >
            Master Artisans
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="w-24 h-[1px] bg-gold mx-auto mt-8"
          />
        </div>
      </section>

      {/* MAIN CONTENT - SPLIT LAYOUT */}
      <section className="px-6 py-16 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* LEFT: Portrait Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[3/4] overflow-hidden rounded-sm border border-white/10 bg-gray-900/50"
            >
              <Image
                src="https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80"
                alt="Master Watchmaker at Work"
                fill
                className="object-cover opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-700"
              />
            </motion.div>

            {/* RIGHT: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight">
                Craftsmanship Refined Through Generations
              </h2>

              <p className="text-gray-300 text-lg leading-relaxed">
                Our master artisans dedicate their lives to perfecting the art of haute horlogerie. Each timepiece passes through dozens of skilled hands, with every component meticulously crafted, assembled, and finished to exacting standards.
              </p>

              <p className="text-gray-300 text-lg leading-relaxed">
                From the initial design sketches to the final polish, our craftsmen employ techniques passed down through centuries, combined with cutting-edge precision engineering. It is this marriage of tradition and innovation that defines our legacy.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-gold font-serif mb-2">
                    500+
                  </div>
                  <p className="text-sm text-gray-400 uppercase tracking-wider">
                    Hours per Watch
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-gold font-serif mb-2">
                    35
                  </div>
                  <p className="text-sm text-gray-400 uppercase tracking-wider">
                    Master Craftsmen
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* QUOTE BOX SECTION */}
      <section className="px-6 py-24 sm:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative bg-gradient-to-br from-gold/5 to-black border border-gold/20 rounded-sm p-12 md:p-16"
          >
            {/* Decorative Quote Mark */}
            <div className="absolute top-8 left-8 text-gold/20 text-8xl font-serif leading-none">
              "
            </div>

            <div className="relative z-10">
              <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-white italic leading-relaxed text-center">
                We do not simply build watches. We capture time itself.
              </p>
              
              <div className="flex justify-center mt-8">
                <div className="w-16 h-[2px] bg-gold" />
              </div>

              <p className="text-gold text-sm uppercase tracking-widest text-center mt-6">
                — Master Watchmaker
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WORKSHOP GALLERY SECTION */}
      <section className="px-6 py-16 sm:px-12 lg:px-24 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl md:text-4xl font-bold text-center mb-16"
          >
            Inside the Workshop
          </motion.h2>

          {/* 3-Column Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1587836374062-d60746f3c049?auto=format&fit=crop&q=80'
            ].map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative aspect-square overflow-hidden rounded-sm border border-white/10 bg-gray-900/50 group"
              >
                <Image
                  src={img}
                  alt={`Workshop detail ${index + 1}`}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA SECTION */}
      <section className="border-t border-white/10 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Witness Artistry in Motion
            </h2>
            <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
              Each timepiece in our collection represents hundreds of hours of dedication by our master craftsmen.
            </p>
            <a
              href="/shop"
              className="inline-block bg-gold hover:bg-gold/90 text-black font-bold px-12 py-4 transition-all duration-300 uppercase tracking-wider"
            >
              View Collection
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
