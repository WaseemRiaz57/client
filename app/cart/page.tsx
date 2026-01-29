'use client';

import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { items, totalPrice, removeItem, updateQuantity, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg
            className="mx-auto mb-6 h-24 w-24 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 className="mb-4 font-heading text-3xl font-bold text-primary">
            Your Cart is Empty
          </h2>
          <p className="mb-8 font-body text-gray-600">
            Start exploring our luxury timepieces
          </p>
          <Link
            href="/products"
            className="inline-block bg-primary px-8 py-3 font-body text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-gray-800"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 font-heading text-4xl font-bold text-primary">
            Shopping Cart
          </h1>
          <p className="font-body text-gray-600">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 rounded-lg bg-white p-6 shadow-sm"
                >
                  {/* Image */}
                  <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.modelName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between">
                        <div>
                          <p className="font-body text-xs uppercase tracking-wider text-gray-500">
                            {item.brand}
                          </p>
                          <h3 className="mt-1 font-heading text-xl font-semibold text-primary">
                            {item.modelName}
                          </h3>
                        </div>
                        <p className="font-heading text-xl font-bold text-primary">
                          ${(item.discountPrice || item.price).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="font-body text-sm text-gray-600">
                          Quantity:
                        </span>
                        <div className="flex items-center border border-gray-300">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, Math.max(1, item.quantity - 1))
                            }
                            className="px-3 py-1 font-body text-lg hover:bg-gray-100"
                          >
                            −
                          </button>
                          <span className="w-12 text-center font-body font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.min(item.stock, item.quantity + 1)
                              )
                            }
                            className="px-3 py-1 font-body text-lg hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="font-body text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="mt-4 font-body text-sm text-gray-600 hover:text-red-600"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-6 font-heading text-2xl font-bold text-primary">
                Order Summary
              </h2>

              <div className="space-y-4 border-b border-gray-200 pb-4">
                <div className="flex justify-between font-body text-gray-700">
                  <span>Subtotal</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-body text-gray-700">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-body text-gray-700">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between font-heading text-2xl font-bold text-primary">
                <span>Total</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>

              <Link
                href="/checkout"
                className="mt-6 block w-full bg-primary py-4 text-center font-body text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-gray-800"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/products"
                className="mt-3 block w-full border border-gray-300 py-4 text-center font-body text-sm font-bold uppercase tracking-wider text-gray-700 transition-all hover:bg-gray-50"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 space-y-3 border-t border-gray-200 pt-6">
                <div className="flex items-center gap-3">
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-body text-sm text-gray-600">
                    Secure Checkout
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-body text-sm text-gray-600">
                    Free Insured Shipping
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-body text-sm text-gray-600">
                    30-Day Returns
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
