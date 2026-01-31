'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function HeritagePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);

  const milestones = [
    {
      year: '1875',
      title: 'The Beginning',
      description: 'In a modest workshop nestled in the Swiss mountains, our founder crafted the first timepiece bearing our name. Each component meticulously hand-finished, setting the standard for generations to come.',
      image: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?q=80&w=1000&auto=format&fit=crop',
      align: 'left' // text on left, image on right
    },
    {
      year: '1950',
      title: 'The Golden Era',
      description: 'Post-war innovation met timeless craftsmanship. We introduced our iconic automatic movement, a masterpiece of engineering that would define luxury watchmaking for decades.',
      image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1000&auto=format&fit=crop',
      align: 'right' // text on right, image on left
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white">
      {/* HERO SECTION */}
      <motion.section
        style={{ opacity: heroOpacity }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image with Parallax */}
        <motion.div
          style={{ scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1584208124997-01a613271780?auto=format&fit=crop&q=80"
            alt="Vintage Watchmaking"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-gold text-xs md:text-sm uppercase tracking-[0.3em] mb-6"
          >
            Since 1875
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
          >
            A Legacy in Time
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="w-24 h-[1px] bg-gold mx-auto"
          />
        </div>
      </motion.section>

      {/* TIMELINE SECTION */}
      <section className="relative z-10 py-32 px-6 sm:px-12 lg:px-24 bg-black">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Our Journey
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Over a century of horological excellence, crafted through dedication, innovation, and an unwavering commitment to perfection.
            </p>
          </motion.div>

          {/* Milestones */}
          <div className="space-y-40">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-150px" }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  milestone.align === 'right' ? 'lg:grid-flow-dense' : ''
                }`}
              >
                {/* Text Content */}
                <div className={milestone.align === 'right' ? 'lg:col-start-2' : ''}>
                  <div className="relative">
                    {/* Year Badge */}
                    <div className="inline-block mb-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full" />
                        <div className="relative border-2 border-gold px-8 py-3 rounded-full">
                          <span className="text-gold text-2xl md:text-3xl font-bold font-serif">
                            {milestone.year}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                      {milestone.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {milestone.description}
                    </p>

                    {/* Decorative Line */}
                    <div className="mt-8 w-16 h-[2px] bg-gold" />
                  </div>
                </div>

                {/* Image */}
                <div className={milestone.align === 'right' ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                    className="relative aspect-square overflow-hidden rounded-sm border border-white/10 bg-gray-900/50"
                  >
                    <Image
                      src={milestone.image}
                      alt={milestone.title}
                      fill
                      className="object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Closing Statement */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mt-40 border-t border-white/10 pt-24"
          >
            <p className="font-serif text-2xl md:text-3xl text-gray-300 italic max-w-3xl mx-auto leading-relaxed">
              "Every timepiece we create is not merely an instrument—it is a promise. A promise of excellence, heritage, and timeless beauty."
            </p>
            <p className="text-gold text-sm uppercase tracking-widest mt-8">
              — Our Founder
            </p>
          </motion.div>
        </div>
      </section>

      {/* BOTTOM CTA SECTION */}
      <section className="relative border-t border-white/10 py-24 px-6 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Experience the Legacy
            </h2>
            <p className="text-gray-400 text-lg mb-12">
              Discover timepieces that carry over a century of mastery and innovation.
            </p>
            <a
              href="/shop"
              className="inline-block bg-gold hover:bg-gold/90 text-black font-bold px-12 py-4 transition-all duration-300 uppercase tracking-wider"
            >
              Explore Collection
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
