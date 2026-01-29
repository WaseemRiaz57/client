'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface OrderDetail {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  items: Array<{
    product: {
      _id: string;
      modelName: string;
      brand: string;
      price: number;
      images: string[];
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}

export default function OrderDetailPage({ params, searchParams }: OrderDetailPageProps) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [paramId, setParamId] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const { id } = await params;
      const { success } = await searchParams;
      setParamId(id);
      setIsSuccess(success === 'true');
      await fetchOrder(id);
    };
    initialize();
  }, []);

  const fetchOrder = async (orderId: string) => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${apiUrl}/orders/${orderId}`);
      setOrder(response.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/login');
      } else {
        setError('Failed to load order details');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
          <p className="font-body text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-lg bg-red-50 p-6 text-center">
            <p className="mb-4 font-body text-red-600">{error || 'Order not found'}</p>
            <Link href="/orders" className="font-body text-red-600 underline hover:text-red-700">
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {isSuccess && (
          <div className="mb-8 rounded-lg bg-green-50 p-6 text-center">
            <p className="mb-2 font-heading text-2xl font-bold text-green-800">Order Confirmed!</p>
            <p className="font-body text-green-700">
              Thank you for your purchase. We'll send you shipping updates soon.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <Link href="/orders" className="mb-4 inline-block font-body text-primary hover:underline">
            ← Back to Orders
          </Link>
          <h1 className="font-heading text-4xl font-bold text-primary">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Cards */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <p className="mb-2 font-body text-sm uppercase tracking-wider text-gray-600">
                  Order Status
                </p>
                <p className={`inline-block rounded-full px-4 py-2 font-body font-semibold uppercase ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <p className="mb-2 font-body text-sm uppercase tracking-wider text-gray-600">
                  Payment Status
                </p>
                <p className={`font-body font-semibold ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.paymentStatus === 'paid' ? '✓ Paid' : 'Pending'}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-6 font-heading text-2xl font-bold text-primary">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0">
                    {item.product.images?.[0] && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.modelName}
                        className="h-24 w-24 rounded object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="mb-1 font-body text-xs uppercase tracking-widest text-gray-500">
                        {item.product.brand}
                      </p>
                      <h3 className="mb-3 font-heading text-lg font-semibold text-primary">
                        {item.product.modelName}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="font-body text-sm text-gray-600">
                          Quantity: <span className="font-semibold">{item.quantity}</span>
                        </p>
                        <p className="font-heading text-lg font-bold text-primary">
                          ${(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-6 font-heading text-2xl font-bold text-primary">Shipping Address</h2>
              <div className="space-y-2 font-body text-gray-700">
                <p className="font-semibold">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p className="pt-2 text-sm">Email: {order.shippingAddress.email}</p>
                <p className="text-sm">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-6 font-heading text-2xl font-bold text-primary">Order Summary</h2>

              <div className="space-y-3 border-b border-gray-200 pb-6 font-body">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${order.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">$0</span>
                </div>
              </div>

              <div className="mt-6 flex justify-between font-heading text-2xl font-bold">
                <span>Total</span>
                <span className="text-gold">${order.totalAmount.toLocaleString()}</span>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 font-body text-sm">
                <p className="mb-2 font-semibold text-gray-900">Order Date</p>
                <p className="text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
