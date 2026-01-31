/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ 1. Sirf TypeScript errors ko ignore karein (ESLint yahan se hata diya hai)
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ 2. Images configuration
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },

  // ✅ 3. Production Backend URL (Rewrites)
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://luxewatch-backend.onrender.com';
    return [
      { source: '/uploads/:path*', destination: `${backendUrl}/uploads/:path*` },
      { source: '/api/:path*', destination: `${backendUrl}/api/:path*` },
    ];
  },
};

export default nextConfig;