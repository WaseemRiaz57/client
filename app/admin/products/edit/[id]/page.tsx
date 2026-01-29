'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface FormData {
  modelName: string;
  brand: string;
  price: string;
  stock: string;
  description: string;
  imageUrl: string;
  movement?: string;
  caseSize?: string;
  waterResistance?: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    modelName: '',
    brand: '',
    price: '',
    stock: '',
    description: '',
    imageUrl: '',
    movement: 'automatic',
    caseSize: '42mm',
    waterResistance: '300m',
  });

  // Fetch product data on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');

        const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

        if (!token) {
          setError('Authentication required. Please log in again.');
          setLoading(false);
          return;
        }

        const response = await axiosInstance.get(`/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const product = response.data;

        // Pre-fill form with product data
        setFormData({
          modelName: product.modelName || '',
          brand: product.brand || '',
          price: product.price?.toString() || '',
          stock: product.stock?.toString() || '',
          description: product.description || '',
          imageUrl: product.images?.[0] || product.image || '',
          movement: product.movement || 'automatic',
          caseSize: product.caseSize || '42mm',
          waterResistance: product.waterResistance || '300m',
        });

        console.log('Product loaded:', product);
      } catch (err: any) {
        console.error('Error fetching product:', err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Failed to load product. Please try again.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.modelName.trim()) {
      setError('Model Name is required');
      return false;
    }
    if (!formData.brand.trim()) {
      setError('Brand is required');
      return false;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return false;
    }
    if (!formData.stock || Number(formData.stock) < 0) {
      setError('Stock must be a valid number');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.imageUrl.trim()) {
      setError('Image URL is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }

      // Prepare product data - wrap imageUrl in an array for the backend
      const productData = {
        modelName: formData.modelName.trim(),
        brand: formData.brand.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description.trim(),
        images: [formData.imageUrl.trim()], // Wrap URL in array
        movement: formData.movement || 'automatic',
        caseSize: formData.caseSize || '42mm',
        waterResistance: formData.waterResistance || '300m',
        condition: 'new',
        sapphireGlass: true,
      };

      console.log('Submitting product update:', productData);

      // Submit to backend
      const response = await axiosInstance.put(`/admin/products/${productId}`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Product updated successfully:', response.data);
      setSuccess(true);

      // Redirect to products list
      setTimeout(() => {
        router.push('/admin/products');
      }, 500);
    } catch (err: any) {
      console.error('Error updating product:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to update product. Please try again.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-gray-600" />
          <p className="mt-4 font-body text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Back Button */}
        <Link
          href="/admin/products"
          className="mb-8 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 font-body text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-gray-900">Edit Watch</h1>
          <p className="mt-2 font-body text-gray-600">Update luxury watch listing details</p>
        </div>

        {/* Form Card */}
        <div className="rounded-lg bg-white p-8 shadow-lg">
          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200">
              <p className="font-body text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 rounded-lg bg-green-50 p-4 border border-green-200">
              <p className="font-body text-sm text-green-600">Product updated successfully!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Model Name */}
            <div>
              <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
                Model Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="modelName"
                value={formData.modelName}
                onChange={handleInputChange}
                placeholder="e.g., Submariner"
                className="w-full border border-gray-300 px-4 py-2 font-body rounded-md focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
                Brand <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="e.g., Rolex"
                className="w-full border border-gray-300 px-4 py-2 font-body rounded-md focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>

            {/* Price and Stock - Two Columns */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
                  Price (PKR) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="50000"
                  min="0"
                  step="100"
                  className="w-full border border-gray-300 px-4 py-2 font-body rounded-md focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>

              <div>
                <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
                  Count in Stock <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="10"
                  min="0"
                  className="w-full border border-gray-300 px-4 py-2 font-body rounded-md focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
                Image URL <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="w-full border border-gray-300 px-4 py-2 font-body rounded-md focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
              />
              <p className="mt-1 font-body text-xs text-gray-500">
                Use Cloudinary or Unsplash image URLs for best results
              </p>
            </div>

            {/* Movement */}
            <div>
              <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
                Movement
              </label>
              <select
                name="movement"
                value={formData.movement}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-4 py-2 font-body rounded-md focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
              >
                <option value="automatic">Automatic</option>
                <option value="quartz">Quartz</option>
              </select>
            </div>

            {/* Case Size */}
            <div>
              <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
                Case Size
              </label>
              <input
                type="text"
                name="caseSize"
                value={formData.caseSize}
                onChange={handleInputChange}
                placeholder="42mm"
                className="w-full border border-gray-300 px-4 py-2 font-body rounded-md focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>

            {/* Water Resistance */}
            <div>
              <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
                Water Resistance
              </label>
              <input
                type="text"
                name="waterResistance"
                value={formData.waterResistance}
                onChange={handleInputChange}
                placeholder="300m"
                className="w-full border border-gray-300 px-4 py-2 font-body rounded-md focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
                Description <span className="text-red-600">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the watch in detail..."
                rows={5}
                className="w-full border border-gray-300 px-4 py-2 font-body rounded-md focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-md bg-black px-6 py-3 font-body text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? 'Updating Product...' : 'Update Product'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-md border border-gray-300 px-6 py-3 font-body text-sm font-bold text-gray-700 transition-all hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
