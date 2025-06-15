/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: "loose", // Handle ESM modules more flexibly
  },
  transpilePackages: ["@react-pdf/renderer"],
};

export default nextConfig;
