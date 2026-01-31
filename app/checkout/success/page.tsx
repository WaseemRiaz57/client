'use client';

import Link from 'next/link';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-xl border border-gray-100">
        
        {/* Animated Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle className="h-16 w-16 text-green-600 animate-bounce" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="mb-2 font-heading text-3xl font-bold text-gray-900">
          Thank You!
        </h1>
        <p className="mb-8 font-body text-gray-600">
          Your order has been placed successfully. We are preparing your luxury timepiece for shipment.
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <Link 
            href="/orders" 
            className="flex w-full items-center justify-center rounded-lg bg-black py-4 font-bold text-white transition hover:bg-gray-800"
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            View My Orders
          </Link>

          <Link 
            href="/shop" 
            className="flex w-full items-center justify-center rounded-lg border border-gray-300 py-4 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Continue Shopping
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}