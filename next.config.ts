import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/pipeline",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
