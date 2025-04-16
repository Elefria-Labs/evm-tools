/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')(); // pass the modules you would like to see transpiled
import('next').NextConfig;

const nextConfig = {
  //useFileSystemPublicRoutes: false,
  output: 'export',
  trailingSlash: false,
  swcMinify: false,
  basePath: '',
  poweredByHeader: false,
  images: { unoptimized: true },
};
module.exports = withPlugins(
  [
    [withBundleAnalyzer],
    [withTM],
    {
      poweredByHeader: false,
      trailingSlash: true,
      swcMinify: true,
      basePath: '',
      reactStrictMode: true,

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
        }
        // config.resolve.alias['@components'] = path.join(__dirname, 'src/components');
        return config;
      },
    },
  ],
  nextConfig,
);
