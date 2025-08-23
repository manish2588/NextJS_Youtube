import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
     domains: ["i.ytimg.com", "yt3.ggpht.com"],  // allow YouTube thumbnails
  },
};

export default nextConfig;
