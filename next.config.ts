import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [], // tambahkan domain jika menggunakan external images
    unoptimized: false, // set true jika ada masalah optimisasi
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*", // Ganti dengan URL backend kamu
      },
    ];
  },
};

export default nextConfig;