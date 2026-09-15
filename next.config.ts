import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Consolidate the deployment domain onto the canonical host.
      {
        source: "/:path*",
        has: [{ type: "host", value: "pg-quiz-app.vercel.app" }],
        destination: "https://quiz.ckautoflow.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
