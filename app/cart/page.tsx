'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, Lock, Package, Shield } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

// Helper: Convert backend image paths to full URLs
const getImageUrl = (imagePath?: string) => {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80';
  }
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  if (imagePath.startsWith('/')) {
    return `http://localhost:5000${imagePath}`;
  }
  return imagePath;
};

export default function CartPage() {
  const [isClient, setIsClient] = useState(false);
  const cartStore = useCartStore();
  const { cart = [], removeItem, updateQuantity, clearCart } = cartStore;

  // Hydration Fix: Rehydrate persisted state and set client ready
  useEffect(() => {
    useCartStore.persist.rehydrate();
    setIsClient(true);
  }, []);

  // Calculate totals
  const subtotal = (cart || []).reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  // Loading state during hydration
  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#D4AF37] border-t-transparent" />
      </div>
    );
  }

  // Empty Cart State
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto px-6 py-32 sm:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-[#D4AF37]/20 blur-2xl rounded-full" />
                <ShoppingBag size={80} className="text-[#D4AF37] relative" strokeWidth={1} />
              </div>
            </div>

            {/* Heading */}
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-400 text-lg mb-12 max-w-md mx-auto">
              Discover our exquisite collection of luxury timepieces, each a testament to precision and elegance.
            </p>

            {/* CTA Button */}
            <Link
              href="/shop"
              className="inline-block bg-[#D4AF37] hover:bg-[#b5952f] text-black font-bold px-12 py-4 transition-all duration-300"
            >
              Explore Collection
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // Cart with Items - MAIN RETURN
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 sm:px-12 lg:px-24 lg:py-16">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border-b border-white/10 pb-8 mb-12"
        >
          <h1 className="font-serif text-5xl md:text-6xl font-bold">Shopping Cart</h1>
          <p className="text-gray-400 mt-2">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
        </motion.div>

        {/* Main Grid: Cart Items (Left) + Order Summary (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT: Cart Items List (2 columns wide) */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col sm:flex-row gap-6 border-b border-white/10 pb-8"
                >
                  {/* Product Image */}
                  <Link
                    href={`/product/${item.id}`}
                    className="relative w-full sm:w-32 h-48 sm:h-32 bg-gray-900/50 rounded-sm border border-white/5 overflow-hidden group flex-shrink-0"
                  >
                    <Image
                      src={getImageUrl(item.image)}
                      alt={item.modelName || 'Product'}
                      fill
                      className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    {/* Name & Brand */}
                    <div>
                      <p className="text-xs uppercase tracking-widest text-[#D4AF37] mb-1">
                        {item.brand || 'Luxury Timepiece'}
                      </p>
                      <Link
                        href={`/product/${item.id}`}
                        className="font-serif text-xl font-bold hover:text-[#D4AF37] transition"
                      >
                        {item.modelName || 'Timepiece'}
                      </Link>
                    </div>

                    {/* Bottom Row: Price + Quantity + Remove */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                      {/* Price */}
                      <div className="text-2xl font-bold text-[#D4AF37]">
                        ${(item.price * item.quantity).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>

                      {/* Quantity Controls + Remove */}
                      <div className="flex items-center gap-4">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-sm px-3 py-2">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="text-gray-400 hover:text-white transition w-6 h-6 flex items-center justify-center"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-gray-400 hover:text-white transition w-6 h-6 flex items-center justify-center"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Clear Cart Button */}
            <motion.button
              layout
              onClick={clearCart}
              className="text-sm text-gray-400 hover:text-red-500 transition underline underline-offset-4"
            >
              Clear All Items
            </motion.button>
          </div>

          {/* RIGHT: Order Summary (Sticky) - 1 column wide */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-32 bg-black/50 border border-white/10 rounded-sm p-8 space-y-6"
            >
              {/* Title */}
              <h2 className="font-serif text-2xl font-bold uppercase tracking-wider">
                Order Summary
              </h2>

              {/* Subtotal */}
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span className="font-semibold">
                  ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span className="text-green-400 font-semibold">Free</span>
              </div>

              {/* Tax */}
              <div className="flex justify-between text-gray-300 pb-6 border-b border-white/10">
                <span>Estimated Tax</span>
                <span className="font-semibold">
                  ${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-bold">Total</span>
                <span className="text-3xl font-bold text-[#D4AF37]">
                  ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* PROCEED TO CHECKOUT Button - CRITICAL */}
              <Link href="/checkout" className="w-full block">
                <button className="w-full bg-[#D4AF37] text-black py-4 font-bold uppercase tracking-widest hover:bg-[#b5952f] transition-all duration-300">
                  Proceed to Checkout
                </button>
              </Link>

              {/* Trust Badges */}
              <div className="space-y-3 text-xs text-gray-400 text-center pt-6 border-t border-white/10">
                <div className="flex items-center justify-center gap-2">
                  <Lock size={14} className="text-[#D4AF37]" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Package size={14} className="text-[#D4AF37]" />
                  <span>Free Worldwide Shipping</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Shield size={14} className="text-[#D4AF37]" />
                  <span>2-Year International Warranty</span>
                </div>
              </div>
            </motion.div>

            {/* Continue Shopping Link */}
            <Link
              href="/shop"
              className="block text-center text-sm text-gray-400 hover:text-[#D4AF37] transition mt-6 underline underline-offset-4"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
