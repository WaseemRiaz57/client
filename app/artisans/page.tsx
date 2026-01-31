'use client';

import { motion } from 'framer-motion';

export default function ArtisansPage() {
  return (
    <div className="bg-black min-h-screen text-white pt-32 pb-24 px-6 md:px-12 selection:bg-[#D4AF37] selection:text-black">
      
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-16 border-b border-white/10 pb-8">
         <motion.h1 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-4xl md:text-6xl font-serif text-white mb-4"
         >
           Master Artisans
         </motion.h1>
         <p className="text-[#D4AF37] tracking-[0.3em] text-xs font-bold uppercase">
           The Hands Behind the Time
         </p>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
         
         {/* Left Column: Image */}
         <motion.div
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="relative aspect-[3/4] bg-[#111] border border-white/10 overflow-hidden"
         >
           <img
             src="https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=2000&auto=format&fit=crop"
             alt="Watchmaker working"
             className="w-full h-full object-cover opacity-90 hover:scale-105 hover:opacity-100 transition-transform duration-1000"
           />
           <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-6">
              <span className="text-white font-serif text-lg block">Elias Thorne</span>
              <span className="text-[#D4AF37] text-xs uppercase tracking-widest">Head of Assembly</span>
           </div>
         </motion.div>

         {/* Right Column: Text Content */}
         <motion.div
           initial={{ opacity: 0, x: 50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="space-y-8"
         >
            <h2 className="text-3xl md:text-4xl font-serif text-white">
              The Art of <br/>
              <span className="text-gray-500 italic">Precision Engineering.</span>
            </h2>
            
            <p className="text-gray-400 text-lg leading-relaxed font-light">
              A single Chronos timepiece consists of over 300 microscopic parts. Our artisans spend years mastering the patience required to breathe life into these mechanical marvels.
            </p>

            <p className="text-gray-400 text-lg leading-relaxed font-light">
              From the initial design sketches to the final polish, our craftsmen employ techniques passed down through centuries, combined with cutting-edge precision engineering. It is this marriage of tradition and innovation that defines our legacy.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
               <div>
                 <span className="block text-4xl text-[#D4AF37] font-serif mb-1">500+</span>
                 <span className="text-xs text-gray-500 uppercase tracking-widest">Hours per Watch</span>
               </div>
               <div>
                 <span className="block text-4xl text-[#D4AF37] font-serif mb-1">35</span>
                 <span className="text-xs text-gray-500 uppercase tracking-widest">Master Craftsmen</span>
               </div>
            </div>
         </motion.div>
      </div>
    </div>
  );
}