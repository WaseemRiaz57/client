'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-2xl text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 100 }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            {/* Gold ring background */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-gold/20 w-32 h-32"
            />
            {/* Icon container */}
            <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/40">
              <CheckCircle className="w-20 h-20 text-gold" strokeWidth={1.5} />
            </div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-heading text-5xl md:text-6xl font-bold mb-4 leading-tight"
        >
          Thank You for Your Order
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="font-body text-lg md:text-xl text-gray-400 mb-12 max-w-xl mx-auto leading-relaxed"
        >
          Your legacy begins now. We will contact you shortly to confirm delivery.
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-12"
        />

        {/* Order ID (if available) */}
        {orderId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="mb-8 p-4 rounded-lg bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gold/10"
          >
            <p className="font-body text-sm text-gray-400 mb-1">Order Number</p>
            <p className="font-heading text-xl font-semibold text-gold break-all">
              #{orderId.slice(-8).toUpperCase()}
            </p>
          </motion.div>
        )}

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gold text-black font-heading font-semibold text-lg rounded-sm hover:bg-gold/90 transition duration-300 group"
          >
            Continue Shopping
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </motion.span>
          </Link>
        </motion.div>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-16 text-sm text-gray-600"
        >
          Order confirmation email has been sent to your inbox
        </motion.p>
      </motion.div>
    </div>
  );
}
