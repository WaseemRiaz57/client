'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import type { AxiosError } from 'axios';
import { productsAPI } from '@/lib/api';
import { useCartStore } from '@/store/useCartStore';

type ProductSpecKey = 'movement' | 'caseSize' | 'waterResistance';

interface Product {
  _id: string;
  brand: string;
  modelName: string;
  price: number;
  discountPrice?: number;
  description?: string;
  movement?: string;
  caseSize?: string;
  waterResistance?: string;
  material?: string;
  stock: number;
  images: string[];
}

const formatCurrency = (amount: number) => {
  try {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (error) {
    return `PKR ${amount.toLocaleString()}`;
  }
};

const ProductDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const productId = useMemo(() => {
    const idParam = params?.id;
    if (Array.isArray(idParam)) {
      return idParam[0];
    }
    return idParam ?? '';
  }, [params]);

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getItemQuantity = useCartStore((state) => state.getItemQuantity);

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      if (!productId) {
        setError('Invalid product identifier.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');

        const response = await productsAPI.getById(productId);
        const productData: Product = response.data;

        if (!productData || !productData._id) {
          throw new Error('Product not found');
        }

        if (isMounted) {
          setProduct(productData);
          setSelectedImage(productData.images?.[0] || '');
          setQuantity(productData.stock > 0 ? 1 : 0);
        }
      } catch (err) {
        if (!isMounted) return;

        const axiosError = err as AxiosError<{ message?: string }>;
        const message = axiosError.response?.data?.message || axiosError.message || 'Unable to load product.';
        setError(message);
        setProduct(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const handleQuantityChange = (newQuantity: number) => {
    if (!product || product.stock < 1) return;
    const safeQuantity = Math.max(1, Math.min(newQuantity, product.stock));
    setQuantity(safeQuantity);
  };

  const handleAddToCart = () => {
    if (!product || product.stock < 1 || quantity < 1) {
      return;
    }

    const existingQuantity = getItemQuantity(product._id);

    if (existingQuantity === 0) {
      addItem({
        id: product._id,
        brand: product.brand,
        modelName: product.modelName,
        price: product.price,
        discountPrice: product.discountPrice,
        image: product.images?.[0] || '',
        stock: product.stock,
      });
    }

    const desiredQuantity = Math.min(existingQuantity + quantity, product.stock);
    updateQuantity(product._id, desiredQuantity);

    console.log(`Added product ${product._id} to cart with quantity ${quantity}`);
  };

  const handleBuyNow = () => {
    if (!product || product.stock < 1) {
      return;
    }

    handleAddToCart();
    router.push('/checkout');
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center bg-black/5 p-8 text-center">
          <div className="space-y-4 text-gray-500">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
            <p className="font-body text-lg tracking-wide text-gray-600">Elevating your experience...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center bg-black/5 p-10 text-center">
          <h2 className="font-heading text-2xl font-semibold uppercase tracking-[0.2em] text-gray-500">Luxury Watches</h2>
          <p className="mt-4 max-w-xl font-body text-base text-gray-600">{error}</p>
        </div>
      );
    }

    if (!product) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center bg-black/5 p-10 text-center">
          <h2 className="font-heading text-2xl font-semibold uppercase tracking-[0.2em] text-gray-500">Product Unavailable</h2>
          <p className="mt-4 max-w-xl font-body text-base text-gray-600">
            The timepiece you are looking for is currently unavailable. Please explore our curated collection for more exceptional watches.
          </p>
        </div>
      );
    }

    const isOutOfStock = product.stock < 1;
    const specs: Record<ProductSpecKey, string | undefined> = {
      movement: product.movement,
      caseSize: product.caseSize,
      waterResistance: product.waterResistance,
    };

    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl shadow-black/10">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={`${product.brand} ${product.modelName}`}
                  width={900}
                  height={900}
                  className="h-full w-full object-cover"
                  priority
                />
              ) : (
                <div className="flex aspect-square items-center justify-center bg-linear-to-br from-gray-100 via-white to-gray-200">
                  <span className="font-heading text-lg uppercase tracking-[0.3em] text-gray-500">No Image</span>
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="mt-6 grid grid-cols-4 gap-4 md:grid-cols-5">
                {product.images.map((imageUrl, index) => (
                  <button
                    key={imageUrl + index}
                    type="button"
                    onClick={() => setSelectedImage(imageUrl)}
                    className={`group relative overflow-hidden rounded-2xl border-2 transition-all ${
                      selectedImage === imageUrl ? 'border-black shadow-lg' : 'border-transparent bg-white hover:border-black/40'
                    }`}
                  >
                    <Image
                      src={imageUrl}
                      alt={`${product.brand} thumbnail ${index + 1}`}
                      width={160}
                      height={160}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <p className="font-body text-sm uppercase tracking-[0.5em] text-gray-500">{product.brand}</p>
              <h1 className="font-heading text-4xl font-semibold tracking-tight text-black sm:text-5xl">
                {product.modelName}
              </h1>
              <div className="flex items-end gap-4">
                <p className="font-heading text-3xl font-semibold text-black">
                  {formatCurrency(product.discountPrice ?? product.price)}
                </p>
                {product.discountPrice && (
                  <p className="font-body text-base text-gray-500 line-through">
                    {formatCurrency(product.price)}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="font-heading text-lg font-semibold uppercase tracking-[0.3em] text-gray-500">Description</h2>
                <p className="font-body text-base leading-relaxed text-gray-700">
                  {product.description || 'An exquisite timepiece crafted for connoisseurs who appreciate precision and timeless design.'}
                </p>
              </div>

              <div>
                <h3 className="font-heading text-lg font-semibold uppercase tracking-[0.3em] text-gray-500">Key Specifications</h3>
                <dl className="mt-4 grid grid-cols-1 gap-4 text-sm text-gray-700 sm:grid-cols-3">
                  {Object.entries(specs).map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                      <dt className="font-heading text-xs uppercase tracking-[0.4em] text-gray-400">
                        {label.replace(/([A-Z])/g, ' $1').trim()}
                      </dt>
                      <dd className="mt-2 font-body text-base text-black">
                        {value || 'N/A'}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium uppercase tracking-[0.3em] ${
                  isOutOfStock ? 'bg-gray-200 text-gray-600' : 'bg-black text-white'
                }`}>
                  {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                </span>
                <span className="font-body text-sm text-gray-500">
                  {isOutOfStock ? 'This piece is currently unavailable.' : `${product.stock} piece${product.stock === 1 ? '' : 's'} available.`}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-full border border-black/10 bg-white">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="h-12 w-12 text-2xl font-bold text-gray-500 transition hover:text-black disabled:cursor-not-allowed disabled:text-gray-300"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-heading text-lg">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={isOutOfStock || quantity >= product.stock}
                    className="h-12 w-12 text-2xl font-bold text-gray-500 transition hover:text-black disabled:cursor-not-allowed disabled:text-gray-300"
                  >
                    +
                  </button>
                </div>
                <span className="font-body text-sm text-gray-500">Select quantity</span>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-black px-8 py-3 font-heading text-sm uppercase tracking-[0.4em] text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-black px-8 py-3 font-heading text-sm uppercase tracking-[0.4em] text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-300"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-white via-gray-50 to-white">
      <section className="bg-black px-4 py-20 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <p className="font-body text-xs uppercase tracking-[0.6em] text-gray-400">The Heritage Collection</p>
          <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Curated Luxury Timepieces</h1>
          <p className="mx-auto mt-6 max-w-2xl font-body text-base text-gray-300">
            Discover meticulous craftsmanship and timeless elegance in every detail. Each watch is selected for connoisseurs who demand excellence.
          </p>
        </div>
      </section>
      {renderContent()}
    </main>
  );
};

export default ProductDetailsPage;
