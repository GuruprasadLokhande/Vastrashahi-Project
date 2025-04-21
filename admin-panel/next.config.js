/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configure image domains
  images: {
    domains: [
      'via.placeholder.com',
      'example.com',
      'res.cloudinary.com',
      'localhost',
      'vastrashahi.com',
      'images.unsplash.com'
    ],
    unoptimized: true,
  },
  // Specify the port for development server
  // This is not necessary as we can also use -p flag with next dev
  serverRuntimeConfig: {
    port: 5000,
  },
  // Fix routing issue for register page
  async rewrites() {
    return [
      {
        source: '/register',
        destination: '/register',
      },
      {
        source: '/login',
        destination: '/login',
      },
      // API proxy to bypass CORS
      {
        source: '/api/:path*',
        destination: 'http://localhost:7000/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig 