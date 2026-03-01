import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  devIndicators: false,
  images: {
    domains: [
      'https://hnjluneoewtutbdmwnon.storage.supabase.co',
      'https://hnjluneoewtutbdmwnon.supabase.co',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hnjluneoewtutbdmwnon.storage.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hnjluneoewtutbdmwnon.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;