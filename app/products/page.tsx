import ProductGrid from '@/components/ProductGrid';

interface SearchParams {
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  movement?: string;
  condition?: string;
}

async function getProducts(searchParams: SearchParams) {
  try {
    const params = new URLSearchParams();
    
    if (searchParams.brand) params.set('brand', searchParams.brand);
    if (searchParams.minPrice) params.set('minPrice', searchParams.minPrice);
    if (searchParams.maxPrice) params.set('maxPrice', searchParams.maxPrice);
    if (searchParams.movement) params.set('movement', searchParams.movement);
    if (searchParams.condition) params.set('condition', searchParams.condition);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${apiUrl}/products?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.products || [];
  } catch (error: any) {
    console.error('Error fetching products:', error.message || error);
    // Return empty array if backend is not available
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const products = await getProducts(params);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-primary py-16 text-center text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-bold md:text-5xl lg:text-6xl">
            Luxury Watch Collection
          </h1>
          <p className="mt-4 font-body text-lg text-white/90 md:text-xl">
            Discover timepieces that define sophistication
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid products={products} />
    </div>
  );
}
