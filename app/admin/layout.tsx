'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  role: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if token exists
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
        
        if (!token) {
          console.warn('No auth token found');
          router.push('/login?redirect=/admin');
          return;
        }

        // Fetch user profile with explicit Authorization header
        const response = await axiosInstance.get('/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Safely extract user data - handle both response.data.user and response.data
        const userData = response.data.user || response.data;

        console.log('API Response:', response.data);
        console.log('Extracted userData:', userData);
        console.log('User role:', userData?.role);

        // Validate user object exists and has required properties
        if (!userData || typeof userData !== 'object') {
          throw new Error('Invalid user data received from API');
        }

        // Check if user has admin role
        if (userData.role !== 'admin') {
          console.warn('User is not an admin. Role:', userData.role, '- Redirecting to home.');
          router.push('/');
          return;
        }

        console.log('Admin user authenticated successfully');
        // Set user data successfully
        setUser(userData);
        setLoading(false);
      } catch (error: any) {
        console.error('Admin auth check failed:', error);
        
        // Determine error message
        const errorMessage = error.response?.data?.message || error.message || 'Authentication failed';
        setError(errorMessage);

        // Clear invalid token and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-token');
        }
        
        router.push('/login?redirect=/admin');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="font-body text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:ml-64">
        {children}
      </main>
    </div>
  );
}
