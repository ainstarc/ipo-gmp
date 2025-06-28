import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/ipo-gmp" : "",
  assetPrefix: isProd ? "/ipo-gmp/" : "",
  images: { unoptimized: true },
};

export default nextConfig;
