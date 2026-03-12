import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lpgqcleszdlldneiwgep.supabase.co",
      },
    ],
  },
};

export default nextConfig;
