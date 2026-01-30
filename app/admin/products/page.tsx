'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { Plus, Edit2, Trash2, Loader2, AlertCircle, AlertTriangle } from 'lucide-react';
import ProductImage from '@/components/ProductImage';

interface Product {
  _id: string;
  modelName: string;
  brand: string;
  price: number;
  stock: number;
  images?: string[];
  image?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }

      const response = await axiosInstance.get('/products', {
        params: { page },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle both array and paginated responses
      const productList = Array.isArray(response.data)
        ? response.data
        : response.data?.products || [];

      setProducts(productList);

      // Update total count from pagination data
      const total = response.data?.pagination?.total || productList.length;
      setTotalProducts(total);

      const pages = response.data?.pagination?.pages || 1;
      setTotalPages(pages);

      console.log('Products loaded:', productList);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to load products. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [page, fetchProducts]);

  // Open delete modal
  const openDeleteModal = (id: string) => {
    setProductToDelete(id);
    setDeleteModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  // Handle delete product
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      setDeleting(productToDelete);

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }

      await axiosInstance.delete(`/admin/products/${productToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove product from state
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productToDelete)
      );

      console.log('Product deleted successfully:', productToDelete);
      closeDeleteModal();
    } catch (err: any) {
      console.error('Error deleting product:', err);
      const errorMessage =
        err.response?.data?.message || 'Failed to delete product. Please try again.';
      setError(errorMessage);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-gray-600" />
          <p className="mt-4 font-body text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-4xl font-bold text-gray-900">Products Management</h1>
            <p className="mt-2 font-body text-gray-600">Manage and edit your watch inventory</p>
          </div>
          <Link
            href="/admin/products/add"
            className="inline-flex items-center gap-2 rounded-md bg-black px-6 py-3 font-body text-sm font-bold text-white hover:bg-gray-800 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add New Product
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="font-body text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="rounded-lg bg-white shadow-sm overflow-hidden">
          {products.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-body text-gray-500 text-lg">No products found.</p>
              <p className="mt-2 font-body text-sm text-gray-400">
                Get started by{' '}
                <Link
                  href="/admin/products/add"
                  className="text-black font-semibold hover:underline"
                >
                  adding your first product
                </Link>
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left font-heading text-sm font-semibold text-gray-700">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left font-heading text-sm font-semibold text-gray-700">
                      Model Name
                    </th>
                    <th className="px-6 py-4 text-left font-heading text-sm font-semibold text-gray-700">
                      Brand
                    </th>
                    <th className="px-6 py-4 text-left font-heading text-sm font-semibold text-gray-700">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left font-heading text-sm font-semibold text-gray-700">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left font-heading text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    return (
                      <tr
                        key={product._id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        {/* Image */}
                        <td className="px-6 py-4">
                          <ProductImage
                            src={product.images?.[0]}
                            alt={product.modelName}
                            className="h-12 w-12 rounded-md border object-cover"
                          />
                        </td>

                        {/* Model Name */}
                        <td className="px-6 py-4 font-body text-sm font-medium text-gray-900">
                          {product.modelName}
                        </td>

                        {/* Brand */}
                        <td className="px-6 py-4 font-body text-sm text-gray-700">
                          {product.brand}
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4 font-body text-sm font-semibold text-gray-900">
                          PKR {product.price.toLocaleString()}
                        </td>

                        {/* Stock */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 font-body text-xs font-medium ${
                              product.stock > 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.stock} in stock
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* Edit Button */}
                            <Link
                              href={`/admin/products/edit/${product._id}`}
                              className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              title="Edit product"
                            >
                              <Edit2 className="h-5 w-5" />
                            </Link>

                            {/* Delete Button */}
                            <button
                              onClick={() => openDeleteModal(product._id)}
                              disabled={deleting === product._id}
                              className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                              title="Delete product"
                            >
                              {deleting === product._id ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <Trash2 className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        {products.length > 0 && (
          <div className="mt-6 rounded-lg bg-white p-4 shadow-sm">
            <p className="font-body text-sm text-gray-600">
              Total Products: <span className="font-semibold text-gray-900">{totalProducts}</span>
            </p>
          </div>
        )}

        {/* Pagination */}
        {products.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="rounded-md border border-gray-300 px-4 py-2 font-body text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="font-body text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page >= totalPages}
              className="rounded-md border border-gray-300 px-4 py-2 font-body text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg bg-white shadow-xl">
            {/* Modal Content */}
            <div className="p-6">
              {/* Icon */}
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-red-100 p-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>

              {/* Title and Message */}
              <h3 className="mb-2 text-center font-heading text-xl font-bold text-gray-900">
                Are you sure?
              </h3>
              <p className="mb-6 text-center font-body text-sm text-gray-600">
                This action cannot be undone. The product will be permanently deleted.
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  disabled={deleting !== null}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 font-body font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  disabled={deleting !== null}
                  className="flex-1 rounded-md bg-red-600 px-4 py-2 font-body font-medium text-white hover:bg-red-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {deleting === productToDelete ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
