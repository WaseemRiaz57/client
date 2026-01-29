'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { adminProductsAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface ProductFormData {
  name: string;
  brand: string;
  modelName: string;
  price: number;
  description: string;
  condition: 'new' | 'pre-owned';
  movement: 'automatic' | 'quartz';
  caseSize: string;
  material: string;
  waterResistance: string;
  sapphireGlass: boolean;
  stock: number;
  category?: string;
}

const AddProductForm = () => {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );

    addImages(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      addImages(files);
    }
  };

  const addImages = (newFiles: File[]) => {
    setImages((prev) => [...prev, ...newFiles]);

    // Create preview URLs
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setUploading(true);

      // Create FormData for multipart upload
      const formData = new FormData();

      // Append product data
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      // Append images
      images.forEach((image) => {
        formData.append('images', image);
      });

      await adminProductsAPI.create(formData);

      alert('Product created successfully!');
      reset();
      setImages([]);
      setPreviews([]);
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error creating product:', error);
      alert(error.response?.data?.message || 'Failed to create product');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-6 font-heading text-2xl font-bold text-primary">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Product Name */}
          <div>
            <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
              Product Name *
            </label>
            <input
              {...register('name', { required: 'Product name is required' })}
              type="text"
              className="w-full border border-gray-300 px-4 py-3 font-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Submariner Date 41mm"
            />
            {errors.name && (
              <p className="mt-1 font-body text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Brand */}
          <div>
            <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
              Brand *
            </label>
            <input
              {...register('brand', { required: 'Brand is required' })}
              type="text"
              className="w-full border border-gray-300 px-4 py-3 font-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Rolex"
            />
            {errors.brand && (
              <p className="mt-1 font-body text-xs text-red-600">{errors.brand.message}</p>
            )}
          </div>

          {/* Model Name */}
          <div>
            <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
              Model Name *
            </label>
            <input
              {...register('modelName', { required: 'Model name is required' })}
              type="text"
              className="w-full border border-gray-300 px-4 py-3 font-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="126610LN"
            />
            {errors.modelName && (
              <p className="mt-1 font-body text-xs text-red-600">{errors.modelName.message}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
              Price ($) *
            </label>
            <input
              {...register('price', {
                required: 'Price is required',
                min: { value: 0, message: 'Price must be positive' },
              })}
              type="number"
              step="0.01"
              className="w-full border border-gray-300 px-4 py-3 font-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="12500"
            />
            {errors.price && (
              <p className="mt-1 font-body text-xs text-red-600">{errors.price.message}</p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
              Stock Quantity *
            </label>
            <input
              {...register('stock', {
                required: 'Stock is required',
                min: { value: 0, message: 'Stock cannot be negative' },
              })}
              type="number"
              className="w-full border border-gray-300 px-4 py-3 font-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="5"
            />
            {errors.stock && (
              <p className="mt-1 font-body text-xs text-red-600">{errors.stock.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
              Category
            </label>
            <input
              {...register('category')}
              type="text"
              className="w-full border border-gray-300 px-4 py-3 font-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Dive Watches"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
            Description *
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={5}
            className="w-full border border-gray-300 px-4 py-3 font-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Detailed product description..."
          />
          {errors.description && (
            <p className="mt-1 font-body text-xs text-red-600">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-6 font-heading text-2xl font-bold text-primary">
          Technical Specifications
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Condition */}
          <div>
            <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
              Condition *
            </label>
            <select
              {...register('condition', { required: 'Condition is required' })}
              className="w-full border border-gray-300 px-4 py-3 font-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select condition</option>
              <option value="new">New</option>
              <option value="pre-owned">Pre-owned</option>
            </select>
            {errors.condition && (
              <p className="mt-1 font-body text-xs text-red-600">{errors.condition.message}</p>
            )}
          </div>

          {/* Movement */}
          <div>
            <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
              Movement Type *
            </label>
            <select
              {...register('movement', { required: 'Movement type is required' })}
              className="w-full border border-gray-300 px-4 py-3 font-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select movement</option>
              <option value="automatic">Automatic</option>
              <option value="quartz">Quartz</option>
            </select>
            {errors.movement && (
              <p className="mt-1 font-body text-xs text-red-600">{errors.movement.message}</p>
            )}
          </div>

          {/* Case Size */}
          <div>
            <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
              Case Size *
            </label>
            <input
              {...register('caseSize', { required: 'Case size is required' })}
              type="text"
              className="w-full border border-gray-300 px-4 py-3 font-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="41mm"
            />
            {errors.caseSize && (
              <p className="mt-1 font-body text-xs text-red-600">{errors.caseSize.message}</p>
            )}
          </div>

          {/* Material */}
          <div>
            <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
              Material *
            </label>
            <input
              {...register('material', { required: 'Material is required' })}
              type="text"
              className="w-full border border-gray-300 px-4 py-3 font-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Stainless Steel"
            />
            {errors.material && (
              <p className="mt-1 font-body text-xs text-red-600">{errors.material.message}</p>
            )}
          </div>

          {/* Water Resistance */}
          <div>
            <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
              Water Resistance *
            </label>
            <input
              {...register('waterResistance', { required: 'Water resistance is required' })}
              type="text"
              className="w-full border border-gray-300 px-4 py-3 font-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="300m"
            />
            {errors.waterResistance && (
              <p className="mt-1 font-body text-xs text-red-600">
                {errors.waterResistance.message}
              </p>
            )}
          </div>

          {/* Sapphire Glass */}
          <div>
            <label className="flex items-center gap-3 font-body text-sm font-semibold text-gray-700">
              <input
                {...register('sapphireGlass')}
                type="checkbox"
                className="h-5 w-5 border-gray-300 text-primary focus:ring-primary"
              />
              <span>Sapphire Glass</span>
            </label>
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-6 font-heading text-2xl font-bold text-primary">
          Product Images
        </h2>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative mb-6 cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-all ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <svg
            className="mx-auto mb-4 h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mb-2 font-body text-lg font-semibold text-gray-700">
            Drop images here or click to browse
          </p>
          <p className="font-body text-sm text-gray-500">
            Supports JPG, PNG, WebP, GIF (max 10MB per file)
          </p>
        </div>

        {/* Image Previews */}
        {previews.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {previews.map((preview, index) => (
              <div key={index} className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute right-2 top-2 rounded-full bg-red-600 p-2 text-white opacity-0 transition-opacity hover:bg-red-700 group-hover:opacity-100"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-gray-300 bg-white px-8 py-3 font-body text-sm font-bold uppercase tracking-wider text-gray-700 transition-all duration-300 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={uploading}
          className="bg-primary px-8 py-3 font-body text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? 'Creating...' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;
