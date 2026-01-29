'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast'; // 👈 1. IMPORT ADDED

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

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // UI purpose only
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

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
    if (!imageFile) {
      setError('Please select an image file');
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
      setLoading(true);

      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }

      // Prepare FormData for multipart upload
      const formDataToSend = new FormData();
      formDataToSend.append('modelName', formData.modelName.trim());
      formDataToSend.append('brand', formData.brand.trim());
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('movement', formData.movement || 'automatic');
      formDataToSend.append('caseSize', formData.caseSize || '42mm');
      formDataToSend.append('waterResistance', formData.waterResistance || '300m');
      formDataToSend.append('condition', 'new');
      formDataToSend.append('sapphireGlass', 'true');
      
      // Append the image file
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      console.log('Submitting product with file upload');

      // Submit to backend
      const response = await axiosInstance.post('/admin/products', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Product created successfully:', response.data);
      setSuccess(true);

      // 👈 3. FIX: Alert removed, Toast added
      toast.success('Product added successfully!', {
        style: {
          border: '1px solid #4ade80',
          padding: '16px',
          color: '#15803d',
        },
        iconTheme: {
          primary: '#15803d',
          secondary: '#FFFAEE',
        },
      });

      // Redirect to products list
      setTimeout(() => {
        router.push('/admin/products');
      }, 1000); // 1 second delay taake user toast parh sakay
    } catch (err: any) {
      console.error('Error creating product:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to create product. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage); // Error ka toast bhi dikha diya
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="font-heading text-4xl font-bold text-gray-900">Add New Watch</h1>
          <p className="mt-2 font-body text-gray-600">Create a new luxury watch listing</p>
        </div>

        {/* Form Card */}
        <div className="rounded-lg bg-white p-8 shadow-lg">
          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200">
              <p className="font-body text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message UI (Optional, since Toast is there) */}
          {success && (
            <div className="mb-6 rounded-lg bg-green-50 p-4 border border-green-200">
              <p className="font-body text-sm text-green-600">Product created successfully! Redirecting...</p>
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

            {/* Image File Upload */}
            <div>
              <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
                Product Image <span className="text-red-600">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    // Create preview
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImagePreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full border border-gray-300 px-4 py-2 font-body rounded-md focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
              />
              <p className="mt-1 font-body text-xs text-gray-500">
                Accepted formats: JPEG, PNG, WebP (Max 10MB)
              </p>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <p className="mb-2 font-body text-sm font-semibold text-gray-700">Preview</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-40 w-40 rounded-lg border object-cover shadow-sm"
                  />
                </div>
              )}
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
                disabled={loading}
                className="flex-1 rounded-md bg-black px-6 py-3 font-body text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Adding Product...' : 'Add Product'}
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