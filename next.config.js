/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  output: 'export',
  basePath: isProd ? '/signup-ux-lab' : '',
  assetPrefix: isProd ? '/signup-ux-lab/' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  distDir: 'out',
  // 정적 파일 경로 설정
  webpack: (config) => {
    if (isProd) {
      config.output.publicPath = '/signup-ux-lab/_next/';
    }
    return config;
  },
}

module.exports = nextConfig