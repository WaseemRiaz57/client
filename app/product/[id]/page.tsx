'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, Plus, Minus, ShoppingCart, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';
import Navbar from '@/components/Navbar';

interface Product {
  _id: string;
  modelName: string;
  brand: string;
  price: number;
  images: string[];
  description?: string;
  stock?: number;
}

interface ProductDetails extends Product {
  movement?: string;
  caseSize?: string;
  waterResistance?: string;
  caseMaterial?: string;
  dialColor?: string;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { addItem } = useCartStore();

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axiosInstance.get(`/products/${productId}`);
        setProduct(data);
        setSelectedImageIndex(0);
      } catch (err: any) {
        const message = err?.response?.data?.message || err?.message || 'Failed to load product';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Helper function to resolve image URLs
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200&auto=format&fit=crop';
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    if (imagePath.startsWith('/')) {
      return `http://localhost:5000${imagePath}`;
    }
    return imagePath;
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product._id,
      modelName: product.modelName,
      brand: product.brand,
      price: product.price,
      image: product.images?.[0] || '',
      quantity,
    });

    toast.success(`${product.modelName} added to cart!`);
    setQuantity(1);
  };

  // Handle buy now - add to cart and go to checkout
  const handleBuyNow = () => {
    if (!product) return;

    addItem({
      id: product._id,
      modelName: product.modelName,
      brand: product.brand,
      price: product.price,
      image: product.images?.[0] || '',
      quantity,
    });

    toast.success(`Proceeding to checkout...`);
    router.push('/checkout');
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <div className="flex items-center justify-center py-40">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        </div>
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <div className="flex flex-col items-center justify-center py-40 px-6">
          <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
          <p className="text-gray-400 mb-8">{error || 'The product you are looking for does not exist.'}</p>
          <Link
            href="/shop"
            className="inline-block border-2 border-gold bg-transparent px-8 py-3 text-gold hover:bg-gold hover:text-black transition-all"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Dummy specifications for demo (would come from API)
  const specifications = [
    { label: 'Brand', value: product.brand },
    { label: 'Movement', value: product.movement || 'Automatic Swiss' },
    { label: 'Case Material', value: product.caseMaterial || 'Stainless Steel' },
    { label: 'Case Size', value: product.caseSize || '42mm' },
    { label: 'Water Resistance', value: product.waterResistance || '300m' },
    { label: 'Dial Color', value: product.dialColor || 'Black' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Breadcrumbs */}
      <div className="border-b border-gold/20 px-6 py-4 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          <Link href="/" className="text-gray-400 hover:text-gold transition">
            Home
          </Link>
          <span className="text-gray-500">/</span>
          <Link href="/shop" className="text-gray-400 hover:text-gold transition">
            Shop
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gold">{product.modelName}</span>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-6 py-12 sm:px-12 lg:px-24 lg:py-16"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-900/50 mb-6 rounded-sm border border-gold/10">
              <Image
                src={getImageUrl(product.images?.[selectedImageIndex])}
                alt={product.modelName}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square overflow-hidden rounded-sm border-2 transition ${
                      selectedImageIndex === index ? 'border-gold' : 'border-gold/20 hover:border-gold/50'
                    }`}
                  >
                    <Image
                      src={getImageUrl(image)}
                      alt={`${product.modelName} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info (Sticky) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-8">
              {/* Brand & Title */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gold mb-3">
                  {product.brand}
                </p>
                <h1 className="font-heading text-4xl font-bold leading-tight mb-2">
                  {product.modelName}
                </h1>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < 4 ? 'fill-gold text-gold' : 'text-gold/30'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">(24 reviews)</span>
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-b border-gold/20 py-6">
                <div className="text-4xl font-bold text-gold">
                  ${product.price.toLocaleString()}
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {product.stock && product.stock > 0 ? (
                    <span className="text-green-400">In Stock</span>
                  ) : (
                    <span className="text-red-400">Out of Stock</span>
                  )}
                </p>
              </div>

              {/* Description */}
              <div>
                <p className="font-body text-base leading-relaxed text-gray-300">
                  {product.description ||
                    'A timeless masterpiece of Swiss horological craftsmanship. Every detail is meticulously engineered for precision and elegance.'}
                </p>
              </div>

              {/* Specifications Grid */}
              <div className="bg-gray-900/30 rounded-sm p-6 border border-gold/10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gold mb-4">
                  Specifications
                </h3>
                <div className="space-y-3">
                  {specifications.map((spec, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-400">{spec.label}</span>
                      <span className="text-white font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gold mb-3">
                  Quantity
                </p>
                <div className="flex items-center gap-4 bg-gray-900/50 rounded-sm p-2 border border-gold/10">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:text-gold transition"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="flex-1 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock || 10, quantity + 1))
                    }
                    className="p-2 hover:text-gold transition"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!product.stock || product.stock === 0}
                className="w-full bg-gold hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 px-6 transition duration-300 flex items-center justify-center gap-2 rounded-sm"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>

              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                disabled={!product.stock || product.stock === 0}
                className="w-full bg-transparent border border-[#D4AF37] text-[#D4AF37] font-bold py-4 px-6 transition duration-300 hover:bg-[#D4AF37] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
              >
                BUY NOW
              </button>

              {/* Additional Info */}
              <div className="text-xs text-gray-400 text-center">
                <p>✓ Free Shipping Worldwide</p>
                <p>✓ 2-Year International Warranty</p>
                <p>✓ 30-Day Money-Back Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <div className="border-t border-gold/20 px-6 py-12 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 mb-6">Discover more from our collection</p>
          <Link
            href="/shop"
            className="inline-block border-2 border-gold bg-transparent px-8 py-4 text-gold hover:bg-gold hover:text-black transition-all duration-300"
          >
            Explore All Timepieces
          </Link>
        </div>
      </div>
    </div>
  );
}
