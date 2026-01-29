import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  product: {
    _id: string;
    modelName: string;
    brand: string;
    price: number;
    images: string[];
    condition: string;
    movement: string;
    avgRating?: number;
    stock: number;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link href={`/products/${product._id}`} className="group">
      <div className="overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.modelName}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-body text-gray-400">No Image</span>
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <span className="font-body text-lg font-bold uppercase tracking-wider text-white">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Brand */}
          <p className="mb-1 font-body text-xs uppercase tracking-widest text-gray-500">
            {product.brand}
          </p>

          {/* Name */}
          <h3 className="mb-3 font-heading text-xl font-semibold text-primary line-clamp-2">
            {product.modelName}
          </h3>

          {/* Details */}
          <div className="mb-4 flex items-center gap-4 font-body text-sm text-gray-600">
            <span className="capitalize">{product.condition}</span>
            <span>•</span>
            <span className="capitalize">{product.movement}</span>
          </div>

          {/* Rating */}
          {product.avgRating && product.avgRating > 0 && (
            <div className="mb-3 flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${
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
              <span className="font-body text-sm text-gray-600">
                {product.avgRating.toFixed(1)}
              </span>
            </div>
          )}

          {/* Price */}
          <p className="font-heading text-2xl font-bold text-primary">
            ${product.price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
