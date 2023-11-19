/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const withTM = require('next-transpile-modules')(); // pass the modules you would like to see transpiled
const compose = require('next-compose');
import('next').NextConfig;

const nextConfig = {
  //useFileSystemPublicRoutes: false,
  distDir: 'build',
  output: 'export',
};
module.exports = compose([
  [withBundleAnalyzer][withTM],
  {
    poweredByHeader: false,
    trailingSlash: true,
    swcMinify: true,
    basePath: '',
    reactStrictMode: true,
    // distDir: 'out',
    // experimental: { esmExternals: true },
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          fs: false,
          stream: false,
          path: false,
          worker_threads: false,
          crypto: require.resolve('crypto-browserify'),
          os: false,
          // below for rainbow kit
          tls: false,
          net: false,
        };

        // Use the client static directory in the server bundle and prod mode
        // Fixes `Error occurred prerendering page "/"`
        // config.output.webassemblyModuleFilename =
        //   isServer && !dev
        //     ? '../static/wasm/[modulehash].wasm'
        //     : 'static/wasm/[modulehash].wasm';

        // /https://github.com/ethers-io/ethers.js/issues/998
        config.resolve.alias.https = 'https-browserify';
        config.resolve.alias.http = 'http-browserify';
        config.experiments = {
          ...config.experiments,
          asyncWebAssembly: true,
        };
        // config.distDir = 'build';
        // config.output = 'export';
      }

      return config;
    },
  },
]);
