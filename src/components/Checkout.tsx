'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const Checkout = () => {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Hydration fix ke liye (agar zaroorat ho)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Validate cart
      if (items.length === 0) {
        setError('Your cart is empty');
        setIsLoading(false);
        return;
      }

      // 2. Prepare items
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      // 3. Get Token
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
      
      if (!token) {
        setError('Authentication required. Please log in to place an order.');
        setIsLoading(false);
        router.push('/login');
        return;
      }

      console.log('Submitting order...');

      // 4. Create Order API Call
      const response = await axiosInstance.post(
        '/orders',
        {
          items: orderItems,
          shippingAddress: address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Order response:', response.data);

      // 5. SUCCESS LOGIC (Updated ✅)
      if (response.status === 200 || response.status === 201) {
        // Cart saaf karein
        clearCart();
        
        console.log('✅ Order Success! Redirecting to Success Page...');
        
        // ❌ OLD: alert('Order Placed Successfully!');
        // ❌ OLD: router.push(`/orders/${orderId}?success=true`);
        
        // ✅ NEW: Seedha Success Page par bhejein
        router.push('/checkout/success');
      }

    } catch (err: any) {
      console.error('Checkout error details:', err);
      
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setError(err.response?.data?.message || 'Failed to create order. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 font-heading text-4xl font-bold text-primary">Checkout</h1>
          <p className="font-body text-gray-600">Complete your order</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="rounded-lg bg-red-50 p-4 font-body text-red-600 border border-red-200">
                  {error}
                </div>
              )}

              {/* Personal Information */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-6 font-heading text-2xl font-bold text-primary">
                  Personal Information
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={address.fullName}
                    onChange={handleInputChange}
                    required
                    className="rounded border border-gray-300 px-4 py-3 font-body text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={address.email}
                    onChange={handleInputChange}
                    required
                    className="rounded border border-gray-300 px-4 py-3 font-body text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={address.phone}
                    onChange={handleInputChange}
                    required
                    className="md:col-span-2 rounded border border-gray-300 px-4 py-3 font-body text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-6 font-heading text-2xl font-bold text-primary">
                  Shipping Address
                </h2>

                <div className="space-y-4">
                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={address.address}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded border border-gray-300 px-4 py-3 font-body text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={address.city}
                      onChange={handleInputChange}
                      required
                      className="rounded border border-gray-300 px-4 py-3 font-body text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State/Province"
                      value={address.state}
                      onChange={handleInputChange}
                      required
                      className="rounded border border-gray-300 px-4 py-3 font-body text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="ZIP/Postal Code"
                      value={address.zipCode}
                      onChange={handleInputChange}
                      required
                      className="rounded border border-gray-300 px-4 py-3 font-body text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    <select
                      name="country"
                      value={address.country}
                      onChange={handleInputChange}
                      className="rounded border border-gray-300 px-4 py-3 font-body text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Pakistan">Pakistan</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black py-4 font-body text-lg font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
              >
                {isLoading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-lg bg-white p-6 shadow-sm border border-gray-100">
              <h2 className="mb-6 font-heading text-2xl font-bold text-primary">Order Summary</h2>

              {items.length === 0 ? (
                <p className="font-body text-gray-600">Your cart is empty</p>
              ) : (
                <>
                  <div className="mb-6 space-y-4 border-b border-gray-200 pb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between font-body text-sm">
                        <div>
                          <p className="font-semibold text-gray-900">{item.modelName}</p>
                          <p className="text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 font-body">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">${totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900 font-medium text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold">
                      <span>Total</span>
                      <span className="text-black">${totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;