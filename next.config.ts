import type { NextConfig } from 'next';

const config: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        // Configure font file handling
        '**/*.{woff,woff2,eot,ttf,otf}': [{
          loader: 'asset',
          options: {
            type: 'asset/resource'
          }
        }]
      }
    }
  }
};

export default config;
