'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { Trash2, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Order {
  _id: string;
  user?: {
    name: string;
    email: string;
  };
  createdAt: string;
  totalPrice: number;
  isPaid: boolean;       // ✅ Ye zaroori hai crash rokne ke liye
  paidAt?: string;
  status: string;        // Delivery Status (Processing, Shipped, etc.)
  orderItems: any[];
}

export default function AdminOrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch All Orders (Admin)
  const fetchOrders = async () => {
    try {
      // Admin route usually '/orders' (not /myorders)
      const { data } = await axiosInstance.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. Handle Payment Toggle (Fixes the crash)
  const togglePaymentStatus = async (id: string, currentStatus: boolean) => {
    try {
      // Optimistic UI Update (Foran change dikhao)
      const updatedOrders = orders.map(order => 
        order._id === id ? { ...order, isPaid: !currentStatus } : order
      );
      setOrders(updatedOrders);

      // API Call
      await axiosInstance.put(`/orders/${id}/pay`, {
        isPaid: !currentStatus
      });
      
      toast.success(currentStatus ? 'Marked as Unpaid' : 'Marked as Paid');
      fetchOrders(); // Refresh data to be sure
    } catch (error) {
      console.error('Payment update failed:', error);
      toast.error('Failed to update payment');
      fetchOrders(); // Revert on error
    }
  };

  // 3. Handle Delivery Status Change
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // UI Update
      const updatedOrders = orders.map(order => 
        order._id === id ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);

      // API Call
      await axiosInstance.put(`/orders/${id}/deliver`, {
        status: newStatus
      });

      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Status update failed:', error);
      toast.error('Failed to update status');
    }
  };

  // 4. Delete Order
  const deleteOrder = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await axiosInstance.delete(`/orders/${id}`);
      setOrders(orders.filter(order => order._id !== id));
      toast.success('Order deleted successfully');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete order');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Order ID</th>
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Total</th>
              <th className="px-6 py-4 font-semibold">Payment</th>
              <th className="px-6 py-4 font-semibold">Delivery Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                
                {/* ID */}
                <td className="px-6 py-4 font-mono font-medium text-gray-900">
                  #{order._id.slice(-6).toUpperCase()}
                </td>

                {/* Customer */}
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {order.user?.name || 'Guest User'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {order.user?.email}
                  </div>
                </td>

                {/* Date */}
                <td className="px-6 py-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                {/* Total */}
                <td className="px-6 py-4 font-medium text-black">
                  ${order.totalPrice?.toLocaleString()}
                </td>

                {/* Payment Status (Button) */}
                <td className="px-6 py-4">
                  <button
                    onClick={() => togglePaymentStatus(order._id, order.isPaid)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                      order.isPaid
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    }`}
                  >
                    {order.isPaid ? (
                      <>
                        <CheckCircle size={12} /> Paid
                      </>
                    ) : (
                      <>
                        <Clock size={12} /> Pending
                      </>
                    )}
                  </button>
                </td>

                {/* Delivery Status (Dropdown) */}
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="rounded border border-gray-300 bg-white px-3 py-1 text-xs font-medium focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    {/* View Details Link (Optional - agar admin detail page banaya hai to) */}
                    <Link href={`/admin/orders/${order._id}`} className="text-gray-400 hover:text-blue-600">
                      <Eye size={18} />
                    </Link>
                    
                    <button 
                      onClick={() => deleteOrder(order._id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}