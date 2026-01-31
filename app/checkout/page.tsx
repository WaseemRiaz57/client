'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCartStore();
  
  // Safe variable to avoid undefined errors
  const cartItems = cart || [];

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect to shop if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/shop');
    }
  }, [cartItems, router]);

  // Helper function to resolve image URLs
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1200&auto=format&fit=crop';
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    if (imagePath.startsWith('/')) {
      return `http://localhost:5000${imagePath}`;
    }
    return imagePath;
  };

  // Handle form submission
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!fullName || !email || !phone || !address || !city || !zipCode) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsProcessing(true);

      // Simulate order processing (replace with actual API call if needed)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Success
      toast.success('Order Placed Successfully!');
      clearCart();
      
      // Redirect to home after a brief delay
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  // Return early if cart is empty (will redirect)
  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <div className="border-b border-gold/20 bg-black/50 px-6 py-12 text-center">
        <div className="mx-auto max-w-7xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-5xl font-bold"
          >
            Checkout
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-body text-gray-400"
          >
            Complete your luxury purchase
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-12 lg:px-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Left: Shipping Form */}
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handlePlaceOrder}
              className="space-y-8"
            >
              <div>
                <h2 className="font-heading text-2xl font-bold mb-8">Shipping Details</h2>

                {/* Full Name */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold uppercase tracking-wider text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-transparent border-b border-gold/50 py-3 text-white placeholder-gray-500 focus:border-gold focus:outline-none transition"
                  />
                </div>

                {/* Email */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold uppercase tracking-wider text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full bg-transparent border-b border-gold/50 py-3 text-white placeholder-gray-500 focus:border-gold focus:outline-none transition"
                  />
                </div>

                {/* Phone */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold uppercase tracking-wider text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full bg-transparent border-b border-gold/50 py-3 text-white placeholder-gray-500 focus:border-gold focus:outline-none transition"
                  />
                </div>

                {/* Address */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold uppercase tracking-wider text-gray-300 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Luxury Avenue"
                    className="w-full bg-transparent border-b border-gold/50 py-3 text-white placeholder-gray-500 focus:border-gold focus:outline-none transition"
                  />
                </div>

                {/* City */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold uppercase tracking-wider text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New York"
                    className="w-full bg-transparent border-b border-gold/50 py-3 text-white placeholder-gray-500 focus:border-gold focus:outline-none transition"
                  />
                </div>

                {/* Zip Code */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold uppercase tracking-wider text-gray-300 mb-2">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="10001"
                    className="w-full bg-transparent border-b border-gold/50 py-3 text-white placeholder-gray-500 focus:border-gold focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Place Order Button */}
              <motion.button
                type="submit"
                disabled={isProcessing}
                whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                className={`w-full py-4 px-6 rounded-sm font-heading text-lg font-semibold transition flex items-center justify-center gap-2 ${
                  isProcessing
                    ? 'bg-gold/50 text-black/50 cursor-not-allowed'
                    : 'bg-gold text-black hover:bg-gold/90'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
                {!isProcessing && <ChevronRight size={20} />}
              </motion.button>
            </motion.form>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-32 bg-gradient-to-b from-gray-900/50 to-black/50 border border-gold/20 rounded-sm p-8 space-y-8"
            >
              <h2 className="font-heading text-2xl font-bold">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 border-b border-gold/10 pb-4"
                  >
                    {/* Item Thumbnail */}
                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-800 rounded-sm overflow-hidden border border-gold/10">
                      <Image
                        src={getImageUrl(item.image)}
                        alt={item.modelName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gold mb-1">
                          {item.brand}
                        </p>
                        <p className="font-body text-sm text-white line-clamp-2">
                          {item.modelName}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400">
                        Qty: <span className="text-gold font-semibold">{item.quantity}</span>
                      </p>
                    </div>

                    {/* Item Price */}
                    <div className="text-right">
                      <p className="font-semibold text-gold">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-gold/20" />

              {/* Order Totals */}
              <div className="space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <p className="text-gray-400">Subtotal</p>
                  <p className="font-semibold text-white">
                    ${totalPrice.toLocaleString()}
                  </p>
                </div>

                {/* Shipping */}
                <div className="flex items-center justify-between">
                  <p className="text-gray-400">Shipping</p>
                  <p className="font-semibold text-gold">Free</p>
                </div>

                {/* Tax (10%) */}
                <div className="flex items-center justify-between">
                  <p className="text-gray-400">Tax (10%)</p>
                  <p className="font-semibold text-white">
                    ${(totalPrice * 0.1).toLocaleString()}
                  </p>
                </div>

                {/* Total */}
                <div className="border-t border-gold/20 pt-4 flex items-center justify-between">
                  <p className="font-heading text-lg font-bold">Total</p>
                  <p className="font-heading text-2xl font-bold text-gold">
                    ${(totalPrice * 1.1).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Security Info */}
              <div className="pt-4 border-t border-gold/20">
                <p className="text-xs text-gray-500 text-center">
                  🔒 Your payment information is secure and encrypted
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
