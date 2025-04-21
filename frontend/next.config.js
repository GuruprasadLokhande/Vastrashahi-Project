/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'i.ibb.co',
      'lh3.googleusercontent.com',
      'res.cloudinary.com', 
      'shofy-backend.vercel.app', 
      'confluencr.com',
      'storage.googleapis.com',
      'encrypted-tbn0.gstatic.com',
      'encrypted-tbn1.gstatic.com',
      'encrypted-tbn2.gstatic.com',
      'encrypted-tbn3.gstatic.com',
      'i.pinimg.com',
      'images.pexels.com'
    ],
  },
}

module.exports = nextConfig
