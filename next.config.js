/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Required for snarkjs and circomlibjs in browser
    config.resolve.fallback = {
      fs:     false,
      path:   false,
      crypto: false,
      stream: false,
    }
    // Handle wasm files for ZK circuits
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    }
    return config
  },
  // Required for large circuit files
  experimental: {
    largePageDataBytes: 256 * 1000,
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key:   'X-Frame-Options',
            value: 'DENY',
          },
          {
            key:   'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key:   'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            // Required for SharedArrayBuffer (snarkjs multithreading)
            key:   'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key:   'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
