'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { ArrowLeft, Loader2, AlertCircle, Edit2, Save, X } from 'lucide-react';
import ProductImage from '@/components/ProductImage';
import toast from 'react-hot-toast';

// Constants
const API_URL = 'http://localhost:5000';

// Helper function to construct image URL
const getImageUrl = (imageSource: string | undefined): string => {
  if (!imageSource) return '/placeholder.png';
  if (imageSource.startsWith('http://') || imageSource.startsWith('https://')) {
    return imageSource;
  }
  const normalizedPath = imageSource.startsWith('/') ? imageSource : `/${imageSource}`;
  return `${API_URL}${normalizedPath}`;
};

interface OrderItem {
  product?: {
    _id: string;
    modelName: string;
    brand: string;
    images?: string[];
    price: number;
  } | null;
  name?: string;
  qty?: number;
  quantity?: number; // Backward compatibility
  image?: string;
  price: number;
}

interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    zip?: string;
  };
  orderItems: OrderItem[];
  items?: OrderItem[]; // Backward compatibility
  totalPrice: number;
  totalAmount?: number; // Backward compatibility
  status?: string; // NEW field
  orderStatus?: string; // Backward compatibility
  isPaid: boolean;
  isDelivered: boolean;
  paymentStatus?: string; // Backward compatibility
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch order on mount
  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError('');

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }

      const response = await axiosInstance.get(`/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrder(response.data);
      console.log('Order loaded:', response.data);
    } catch (err: any) {
      console.error('Error fetching order:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to load order. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle address form change
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Address changes no longer needed
  };

  // Start editing address (placeholder - no longer used)
  const startEditingAddress = () => {
    // Address editing no longer supported
  };

  // Cancel editing (placeholder - no longer used)
  const cancelEditingAddress = () => {
    // Address editing no longer supported
  };

  // Save address (placeholder - no longer used)
  const saveAddress = async () => {
    // Address saving no longer needed
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Shorten order ID
  const shortenId = (id: string) => {
    return `#${id.slice(-8).toUpperCase()}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-gray-600" />
          <p className="mt-4 font-body text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/admin/orders"
            className="mb-8 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 font-body text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
          <div className="rounded-lg bg-red-50 p-4 border border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="font-body text-sm text-red-600">{error || 'Order not found'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const customerName =
    order?.user?.name || order?.user?.email || 'Unknown';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        {/* Back Button */}
        <Link
          href="/admin/orders"
          className="mb-8 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 font-body text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>

        {/* Header */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold text-gray-900">
                Order {shortenId(order._id)}
              </h1>
              <p className="mt-2 font-body text-sm text-gray-600">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {(() => {
                const status = order.status || order.orderStatus || 'Processing';
                return (
                  <span
                    className={`inline-flex rounded-full px-4 py-2 font-body text-sm font-medium ${
                      status.toLowerCase() === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : status.toLowerCase() === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : status.toLowerCase() === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Order Items (2/3 width) */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-heading text-xl font-bold text-gray-900">Order Items</h2>
              <div className="space-y-4">
                {(order.orderItems || order.items || []).map((item, index) => {
                  // Handle deleted products
                  const productExists = item.product !== null && item.product !== undefined;
                  const productName = productExists
                    ? item.product?.modelName
                    : item.name || 'Product Deleted';
                  const productBrand = productExists
                    ? item.product?.brand
                    : 'No longer available';
                  // Support both new (item.image) and old (item.product.images) formats
                  const imageSource = item.image || item.product?.images?.[0];
                  const productImage = getImageUrl(imageSource);

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 rounded-lg border border-gray-200 p-4"
                    >
                      {productExists ? (
                        <img
                          src={productImage}
                          alt={productName}
                          className="h-20 w-20 rounded-md border object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.png';
                          }}
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-md border border-gray-300 bg-gray-100 flex items-center justify-center">
                          <span className="font-body text-xs text-gray-400">Deleted</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-body font-semibold text-gray-900">
                          {productName}
                        </h3>
                        <p className="font-body text-sm text-gray-600">{productBrand}</p>
                        <p className="mt-1 font-body text-sm text-gray-600">
                          Quantity: {item.qty || item.quantity || 1}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-body font-semibold text-gray-900">
                          PKR {item.price.toLocaleString()}
                        </p>
                        <p className="font-body text-sm text-gray-600">
                          × {item.qty || item.quantity || 1} = PKR {(item.price * (item.qty || item.quantity || 1)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Customer & Shipping Info (1/3 width) */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-heading text-lg font-bold text-gray-900">
                Customer Information
              </h2>
              <div className="space-y-2">
                <div>
                  <p className="font-body text-sm text-gray-600">Name</p>
                  <p className="font-body font-medium text-gray-900">{order?.user?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-body text-sm text-gray-600">Email</p>
                  <p className="font-body font-medium text-gray-900">{order?.user?.email || 'N/A'}</p>
                </div>
                {order?.user?.phone && (
                  <div>
                    <p className="font-body text-sm text-gray-600">Phone</p>
                    <p className="font-body font-medium text-gray-900">{order?.user?.phone}</p>
                  </div>
                )}
                {order?.user?.address && (
                  <div>
                    <p className="font-body text-sm text-gray-600">Address</p>
                    <p className="font-body font-medium text-gray-900">
                      {order?.user?.address}{order?.user?.city ? `, ${order?.user?.city}` : ''}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address - Same as Customer Info for Guest Orders */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="font-heading text-lg font-bold text-gray-900">
                  Delivery Address
                </h2>
              </div>

              <div className="space-y-1">
                <p className="font-body font-medium text-gray-900">
                  {order?.user?.name || 'N/A'}
                </p>
                <p className="font-body text-sm text-gray-600">{order?.user?.email || 'N/A'}</p>
                {order?.user?.phone && (
                  <p className="font-body text-sm text-gray-600">{order?.user?.phone}</p>
                )}
                {order?.user?.address && (
                  <>
                    <p className="mt-2 font-body text-sm text-gray-900">
                      {order?.user?.address}
                    </p>
                    {order?.user?.city && (
                      <p className="font-body text-sm text-gray-900">{order?.user?.city}</p>
                    )}
                    {order?.user?.zip && (
                      <p className="font-body text-sm text-gray-900">
                        Zip Code: {order?.user?.zip}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-heading text-lg font-bold text-gray-900">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    PKR {order?.totalPrice?.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">PKR 0</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between font-body text-base">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">
                      PKR {order?.totalPrice?.toLocaleString() || '0'}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-2 border-t border-gray-200">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-gray-600">Payment Status</span>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        order.isPaid
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
