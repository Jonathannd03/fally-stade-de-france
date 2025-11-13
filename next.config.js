const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn-images.dzcdn.net'],
  },
};

module.exports = withNextIntl(nextConfig);
