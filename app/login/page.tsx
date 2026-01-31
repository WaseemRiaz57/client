'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';

// ✅ Ye line yahan add karein (sab se zaroori):
export const dynamic = "force-dynamic";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  // Get redirect URL from query params if available
  const redirectUrl = searchParams?.get('redirect') || null;

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError('');

      // Login with email and password
      const response = await authAPI.login(data);
      
      // Validate response structure
      if (!response.data || !response.data.token) {
        throw new Error('Invalid response from server');
      }

      // Store token and user data
      const token = response.data.token;
      const user = response.data.user;

      localStorage.setItem('auth-token', token);
      localStorage.setItem('user', JSON.stringify(user));

      console.log('Login successful. User role:', user.role);

      // Determine redirect destination based on priority:
      // 1. If admin, always go to /admin (override any redirect param)
      // 2. If redirect param exists, use it
      // 3. Otherwise, go to /products

      if (user.role === 'admin') {
        console.log('Admin user detected. Redirecting to /admin');
        router.push('/admin');
      } else if (redirectUrl && redirectUrl.startsWith('/')) {
        // Validate redirect URL for security (must start with /)
        console.log('Redirect parameter found. Redirecting to:', redirectUrl);
        router.push(redirectUrl);
      } else {
        console.log('Regular user. Redirecting to /products');
        router.push('/products');
      }
    } catch (err: any) {
      console.error('Login Error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-heading text-4xl font-bold text-primary">
            Welcome Back
          </h1>
          <p className="font-body text-gray-600">
            Login to access your account
          </p>
        </div>

        {/* Form */}
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <p className="font-body text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                type="email"
                className="w-full border border-gray-300 px-4 py-3 font-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-md"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 font-body text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                type="password"
                className="w-full border border-gray-300 px-4 py-3 font-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-md"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 font-body text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary py-3 font-body text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <p className="font-body text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-semibold text-primary hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}