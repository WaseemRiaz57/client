'use client';

// ✅ Suspense ko import karna zaroori hai
import { useState, Suspense } from 'react'; 
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';

interface LoginFormData {
  email: string;
  password: string;
}

// 1️⃣ Asli Logic ko aik alag component mein rakhein
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); // ✅ Ye ab Suspense ke andar aa gaya
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const redirectUrl = searchParams?.get('redirect') || null;

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError('');

      const response = await authAPI.login(data);
      
      if (!response.data || !response.data.token) {
        throw new Error('Invalid response from server');
      }

      const token = response.data.token;
      const user = response.data.user;

      localStorage.setItem('auth-token', token);
      localStorage.setItem('user', JSON.stringify(user));

      console.log('Login successful. User role:', user.role);

      if (user.role === 'admin') {
        router.push('/admin');
      } else if (redirectUrl && redirectUrl.startsWith('/')) {
        router.push(redirectUrl);
      } else {
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
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-heading text-4xl font-bold text-primary">
            Welcome Back
          </h1>
          <p className="font-body text-gray-600">
            Login to access your account
          </p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <p className="font-body text-sm text-red-600">{error}</p>
              </div>
            )}

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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary py-3 font-body text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

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

// 2️⃣ Main Page Component jo Suspense use karega
export default function LoginPage() {
  return (
    // ✅ Ye Suspense wrapper error ko khatam kar dega
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}