// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };
// import type { NextConfig } from "next";
import withPWA from 'next-pwa'
// import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// async function setup() {
//   if (process.env.NODE_ENV === 'development') {
//     await setupDevPlatform()
//   }
// }
// @ts-expect-error "ignore the error"
import {runtimeCaching} from 'next-pwa/cache'

// setup()
export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching
  // disable: process.env.NODE_ENV === 'development',
})({});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.REPOSITORY_NAME,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;