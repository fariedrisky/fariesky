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
    },
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['*']
    }
  },
  async headers() {
    return [
      {
        source: '/api/visitors/sse',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate'
          },
          {
            key: 'Connection',
            value: 'keep-alive'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          }
        ]
      }
    ];
  }
};

export default config;
