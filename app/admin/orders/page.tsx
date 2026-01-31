'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { Eye, Loader2, AlertCircle, Trash2, CreditCard, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

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
  orderItems: Array<{
    name: string;
    qty: number;
    image: string;
    price: number;
    product: {
      _id: string;
      modelName: string;
      brand: string;
      images?: string[];
    };
  }>;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  paymentStatus?: string; // ✅ Yeh line add karein (image_cd5ed8 fix)
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled'; // ✅ Yeh line add karein (image_cd5c32 fix)
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [updatingPayment, setUpdatingPayment] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }

      const response = await axiosInstance.get('/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data);
      console.log('Orders loaded:', response.data);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to load orders. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(orderId);

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

      if (!token) {
        toast.error('Authentication required. Please log in again.');
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

      // Update local state with proper delivery flags
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order._id === orderId) {
            return {
              ...order,
              orderStatus: newStatus as Order['orderStatus'],
              isDelivered: newStatus.toLowerCase() === 'delivered',
              deliveredAt: newStatus.toLowerCase() === 'delivered' ? new Date().toISOString() : undefined,
            };
          }
          return order;
        })
      );

      toast.success('Order status updated successfully');
      console.log('Order updated:', response.data);
    } catch (err: any) {
      console.error('Error updating order status:', err);
      const errorMessage =
        err.response?.data?.message || 'Failed to update order status. Please try again.';
      toast.error(errorMessage);
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Handle payment status update (toggle)
  const handlePaymentStatusUpdate = async (orderId: string) => {
    try {
      setUpdatingPayment(orderId);

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

      if (!token) {
        toast.error('Authentication required. Please log in again.');
        return;
      }

      const response = await axiosInstance.put(
        `/orders/${orderId}/payment`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state with new payment status from response
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order._id === orderId) {
            return {
              ...order,
              isPaid: response.data.order.isPaid,
              paidAt: response.data.order.paidAt,
            };
          }
          return order;
        })
      );

      toast.success(`Order marked as ${response.data.order.isPaid ? 'Paid' : 'Pending'}`);
      console.log('Payment updated:', response.data);
    } catch (err: any) {
      console.error('Error updating payment status:', err);
      const errorMessage =
        err.response?.data?.message || 'Failed to update payment status. Please try again.';
      toast.error(errorMessage);
    } finally {
      setUpdatingPayment(null);
    }
  };

  // Handle delete click - open modal
  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete - close modal and perform deletion
  const confirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

      if (!token) {
        toast.error('Authentication required. Please log in again.');
        return;
      }

      await axiosInstance.delete(`/orders/${orderToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove order from local state
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderToDelete));

      toast.success('Order deleted successfully');
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
    } catch (err: any) {
      console.error('Error deleting order:', err);
      const errorMessage =
        err.response?.data?.message || 'Failed to delete order. Please try again.';
      toast.error(errorMessage);
    }
  };

  // Cancel delete - close modal
  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setOrderToDelete(null);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
          <p className="mt-4 font-body text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-gray-900">Orders Management</h1>
          <p className="mt-2 font-body text-gray-600">
            View and manage all customer orders
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="font-body text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="rounded-lg bg-white shadow-sm overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-body text-gray-500 text-lg">No orders found.</p>
            </div>
          ) : (
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
                      Date
                    </th>
                    <th className="px-6 py-4 text-left font-heading text-sm font-semibold text-gray-700">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left font-heading text-sm font-semibold text-gray-700">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-left font-heading text-sm font-semibold text-gray-700">
                      Delivery Status
                    </th>
                    <th className="px-6 py-4 text-left font-heading text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const customerName = order.user?.name || order.user?.email || 'Unknown';

                    return (
                      <tr
                        key={order._id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        {/* Order ID */}
                        <td className="px-6 py-4 font-body text-sm font-medium text-gray-900">
                          {shortenId(order._id)}
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-4 font-body text-sm text-gray-700">
                          {customerName}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 font-body text-sm text-gray-700">
                          {formatDate(order.createdAt)}
                        </td>

                        {/* Total */}
                        <td className="px-6 py-4 font-body text-sm font-semibold text-gray-900">
                          PKR {order.totalPrice.toLocaleString()}
                        </td>

                        {/* Payment Status */}
                        <td className="px-6 py-4">
                          {order.paymentStatus === 'failed' ? (
                            <span className="inline-flex rounded-full px-3 py-1 font-body text-xs font-medium bg-red-100 text-red-800">
                              Failed
                            </span>
                          ) : (
                            <button
                              onClick={() => handlePaymentStatusUpdate(order._id)}
                              disabled={updatingPayment === order._id}
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-body text-xs font-medium transition-all ${
                                order.isPaid
                                  ? 'bg-green-100 text-green-800 hover:opacity-80'
                                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              } ${updatingPayment === order._id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                              title={order.isPaid ? 'Click to mark as pending' : 'Click to mark as paid'}
                            >
                              {updatingPayment === order._id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <CreditCard className="h-3.5 w-3.5" />
                              )}
                              {order.isPaid ? 'Paid' : 'Pending'}
                            </button>
                          )}
                        </td>

                        {/* Delivery Status Dropdown */}
                        <td className="px-6 py-4">
                          <select
                            value={order.orderStatus || 'processing'}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            disabled={updatingStatus === order._id}
                            className={`rounded-md border border-gray-300 px-3 py-1.5 font-body text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20 ${
                              updatingStatus === order._id
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-pointer'
                            }`}
                          >
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/orders/${order._id}`}
                              className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              title="View details"
                            >
                              <Eye className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(order._id)}
                              className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="Delete order"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        {orders.length > 0 && (
          <div className="mt-6 rounded-lg bg-white p-4 shadow-sm">
            <p className="font-body text-sm text-gray-600">
              Total Orders: <span className="font-semibold text-gray-900">{orders.length}</span>
            </p>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-start gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="font-heading text-lg font-bold text-gray-900">Delete Order?</h2>
                <p className="mt-2 font-body text-sm text-gray-600">
                  Are you sure you want to delete this order? This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 border-t border-gray-200 bg-gray-50 p-4">
              <button
                onClick={cancelDelete}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 font-body text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-md bg-red-600 px-4 py-2 font-body text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
