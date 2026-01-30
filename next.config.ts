import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Config options here */

  // ✅ Images Configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },

  // ❌ Turbopack wala hissa hata diya kyunke wo error de raha tha.
  // Turbopack waise bhi 'npm run dev' se khud chal jata hai agar enabled ho.
  
  // ✅ Proxy / Rewrites (Backend Connection)
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:5000/uploads/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
};

export default nextConfig;