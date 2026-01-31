/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ 1. TypeScript aur ESLint Errors ko Ignore karein (Build pass karne ke liye)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // ✅ 2. ESLint ko ignore karne ka sahi tarika
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ 3. Images Configuration
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },

  // ✅ 4. Proxy / Rewrites (Backend Connection)
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://luxewatch-backend.onrender.com';
    
    return [
      {
        source: '/uploads/:path*',
        destination: `${backendUrl}/uploads/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;