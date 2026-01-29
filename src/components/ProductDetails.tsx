'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import ImageGallery from '@/components/ImageGallery';

interface Product {
  _id: string;
  modelName: string;
  brand: string;
  price: number;
  description: string;
  images: string[];
  condition: string;
  movement: string;
  caseSize: string;
  material: string;
  waterResistance: string;
  sapphireGlass: boolean;
  stock: number;
  avgRating?: number;
  reviews?: Array<{
    user: { name: string };
    rating: number;
    comment: string;
    createdAt: string;
  }>;
}

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      brand: product.brand,
      modelName: product.modelName,
      price: product.price,
      image: product.images[0] || '',
      stock: product.stock,
    });
    alert('Added to cart!');
  };

  const specifications = [
    { label: 'Brand', value: product.brand },
    { label: 'Movement', value: product.movement },
    { label: 'Condition', value: product.condition },
    { label: 'Case Size', value: product.caseSize },
    { label: 'Material', value: product.material },
    { label: 'Water Resistance', value: product.waterResistance },
    { label: 'Sapphire Glass', value: product.sapphireGlass ? 'Yes' : 'No' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left Side - Image Gallery */}
        <div>
          <ImageGallery images={product.images} productName={product.modelName} />
        </div>

        {/* Right Side - Product Details */}
        <div>
          {/* Brand */}
          <p className="mb-2 font-body text-sm uppercase tracking-widest text-gray-500">
            {product.brand}
          </p>

          {/* Product Name */}
          <h1 className="mb-4 font-heading text-4xl font-bold text-primary lg:text-5xl">
            {product.modelName}
          </h1>

          {/* Rating */}
          {product.avgRating && product.avgRating > 0 && (
            <div className="mb-6 flex items-center gap-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.avgRating!)
                        ? 'text-gold'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-body text-gray-600">
                {product.avgRating.toFixed(1)} ({product.reviews?.length || 0} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mb-8 border-b border-t border-gray-200 py-6">
            <p className="font-heading text-5xl font-bold text-primary">
              ${product.price.toLocaleString()}
            </p>
            <p className="mt-2 font-body text-sm text-gray-600">
              {product.stock > 0 ? (
                <span className="text-green-600">In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </p>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="mb-3 font-heading text-xl font-semibold text-primary">
              Description
            </h2>
            <p className="font-body leading-relaxed text-gray-700">
              {product.description}
            </p>
          </div>

          {/* Quantity & Add to Cart */}
          {product.stock > 0 && (
            <div className="mb-8 flex items-center gap-4">
              <div className="flex items-center border border-gray-300">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 font-body text-lg font-bold hover:bg-gray-100"
                >
                  −
                </button>
                <span className="w-16 text-center font-body text-lg font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-3 font-body text-lg font-bold hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary py-4 font-body text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-gray-800"
              >
                Add to Cart
              </button>
            </div>
          )}

          {/* Specifications */}
          <div className="mb-8">
            <h2 className="mb-4 font-heading text-xl font-semibold text-primary">
              Specifications
            </h2>
            <div className="space-y-3">
              {specifications.map((spec, index) => (
                <div
                  key={index}
                  className="flex justify-between border-b border-gray-200 pb-3 font-body text-sm"
                >
                  <span className="font-semibold text-gray-700">{spec.label}:</span>
                  <span className="capitalize text-gray-600">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Authenticity Guarantee */}
          <div className="rounded-lg border-2 border-gold bg-gold/5 p-6">
            <div className="mb-3 flex items-center gap-3">
              <svg
                className="h-8 w-8 text-gold"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Authenticity Guarantee
              </h2>
            </div>
            <div className="space-y-2 font-body text-gray-700">
              <p className="flex items-start gap-2">
                <span className="mt-1 text-gold">✓</span>
                <span>Every watch is thoroughly inspected by certified horologists</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="mt-1 text-gold">✓</span>
                <span>Comes with certificate of authenticity</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="mt-1 text-gold">✓</span>
                <span>Backed by our 2-year warranty</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="mt-1 text-gold">✓</span>
                <span>30-day money-back guarantee</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
