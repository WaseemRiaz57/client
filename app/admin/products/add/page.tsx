'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosInstance from '@/lib/axios'; // Make sure path is correct
import { ArrowLeft, Upload, X } from 'lucide-react'; // Added Upload/X icons for better UI
import toast from 'react-hot-toast';

interface FormData {
  modelName: string;
  brand: string;
  price: string;
  stock: string;
  description: string;
  movement: string;
  caseSize: string;
  waterResistance: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Multiple Images State
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState<FormData>({
    modelName: '',
    brand: '',
    price: '',
    stock: '',
    description: '',
    movement: 'Automatic',
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

  // ✅ Handle Multiple Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      
      // Append new files to existing ones (optional: replace setImageFiles(newFiles) if you want to overwrite)
      setImageFiles((prev) => [...prev, ...newFiles]);

      // Generate Previews
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // ✅ Remove Image from Selection
  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    if (!formData.modelName.trim()) { setError('Model Name is required'); return false; }
    if (!formData.brand.trim()) { setError('Brand is required'); return false; }
    if (!formData.price || Number(formData.price) <= 0) { setError('Price must be greater than 0'); return false; }
    if (!formData.stock || Number(formData.stock) < 0) { setError('Stock must be a valid number'); return false; }
    if (!formData.description.trim()) { setError('Description is required'); return false; }
    if (imageFiles.length === 0) { setError('Please select at least one image file'); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null; // Check your token key name

      if (!token) {
        toast.error('Authentication required');
        router.push('/login');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('modelName', formData.modelName.trim());
      formDataToSend.append('brand', formData.brand.trim());
      formDataToSend.append('price', formData.price);
      formDataToSend.append('countInStock', formData.stock); // Backend expects 'countInStock' likely
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('movement', formData.movement);
      formDataToSend.append('caseSize', formData.caseSize);
      formDataToSend.append('waterResistance', formData.waterResistance);
      formDataToSend.append('category', 'Luxury'); // Default category

      // ✅ Append All Images
      imageFiles.forEach((file) => {
        formDataToSend.append('images', file);
      });

      // API Call
      await axiosInstance.post('/admin/products', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Product added successfully!');
      
      setTimeout(() => {
        router.push('/admin/products');
      }, 1000);

    } catch (err: any) {
      console.error('Error creating product:', err);
      const msg = err.response?.data?.message || 'Failed to create product';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        
        {/* Back Button */}
        <Link
          href="/admin/products"
          className="mb-8 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 font-body text-sm font-medium text-gray-700 hover:bg-gray-100 shadow-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-gray-900">Add New Watch</h1>
          <p className="mt-2 text-gray-600">Create a new luxury watch listing</p>
        </div>

        {/* Form */}
        <div className="rounded-lg bg-white p-8 shadow-lg border border-gray-100">
          
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basic Info Section */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Model Name *</label>
                <input
                  type="text"
                  name="modelName"
                  value={formData.modelName}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="e.g. Submariner"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Brand *</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="e.g. Rolex"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Price (PKR) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Stock Quantity *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="5"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Description *</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black"
                placeholder="Describe the watch details..."
              />
            </div>

            {/* Technical Specs */}
            <div className="grid gap-6 md:grid-cols-3 bg-gray-50 p-4 rounded-md">
               <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Movement</label>
                <select
                  name="movement"
                  value={formData.movement}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Quartz">Quartz</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Case Size</label>
                <input
                  type="text"
                  name="caseSize"
                  value={formData.caseSize}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Water Res.</label>
                <input
                  type="text"
                  name="waterResistance"
                  value={formData.waterResistance}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>

            {/* ✅ Image Upload Section (Improved UI) */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Product Images *</label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 bg-gray-50 hover:bg-gray-100 transition">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-black focus-within:outline-none focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2 hover:text-gray-700"
                    >
                      <span className="px-2">Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple // ✅ Multiple Enabled
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={src}
                        alt="Preview"
                        className="h-24 w-full rounded-md object-cover border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-md bg-black px-6 py-3 font-bold text-white shadow-md hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-md border border-gray-300 px-6 py-3 font-bold text-gray-700 hover:bg-gray-50"
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