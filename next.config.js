const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  output: 'export',
  basePath: isProd ? '/signup-ux-lab' : '',
  assetPrefix: isProd ? '/signup-ux-lab/' : '',
  images: {
    unoptimized: true,
  },
}; 