'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { ArrowLeft, Loader2, AlertCircle, Edit2, Save, X } from 'lucide-react';
import ProductImage from '@/components/ProductImage';
import toast from 'react-hot-toast';

interface OrderItem {
  product: {
    _id: string;
    modelName: string;
    brand: string;
    images?: string[];
    price: number;
  };
  quantity: number;
  price: number;
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

interface Order {
  _id: string;
  user: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  isDelivered: boolean;
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
  const [editingAddress, setEditingAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

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
      setAddressForm(response.data.shippingAddress);
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
    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Start editing address
  const startEditingAddress = () => {
    if (order) {
      setAddressForm(order.shippingAddress);
      setEditingAddress(true);
    }
  };

  // Cancel editing
  const cancelEditingAddress = () => {
    if (order) {
      setAddressForm(order.shippingAddress);
    }
    setEditingAddress(false);
  };

  // Save address
  const saveAddress = async () => {
    try {
      setSavingAddress(true);

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

      if (!token) {
        toast.error('Authentication required. Please log in again.');
        return;
      }

      const response = await axiosInstance.put(
        `/orders/${orderId}/status`,
        { shippingAddress: addressForm },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrder(response.data.order);
      setEditingAddress(false);
      toast.success('Shipping address updated successfully');
      console.log('Address updated:', response.data);
    } catch (err: any) {
      console.error('Error updating address:', err);
      const errorMessage =
        err.response?.data?.message || 'Failed to update address. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSavingAddress(false);
    }
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
    order.user.firstName && order.user.lastName
      ? `${order.user.firstName} ${order.user.lastName}`
      : order.user.email || 'Unknown';

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
              <span
                className={`inline-flex rounded-full px-4 py-2 font-body text-sm font-medium ${
                  order.orderStatus === 'delivered'
                    ? 'bg-green-100 text-green-800'
                    : order.orderStatus === 'shipped'
                    ? 'bg-blue-100 text-blue-800'
                    : order.orderStatus === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
              </span>
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
                {order.items.map((item, index) => {
                  // Handle deleted products
                  const productExists = item.product !== null && item.product !== undefined;
                  const productName = productExists
                    ? item.product.modelName
                    : 'Product Deleted';
                  const productBrand = productExists
                    ? item.product.brand
                    : 'No longer available';
                  const productImage = productExists ? item.product.images?.[0] : null;

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 rounded-lg border border-gray-200 p-4"
                    >
                      {productExists ? (
                        <ProductImage
                          src={productImage}
                          alt={productName}
                          className="h-20 w-20 rounded-md border object-cover"
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
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-body font-semibold text-gray-900">
                          PKR {item.price.toLocaleString()}
                        </p>
                        <p className="font-body text-sm text-gray-600">
                          × {item.quantity} = PKR {(item.price * item.quantity).toLocaleString()}
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
                  <p className="font-body font-medium text-gray-900">{customerName}</p>
                </div>
                <div>
                  <p className="font-body text-sm text-gray-600">Email</p>
                  <p className="font-body font-medium text-gray-900">{order.user.email}</p>
                </div>
                {order.user.phone && (
                  <div>
                    <p className="font-body text-sm text-gray-600">Phone</p>
                    <p className="font-body font-medium text-gray-900">{order.user.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold text-gray-900">
                  Shipping Address
                </h2>
                {!editingAddress && (
                  <button
                    onClick={startEditingAddress}
                    className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-body text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </button>
                )}
              </div>

              {editingAddress ? (
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block font-body text-xs font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={addressForm.fullName}
                      onChange={handleAddressChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 font-body text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-body text-xs font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={addressForm.email}
                      onChange={handleAddressChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 font-body text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-body text-xs font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={addressForm.phone}
                      onChange={handleAddressChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 font-body text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-body text-xs font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={addressForm.address}
                      onChange={handleAddressChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 font-body text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block font-body text-xs font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 font-body text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block font-body text-xs font-medium text-gray-700">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={addressForm.state}
                        onChange={handleAddressChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 font-body text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block font-body text-xs font-medium text-gray-700">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={addressForm.zipCode}
                        onChange={handleAddressChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 font-body text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block font-body text-xs font-medium text-gray-700">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={addressForm.country}
                        onChange={handleAddressChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 font-body text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={saveAddress}
                      disabled={savingAddress}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-black px-4 py-2 font-body text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {savingAddress ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save
                        </>
                      )}
                    </button>
                    <button
                      onClick={cancelEditingAddress}
                      disabled={savingAddress}
                      className="rounded-md border border-gray-300 px-4 py-2 font-body text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="font-body font-medium text-gray-900">
                    {order.shippingAddress.fullName}
                  </p>
                  <p className="font-body text-sm text-gray-600">{order.shippingAddress.email}</p>
                  <p className="font-body text-sm text-gray-600">{order.shippingAddress.phone}</p>
                  <p className="mt-2 font-body text-sm text-gray-900">
                    {order.shippingAddress.address}
                  </p>
                  <p className="font-body text-sm text-gray-900">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p className="font-body text-sm text-gray-900">
                    {order.shippingAddress.country}
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-heading text-lg font-bold text-gray-900">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    PKR {order.totalAmount.toLocaleString()}
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
                      PKR {order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-2 border-t border-gray-200">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-gray-600">Payment Status</span>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        order.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : order.paymentStatus === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.paymentStatus === 'paid'
                        ? 'Paid'
                        : order.paymentStatus === 'failed'
                        ? 'Failed'
                        : 'Pending'}
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
