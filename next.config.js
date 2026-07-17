/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    unoptimized: true, // Cho phép load ảnh cục bộ hoặc CDN mà không cần tối ưu hóa hình ảnh động của Next.js (tiết kiệm tài nguyên container)
  },
};

module.exports = nextConfig;
