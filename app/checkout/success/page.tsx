'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg rounded-sm border border-gold/30 bg-gradient-to-b from-gray-900/50 to-black/50 p-12 text-center"
      >
        
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8 flex justify-center"
        >
          <div className="rounded-full bg-gold/10 border border-gold/30 p-4">
            <CheckCircle className="h-16 w-16 text-gold" strokeWidth={1.5} />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-2 font-heading text-4xl font-bold text-white"
        >
          Thank You!
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-10 font-body text-gray-400 text-lg"
        >
          Your luxury timepiece order has been placed successfully. We are preparing it for shipment.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <Link 
            href="/shop" 
            className="flex w-full items-center justify-center rounded-sm bg-gold text-black py-4 font-heading font-semibold transition hover:bg-gold/90"
          >
            Continue Shopping
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>

          <Link 
            href="/" 
            className="flex w-full items-center justify-center rounded-sm border border-gold/30 py-4 font-semibold text-gold transition hover:bg-gold/5"
          >
            Back to Home
          </Link>
        </motion.div>

        {/* Footer Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 pt-8 border-t border-gold/10 text-xs text-gray-500"
        >
          📧 A confirmation email has been sent to your inbox. Thank you for choosing Chronos.
        </motion.p>
      </motion.div>
    </div>
  );
}