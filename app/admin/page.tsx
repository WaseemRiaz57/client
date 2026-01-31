'use client';

import { useCallback, useEffect, useState } from 'react';
import { BarChart3, Package, ShoppingCart, Users, TrendingUp, Loader2, X, ArrowUpRight } from 'lucide-react';
import axiosInstance from '@/lib/axios';

// ✅ FIX: 'icon' type 'any' kar di taake strokeWidth ka error na aye
interface StatCard {
  title: string;
  value: string;
  icon: any; 
  iconBg: string; // UI update ke liye
  iconColor: string;
  trend?: string;
}

interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
}

interface OrderItem {
  name?: string;
  image?: string;
  product?: {
    _id: string;
    modelName: string;
    brand: string;
    images?: string[];
  };
  quantity?: number;
  qty?: number;
  price: number;
}

interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  totalPrice: number;
  status?: string;
  orderStatus?: string;
  createdAt: string;
  items?: OrderItem[];
  orderItems?: OrderItem[];
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'shipped':
      return 'bg-blue-100 text-blue-800';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    case 'pending':
      return 'bg-gray-100 text-gray-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatStatus = (status: string) => {
  if (!status) return 'Pending';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// Constants
const API_URL = 'http://localhost:5000';

// Helper function to construct image URL
const getImageUrl = (imageSource: string | undefined): string => {
  if (!imageSource) return '/placeholder.png';

  // If it's already a full URL (http/https), return as-is
  if (imageSource.startsWith('http://') || imageSource.startsWith('https://')) {
    return imageSource;
  }

  // If it's a relative path, prefix with API base URL
  const normalizedPath = imageSource.startsWith('/') ? imageSource : `/${imageSource}`;
  return `${API_URL}${normalizedPath}`;
};

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<'success' | 'error' | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Status update handler
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      setUpdateStatus(null);
      setFeedbackMessage('');

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

      if (!token) {
        setUpdateStatus('error');
        setFeedbackMessage('Authentication required');
        setUpdatingOrderId(null);
        return;
      }

      const response = await axiosInstance.put(
        `/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the selectedOrder state
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          orderStatus: newStatus,
          status: newStatus,
        });
      }

      // Update the recentOrders table
      setRecentOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus, status: newStatus } : order
        )
      );

      // Show success message
      setUpdateStatus('success');
      setFeedbackMessage('Status updated successfully');

      console.log('Order status updated successfully:', response.data);
    } catch (err: any) {
      console.error('Error updating order status:', err);
      const errorMsg = err.response?.data?.message || 'Failed to update order status';
      setUpdateStatus('error');
      setFeedbackMessage(errorMsg);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

      if (!token) {
        setError('Authentication required');
        return;
      }

      // Fetch admin stats
      const statsResponse = await axiosInstance.get('/orders/admin/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(statsResponse.data);

      // Fetch orders (paginated if supported)
      const pageSize = 5;
      const ordersResponse = await axiosInstance.get('/orders/admin/all', {
        params: { page, limit: pageSize },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allOrders = Array.isArray(ordersResponse.data)
        ? ordersResponse.data
        : (ordersResponse.data?.orders || []);

      if (ordersResponse.data?.pagination) {
        setRecentOrders(allOrders);
        setTotalPages(ordersResponse.data.pagination.pages || 1);
      } else {
        const start = (page - 1) * pageSize;
        setRecentOrders(allOrders.slice(start, start + pageSize));
        setTotalPages(Math.max(1, Math.ceil(allOrders.length / pageSize)));
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchDashboardData();
  }, [page, fetchDashboardData]);

  // Clear feedback message after 3 seconds
  useEffect(() => {
    if (updateStatus) {
      const timer = setTimeout(() => {
        setUpdateStatus(null);
        setFeedbackMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateStatus]);

  // ✅ New Premium UI Stat Cards Configuration
  const statCards: StatCard[] = [
    {
      title: 'Total Revenue',
      value: stats ? `PKR ${stats.totalRevenue.toLocaleString()}` : 'Loading...',
      icon: TrendingUp,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      trend: '+12.5%'
    },
    {
      title: 'Total Orders',
      value: stats ? stats.totalOrders.toString() : 'Loading...',
      icon: ShoppingCart,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      trend: '+5.2%'
    },
    {
      title: 'Total Products',
      value: stats ? stats.totalProducts.toString() : 'Loading...',
      icon: Package,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      trend: 'In Stock'
    },
    {
      title: 'Total Customers',
      value: stats ? stats.totalCustomers.toString() : 'Loading...',
      icon: Users,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      trend: '+2.4%'
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-gray-600" />
          <p className="mt-4 font-body text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="rounded-lg bg-red-50 p-6 border border-red-200">
          <p className="font-body text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 font-body text-gray-600">Welcome back! Here's your business overview.</p>
      </div>

      {/* ✅ Stats Cards Grid (NEW PREMIUM UI) */}
      <div className="mb-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {card.title}
                  </p>
                  <h3 className="mt-2 font-heading text-3xl font-bold text-gray-900">
                    {card.value}
                  </h3>
                </div>
                <div className={`rounded-xl p-3 ${card.iconBg} ${card.iconColor} bg-opacity-50`}>
                  {/* Fixed strokeWidth error here */}
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </div>
              </div>
              
              <div className="mt-4 flex items-center text-xs font-medium text-green-600">
                <span className="flex items-center bg-green-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  {card.trend}
                </span>
                <span className="ml-2 text-gray-400">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-gray-700" />
            <h2 className="font-heading text-2xl font-bold text-gray-900">Recent Orders</h2>
          </div>
          <p className="mt-1 font-body text-sm text-gray-600">Latest order activity from your store</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left font-heading text-sm font-semibold text-gray-700">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left font-heading text-sm font-semibold text-gray-700">
                  Customer
                </th>
                <th className="px-6 py-4 text-left font-heading text-sm font-semibold text-gray-700">
                  Amount
                </th>
                <th className="px-6 py-4 text-left font-heading text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left font-heading text-sm font-semibold text-gray-700">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center font-body text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr 
                    key={order._id} 
                    onClick={() => setSelectedOrder(order)}
                    className="cursor-pointer border-b border-gray-200 hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-body text-sm font-medium text-gray-900">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-gray-700">
                      {order.user?.name || `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() || order.user?.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-body text-sm font-semibold text-gray-900">
                      PKR {(order.totalPrice || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 font-body text-xs font-medium ${getStatusColor(order.status || order.orderStatus || 'pending')}`}
                      >
                        {formatStatus(order.status || order.orderStatus || 'pending')}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-200 p-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="rounded-md border border-gray-300 px-4 py-2 font-body text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <span className="font-body text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page >= totalPages}
                className="rounded-md border border-gray-300 px-4 py-2 font-body text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <button className="inline-flex items-center rounded-md bg-black px-6 py-2 font-body text-sm font-medium text-white hover:bg-gray-800 transition-colors">
              View All Orders
            </button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-96 overflow-y-auto p-6">
              {/* Customer Information */}
              <div className="mb-6">
                <h3 className="mb-4 font-heading text-lg font-semibold text-gray-900">Customer Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="font-body text-sm text-gray-600">Name</p>
                    <p className="font-body text-base font-medium text-gray-900">
                      {selectedOrder.user?.name || `${selectedOrder.user?.firstName || ''} ${selectedOrder.user?.lastName || ''}`.trim() || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-sm text-gray-600">Email</p>
                    <p className="font-body text-base font-medium text-gray-900">{selectedOrder.user?.email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Order Status and Amount */}
              <div className="mb-6 rounded-lg bg-gray-50 p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="font-body text-sm text-gray-600">Order Status</p>
                    <div className="mt-2">
                      <select
                        value={selectedOrder.status || selectedOrder.orderStatus || 'processing'}
                        onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                        disabled={updatingOrderId === selectedOrder._id}
                        className={`w-full rounded-md border px-3 py-2 font-body text-sm font-semibold transition-colors ${
                          (selectedOrder.status || selectedOrder.orderStatus || '').toLowerCase() === 'delivered'
                            ? 'border-green-300 bg-green-50 text-green-800 hover:bg-green-100'
                            : (selectedOrder.status || selectedOrder.orderStatus || '').toLowerCase() === 'shipped'
                            ? 'border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100'
                            : (selectedOrder.status || selectedOrder.orderStatus || '').toLowerCase() === 'processing'
                            ? 'border-yellow-300 bg-yellow-50 text-yellow-800 hover:bg-yellow-100'
                            : (selectedOrder.status || selectedOrder.orderStatus || '').toLowerCase() === 'cancelled'
                            ? 'border-red-300 bg-red-50 text-red-800 hover:bg-red-100'
                            : 'border-gray-300 bg-gray-100 text-gray-800 hover:bg-gray-200'
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {updatingOrderId === selectedOrder._id && (
                        <p className="mt-2 flex items-center gap-2 font-body text-xs text-gray-600">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Updating...
                        </p>
                      )}
                      {updateStatus === 'success' && (
                        <p className="mt-2 font-body text-xs text-green-600 font-medium">
                          {feedbackMessage}
                        </p>
                      )}
                      {updateStatus === 'error' && (
                        <p className="mt-2 font-body text-xs text-red-600 font-medium">
                          {feedbackMessage}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-body text-sm text-gray-600">Total Amount</p>
                    <p className="mt-1 font-heading text-lg font-bold text-gray-900">
                      PKR {(selectedOrder.totalPrice || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="rounded-lg bg-white p-4">
                <h3 className="mb-4 font-heading text-lg font-semibold text-gray-900">Products</h3>
                
                {/* ✅ FIX: Added Safe Array '|| []' and 'item: any' to prevent errors */}
                {(selectedOrder.orderItems || selectedOrder.items || []).length > 0 ? (
                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    {(selectedOrder.orderItems || selectedOrder.items || []).map((item: any, index: number) => {
                      const imageSource = item.image || item.product?.images?.[0];
                      const finalImageUrl = getImageUrl(imageSource);

                      return (
                      <div key={item.product?._id || index} className="flex gap-4 rounded-md border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition-colors">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={finalImageUrl}
                            alt={item.product?.modelName || item.name}
                            className="h-20 w-20 rounded-md border object-cover"
                            onError={(e) => {
                              if (e.currentTarget.src.endsWith('/placeholder.png')) {
                                return;
                              }
                              e.currentTarget.src = '/placeholder.png';
                              e.currentTarget.onerror = null;
                            }}
                          />
                        </div>
                        {/* Product Details */}
                        <div className="flex-1">
                          <h4 className="font-heading text-base font-semibold text-gray-900">
                            {item.product?.brand} {item.product?.modelName || item.name}
                          </h4>
                          <p className="mt-1 font-body text-sm text-gray-600">
                            Quantity: <span className="font-semibold text-gray-900">{item.qty || item.quantity}</span>
                          </p>
                          <p className="mt-1 font-body text-sm text-gray-600">
                            Price per item: <span className="font-semibold text-gray-900">PKR {item.price.toLocaleString()}</span>
                          </p>
                          <p className="mt-2 font-heading text-base font-bold text-gray-900">
                            Subtotal: PKR {(item.price * (item.qty || item.quantity)).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="font-body text-gray-500">No products in this order</p>
                )}
              </div>

              {/* Order Total Summary */}
              <div className="mt-6 rounded-lg border-t-2 border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-lg font-semibold text-gray-700">Total Amount:</span>
                  <span className="font-heading text-2xl font-bold text-gray-900">
                    PKR {(selectedOrder.totalPrice || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full rounded-md bg-black px-4 py-3 font-body text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}