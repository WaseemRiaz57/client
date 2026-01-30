'use client';

import { motion } from 'framer-motion';

export default function Marquee() {
  const marqueeVariants = {
    animate: {
      x: [0, -1000],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    },
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#D4AF37] py-3 md:py-4 border-y border-white/10">
      <div className="absolute inset-0 bg-black/90" /> {/* Dark overlay over gold to make it subtle */}
      
      <div className="relative flex whitespace-nowrap overflow-hidden">
        <motion.div
          className="flex gap-16 md:gap-32 items-center"
          variants={marqueeVariants}
          animate="animate"
        >
          {[...Array(8)].map((_, i) => (
            <span key={i} className="text-[#D4AF37] text-xs md:text-sm font-bold tracking-[0.3em] uppercase flex items-center gap-16 md:gap-32">
              SWISS PRECISION <span className="w-2 h-2 rounded-full bg-white/20" /> 
              TIMELESS LEGACY <span className="w-2 h-2 rounded-full bg-white/20" />
              MASTER CRAFTSMANSHIP <span className="w-2 h-2 rounded-full bg-white/20" />
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}