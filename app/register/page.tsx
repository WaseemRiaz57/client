'use client';

// ✅ 1. Suspense import kiya
import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';

// Backend requirements interface
interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ✅ 2. Asli logic ko 'RegisterForm' component bana diya
function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      setError('');

      const response = await authAPI.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      
      if (response.status === 200 || response.status === 201) {
        alert("Registration Successful! Please Login.");
        router.push('/login');
      }

    } catch (err: any) {
      console.error("Registration Error:", err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-heading text-4xl font-bold text-gray-900">
            Create Account
          </h1>
          <p className="font-body text-gray-600">
            Join us to explore luxury timepieces
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

            {/* Split Name into First and Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
                  First Name
                </label>
                <input
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: { value: 2, message: 'Min 2 chars' },
                  })}
                  type="text"
                  className="w-full border border-gray-300 px-4 py-3 rounded-md font-body focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 font-body text-xs text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
                  Last Name
                </label>
                <input
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: { value: 2, message: 'Min 2 chars' },
                  })}
                  type="text"
                  className="w-full border border-gray-300 px-4 py-3 rounded-md font-body focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 font-body text-xs text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

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
                className="w-full border border-gray-300 px-4 py-3 rounded-md font-body focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
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
                className="w-full border border-gray-300 px-4 py-3 rounded-md font-body focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 font-body text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <input
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
                type="password"
                className="w-full border border-gray-300 px-4 py-3 rounded-md font-body focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 font-body text-xs text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black py-3 rounded-md font-body text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <p className="font-body text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-black hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ 3. Main Component jo Suspense use karega (Safe for Next.js 16)
export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}