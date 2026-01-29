'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { ShoppingBag, Clock, AlertCircle, Package } from 'lucide-react';
import Link from 'next/link';

// ✅ 1. Types Update: Product ki details handle karne ke liye
interface ProductDetails {
  _id: string;
  modelName: string;
  brand: string;
  images: string[];
  price: number;
}

interface OrderItem {
  _id: string;
  product: ProductDetails; // Ab ye sirf ID nahi, poora object hai
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  createdAt: string;
  totalPrice?: number;
  totalAmount?: number;
  status?: string;
  orderStatus?: string;
  items: OrderItem[];
}

const OrdersList = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
          router.push('/login');
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axiosInstance.get('/orders/myorders', config);
        
        console.log("✅ Orders Data:", response.data);
        setOrders(response.data);
      
      } catch (err: any) {
        console.error("🔴 Error fetching orders:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem('auth-token'); 
          router.push('/login'); 
        } else {
          setError('Failed to load your orders.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  // Loading State
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-black border-t-transparent"></div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-4">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h3 className="text-lg font-bold text-gray-900">Oops!</h3>
        <p className="text-gray-600">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 rounded bg-black px-6 py-2 text-white hover:bg-gray-800">Try Again</button>
      </div>
    );
  }

  // Empty State
  if (orders.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
        <div className="rounded-full bg-gray-100 p-6 mb-4">
          <ShoppingBag className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-900">No orders yet</h3>
        <p className="mb-6 max-w-sm text-gray-500">Looks like you haven't placed any orders yet.</p>
        <Link href="/products" className="rounded-lg bg-black px-8 py-3 font-bold text-white transition hover:bg-gray-800">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 font-heading text-3xl font-bold text-gray-900">My Orders</h1>
        
        <div className="space-y-8">
          {orders.map((order) => {
            const displayPrice = order.totalPrice || order.totalAmount || 0;
            const displayStatus = order.status || order.orderStatus || 'Processing';
            const isDelivered = displayStatus.toLowerCase() === 'delivered';
            const isCancelled = displayStatus.toLowerCase() === 'cancelled';

            return (
              <div key={order._id} className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200">
                
                {/* 🟢 HEADER: Order Summary (ID, Date, Total) */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 sm:flex sm:gap-12">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</p>
                        <p className="font-mono font-bold text-gray-900">#{order._id.slice(-6).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date</p>
                        <div className="flex items-center gap-1 font-medium text-gray-900">
                          <Clock className="h-3 w-3 text-gray-400" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total</p>
                        <p className="font-bold text-black">${displayPrice.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide 
                        ${isDelivered ? 'bg-green-100 text-green-700' : 
                          isCancelled ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          isDelivered ? 'bg-green-500' : 
                          isCancelled ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></span>
                        {displayStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 🔵 DETAILS: Product List with Images */}
                <div className="bg-gray-50 px-6 py-4">
                  <div className="space-y-4">
                    {order.items.map((item, index) => {
                      // Agar product delete ho gaya ho, to safe check lagayein
                      const product = item.product;
                      if (!product) return null;

                      return (
                        <div key={index} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            {/* Product Image */}
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                              {product.images && product.images[0] ? (
                                <img 
                                  src={product.images[0]} 
                                  alt={product.modelName} 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                                  <Package size={20} />
                                </div>
                              )}
                            </div>

                            {/* Product Name & Brand */}
                            <div>
                              <p className="text-sm font-bold text-gray-900">{product.modelName}</p>
                              <p className="text-xs text-gray-500">{product.brand}</p>
                            </div>
                          </div>

                          {/* Quantity & Price */}
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-sm text-gray-500">
                              x ${item.price?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrdersList;