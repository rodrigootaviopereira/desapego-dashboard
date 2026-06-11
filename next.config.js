/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  basePath: isProd ? "/desapego-dashboard" : "",
  assetPrefix: isProd ? "/desapego-dashboard/" : "",
};

module.exports = nextConfig;
