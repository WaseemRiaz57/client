'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    quote: "The attention to detail is simply extraordinary. It feels like wearing a piece of art.",
    author: "Waseem Riaz",
    role: "Collector, Dubai"
  },
  {
    quote: "Chronos has redefined luxury for me. The service, the packaging, the product—flawless.",
    author: "Sarah Jenkins",
    role: "Architect, London"
  },
  {
    quote: "A masterpiece that commands respect. I've never received so many compliments.",
    author: "James Carter",
    role: "CEO, New York"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-black py-32 px-6 relative border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Decorative Quote Icon */}
        <div className="mb-10 opacity-20">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="white" className="mx-auto">
            <path d="M14.017 21L14.017 18C14.017 16.896 14.321 16.035 14.929 15.418C15.536 14.802 16.291 14.493 17.194 14.493H17.514V11.493H16.208C15.352 11.493 14.924 10.983 14.924 9.962C14.924 8.941 15.352 8.431 16.208 8.431H17.514V4.43097H16.208C14.777 4.43097 13.565 4.96597 12.573 6.03597C11.581 7.10597 11.085 8.41497 11.085 9.962V21H14.017ZM6.50503 21H9.43703V9.962C9.43703 8.41497 8.94103 7.10597 7.94903 6.03597C6.95703 4.96597 5.74503 4.43097 4.31303 4.43097H3.00703V8.431H4.31303C5.16903 8.431 5.59703 8.941 5.59703 9.962C5.59703 10.983 5.16903 11.493 4.31303 11.493H3.00703V14.493H4.31303H4.32903C5.23203 14.493 5.98703 14.802 6.59403 15.418C7.20203 16.035 7.50603 16.896 7.50603 18V21H6.50503Z" />
          </svg>
        </div>

        <div className="relative h-64 flex items-center justify-center">
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
              className="absolute w-full"
            >
              <h3 className="text-2xl md:text-4xl font-serif text-white italic leading-relaxed mb-8">
                "{testimonials[currentIndex].quote}"
              </h3>
              <div className="flex flex-col items-center gap-2">
                <span className="w-12 h-[1px] bg-[#D4AF37] mb-2"></span>
                <p className="text-sm font-bold uppercase tracking-widest text-white">
                  {testimonials[currentIndex].author}
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {testimonials[currentIndex].role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1 transition-all duration-500 ${
                index === currentIndex ? "w-8 bg-[#D4AF37]" : "w-4 bg-gray-800 hover:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}