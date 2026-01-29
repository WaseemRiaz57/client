import ProductCard from './ProductCard';
import Filters from './Filters';

interface Product {
  _id: string;
  modelName: string;
  brand: string;
  price: number;
  images: string[];
  condition: string;
  movement: string;
  avgRating?: number;
  stock: number;
}

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1">
          <Filters />
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="mt-4 font-heading text-2xl font-semibold text-gray-700">
                  No products found
                </h3>
                <p className="mt-2 font-body text-gray-500">
                  Try adjusting your filters to see more results
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-6">
                <p className="font-body text-sm text-gray-600">
                  Showing <span className="font-semibold">{products.length}</span>{' '}
                  {products.length === 1 ? 'product' : 'products'}
                </p>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductGrid;
