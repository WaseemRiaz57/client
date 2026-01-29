'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const Filters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [movement, setMovement] = useState(searchParams.get('movement') || '');
  const [condition, setCondition] = useState(searchParams.get('condition') || '');

  const brands = [
    'Rolex',
    'Omega',
    'Patek Philippe',
    'Audemars Piguet',
    'Cartier',
    'TAG Heuer',
    'Breitling',
    'IWC',
  ];

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (brand) params.set('brand', brand);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (movement) params.set('movement', movement);
    if (condition) params.set('condition', condition);

    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setBrand('');
    setMinPrice('');
    setMaxPrice('');
    setMovement('');
    setCondition('');
    router.push('/products');
  };

  return (
    <div className="sticky top-4 rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-6 font-heading text-2xl font-bold text-primary">Filters</h2>

      {/* Brand */}
      <div className="mb-6">
        <label className="mb-3 block font-body text-sm font-semibold uppercase tracking-wider text-gray-700">
          Brand
        </label>
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full border border-gray-300 bg-white px-4 py-2.5 font-body text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="mb-3 block font-body text-sm font-semibold uppercase tracking-wider text-gray-700">
          Price Range
        </label>
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min="0"
            className="w-full border border-gray-300 bg-white px-4 py-2.5 font-body text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min="0"
            className="w-full border border-gray-300 bg-white px-4 py-2.5 font-body text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Movement */}
      <div className="mb-6">
        <label className="mb-3 block font-body text-sm font-semibold uppercase tracking-wider text-gray-700">
          Movement
        </label>
        <select
          value={movement}
          onChange={(e) => setMovement(e.target.value)}
          className="w-full border border-gray-300 bg-white px-4 py-2.5 font-body text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">All Movements</option>
          <option value="automatic">Automatic</option>
          <option value="quartz">Quartz</option>
        </select>
      </div>

      {/* Condition */}
      <div className="mb-6">
        <label className="mb-3 block font-body text-sm font-semibold uppercase tracking-wider text-gray-700">
          Condition
        </label>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full border border-gray-300 bg-white px-4 py-2.5 font-body text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">All Conditions</option>
          <option value="new">New</option>
          <option value="pre-owned">Pre-owned</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={applyFilters}
          className="w-full bg-primary py-3 font-body text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-gray-800"
        >
          Apply Filters
        </button>
        <button
          onClick={clearFilters}
          className="w-full border border-gray-300 bg-white py-3 font-body text-sm font-bold uppercase tracking-wider text-gray-700 transition-all duration-300 hover:bg-gray-50"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default Filters;
