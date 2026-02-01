'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    year: "EST. 1875",
    subtitle: "SWISS MASTERY",
    title: ["TIMELESS", "PERFECTION"],
    description: "Where centuries of horological artistry converge with cutting-edge innovation. Each timepiece represents 500+ hours of meticulous handcrafting.",
    image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=2574&auto=format&fit=crop",
    accent: "#D4AF37"
  },
  {
    id: 2,
    year: "LIMITED EDITION",
    subtitle: "HERITAGE COLLECTION",
    title: ["BEYOND", "TIME"],
    description: "An investment in eternity. Only 100 pieces worldwide, each numbered and authenticated with our proprietary certification system.",
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=2588&auto=format&fit=crop",
    accent: "#C9B037"
  },
  {
    id: 3,
    year: "MASTERPIECE",
    subtitle: "TOURBILLON SERIES",
    title: ["REDEFINING", "LUXURY"],
    description: "The pinnacle of mechanical achievement. A symphony of 387 components dancing in perfect harmony, visible through our signature sapphire crystal.",
    image: "https://images.unsplash.com/photo-1623998021450-85c29c644e0d?q=80&w=2607&auto=format&fit=crop",
    accent: "#FFD700"
  }
];

export default function FinalLuxuryWatchHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cursorVariant, setCursorVariant] = useState('default');
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  const audioRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
  cursorX.set(e.clientX - 16);
  cursorY.set(e.clientY - 16);
};
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  const currentSlide = slides[currentIndex];

  const handleSlideChange = (index: number) => {
  setCurrentIndex(index);
}
  return (
    <>
      {/* Custom Cursor */}
      <motion.div
        className="fixed w-8 h-8 pointer-events-none z-[100] mix-blend-difference hidden lg:block"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
        }}
      >
        <motion.div
          animate={{
            scale: cursorVariant === 'hover' ? 2 : 1,
            opacity: cursorVariant === 'hover' ? 0.5 : 1,
          }}
          className="w-full h-full rounded-full border-2 border-white"
        />
      </motion.div>

      <section className="relative h-screen w-full bg-black overflow-hidden flex items-center">
        
        {/* Animated grain texture overlay */}
        <div className="absolute inset-0 z-[5] opacity-[0.015] pointer-events-none mix-blend-overlay">
          <div className="absolute inset-0 bg-repeat animate-grain" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 h-full w-full"
          >
            {/* Background Image - Layer 1 */}
            <div className="absolute inset-0 z-0">
              <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 8, ease: "linear" }}
                className="h-full w-full"
              >
                <div className="relative h-full w-full">
                  <img
                    src={currentSlide.image}
                    alt="Luxury Watch"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </motion.div>
            </div>

            {/* Gradient Overlays - Layer 2 */}
            <div className="absolute inset-0 z-[1]">
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
            </div>

            {/* Main Content - Layer 5 */}
            <div className="absolute inset-0 z-[10] flex items-center pointer-events-none">
              <div className="w-full max-w-[1800px] mx-auto px-6 lg:px-16 xl:px-24">
                <div className="max-w-4xl">
                  
                  {/* Year Badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="inline-block mb-4 md:mb-6"
                  >
                    <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-full px-5 py-2">
                      <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase font-medium" style={{ color: currentSlide.accent }}>
                        {currentSlide.year}
                      </span>
                    </div>
                  </motion.div>

                  {/* Decorative Line */}
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 80, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                    className="h-[1px] mb-4 md:mb-6"
                    style={{ backgroundColor: currentSlide.accent }}
                  />

                  {/* Subtitle */}
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-xs md:text-sm font-semibold tracking-[0.4em] uppercase mb-4"
                    style={{ color: currentSlide.accent }}
                  >
                    {currentSlide.subtitle}
                  </motion.p>

                  {/* Animated Title (FIXED: Reduced Size + Added Padding to prevent cut) */}
                  <div className="mb-4 md:mb-6">
                    {currentSlide.title.map((word, idx) => (
                      <div key={idx} className="overflow-hidden pb-3"> 
                        <motion.h1
                          initial={{ y: 100, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ 
                            duration: 1.2, 
                            delay: 0.7 + idx * 0.15,
                            ease: [0.22, 1, 0.36, 1]
                          }}
                          // Size reduced from xl:text-[9rem] to xl:text-8xl to fit screen
                          className="text-5xl md:text-7xl lg:text-8xl xl:text-8xl font-serif text-white leading-tight" 
                          style={{ 
                            fontFamily: "'Bodoni Moda', serif",
                            fontWeight: 700,
                            fontStyle: 'italic'
                          }}
                        >
                          {word}
                        </motion.h1>
                      </div>
                    ))}
                  </div>

                  {/* Description - Adjusted spacing */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-xl font-light"
                  >
                    {currentSlide.description}
                  </motion.p>

                  {/* Time Display & Button Container */}
                   <div className="flex flex-col md:flex-row md:items-center gap-8 pointer-events-auto">
                      
                      {/* CTA Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.4 }}
                      >
                        <Link 
                          href="/shop"
                          className="group relative inline-flex items-center gap-4"
                          onMouseEnter={() => setCursorVariant('hover')}
                          onMouseLeave={() => setCursorVariant('default')}
                        >
                          <div className="relative px-10 py-5 overflow-hidden border border-white/20 bg-black/20 backdrop-blur-sm transition-all duration-300 hover:border-white/40">
                            {/* Animated background */}
                            <motion.div
                              className="absolute inset-0 opacity-0 group-hover:opacity-10"
                              style={{ backgroundColor: currentSlide.accent }}
                              transition={{ duration: 0.3 }}
                            />
                            
                            <span className="relative flex items-center gap-4 text-white font-bold text-xs md:text-sm tracking-[0.2em] uppercase">
                              Explore
                              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </Link>
                      </motion.div>

                      {/* Time Display (Next to button) */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.6 }}
                        className="hidden md:block"
                      >
                        <div className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-medium border-l border-white/20 pl-4">
                           Since 1875 <br />
                           <span className="text-white/70 text-sm mt-1 block tabular-nums">
                             {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                           </span>
                        </div>
                      </motion.div>
                   </div>
                  
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* --- BOTTOM UI ELEMENTS --- */}
        
        {/* Progress Indicators - BOTTOM RIGHT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 right-6 lg:right-16 z-[60] pointer-events-auto"
        >
          <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-full px-6 py-3">
            <div className="flex items-center gap-6">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => handleSlideChange(index)}
                  className="group relative"
                  onMouseEnter={() => setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant('default')}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90 absolute inset-0">
                        <circle
                          cx="20"
                          cy="20"
                          r="18"
                          fill="none"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="1.5"
                        />
                        {index === currentIndex && (
                          <motion.circle
                            cx="20"
                            cy="20"
                            r="18"
                            fill="none"
                            stroke={currentSlide.accent}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 8, ease: "linear" }}
                            style={{ 
                              filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.6))'
                            }}
                          />
                        )}
                      </svg>
                      <span 
                        className={`text-xs font-bold transition-all duration-300 ${
                          index === currentIndex 
                            ? 'text-white scale-110' 
                            : 'text-gray-600 group-hover:text-gray-400'
                        }`}
                      >
                        {index + 1}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Hidden audio element */}
        <audio ref={audioRef} src="/tick.mp3" />
      </section>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@1,700&family=Playfair+Display:wght@400;600;700&display=swap');
        
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          30% { transform: translate(3%, -15%); }
          50% { transform: translate(12%, 9%); }
          70% { transform: translate(9%, 4%); }
          90% { transform: translate(-1%, 7%); }
        }
        
        .animate-grain {
          animation: grain 8s steps(10) infinite;
        }
      `}</style>
    </>
  );
}