/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nnozdpexhclustqdgdwh.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    domains: [
      "nnozdpexhclustqdgdwh.supabase.co",
      "buergerbeteiligung.rellingen.de",
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
