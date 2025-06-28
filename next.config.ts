import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
    output: 'export',
      images: {
          unoptimized: true,
            },
              trailingSlash: true,
                  basePath: '/ipo-gmp',
                    assetPrefix: '/ipo-gmp/',
                    };

                    export default nextConfig;
