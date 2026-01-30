'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';

interface GuestInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

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

  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
  });

  const handleGuestInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuestInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Sync guest info to shipping address
  useEffect(() => {
    setShippingAddress((prev) => ({
      ...prev,
      fullName: guestInfo.name,
      email: guestInfo.email,
      phone: guestInfo.phone,
    }));
  }, [guestInfo.name, guestInfo.email, guestInfo.phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate cart
      if (items.length === 0) {
        setError('Your cart is empty');
        setIsLoading(false);
        return;
      }

      // Validate guest info
      if (!guestInfo.name || !guestInfo.email || !guestInfo.phone || !guestInfo.address || !guestInfo.city) {
        setError('Please fill in all guest information fields');
        setIsLoading(false);
        return;
      }

      // Validate shipping address
      if (!shippingAddress.address || !shippingAddress.state || !shippingAddress.zipCode) {
        setError('Please fill in all shipping address fields');
        setIsLoading(false);
        return;
      }

      // Prepare items
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      console.log('Submitting guest order...');

      // Create Order API Call (PUBLIC - NO AUTH REQUIRED)
      const response = await axiosInstance.post('/orders', {
        items: orderItems,
        guestInfo: {
          name: guestInfo.name,
          email: guestInfo.email,
          phone: guestInfo.phone,
          address: guestInfo.address,
          city: guestInfo.city,
        },
        shippingAddress,
      });

      console.log('Order response:', response.data);

      if (response.status === 200 || response.status === 201) {
        // Clear cart
        clearCart();
        console.log('✅ Order Success! Redirecting to Success Page...');
        // Redirect to success page
        router.push('/checkout/success');
      }
    } catch (err: any) {
      console.error('Checkout error details:', err);
      setError(err.response?.data?.message || 'Failed to create order. Please try again.');
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
          <p className="font-body text-gray-600">Complete your order as a guest</p>
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

              {/* Guest Information */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-6 font-heading text-2xl font-bold text-primary">
                  Your Information
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={guestInfo.name}
                    onChange={handleGuestInfoChange}
                    required
                    className="rounded border border-gray-300 px-4 py-3 font-body text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={guestInfo.email}
                    onChange={handleGuestInfoChange}
                    required
                    className="rounded border border-gray-300 px-4 py-3 font-body text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={guestInfo.phone}
                    onChange={handleGuestInfoChange}
                    required
                    className="md:col-span-2 rounded border border-gray-300 px-4 py-3 font-body text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={guestInfo.address}
                    onChange={handleGuestInfoChange}
                    required
                    className="md:col-span-2 rounded border border-gray-300 px-4 py-3 font-body text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={guestInfo.city}
                    onChange={handleGuestInfoChange}
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
                    value={shippingAddress.address}
                    onChange={handleAddressChange}
                    required
                    className="w-full rounded border border-gray-300 px-4 py-3 font-body text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      required
                      className="rounded border border-gray-300 px-4 py-3 font-body text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State/Province"
                      value={shippingAddress.state}
                      onChange={handleAddressChange}
                      required
                      className="rounded border border-gray-300 px-4 py-3 font-body text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="ZIP/Postal Code"
                      value={shippingAddress.zipCode}
                      onChange={handleAddressChange}
                      required
                      className="rounded border border-gray-300 px-4 py-3 font-body text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    <select
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleAddressChange}
                      className="rounded border border-gray-300 px-4 py-3 font-body text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="Pakistan">Pakistan</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
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
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 font-body">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">PKR {totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900 font-medium text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold">
                      <span>Total</span>
                      <span className="text-black">PKR {totalPrice.toLocaleString()}</span>
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