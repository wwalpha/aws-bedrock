const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
})

const withPWA = require("next-pwa")({
  dest: "public",
  // Avoid running Workbox in dev (webpack --watch) to prevent repeated GenerateSW warnings
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true
})

module.exports = withBundleAnalyzer(
  withPWA({
    // Disable strict mode during development to avoid double-invocation and speed up dev
    reactStrictMode: process.env.NODE_ENV === "production",
    images: {
      remotePatterns: [
        {
          protocol: "http",
          hostname: "localhost"
        },
        {
          protocol: "http",
          hostname: "127.0.0.1"
        },
        {
          protocol: "https",
          hostname: "**"
        }
      ]
    },
    serverExternalPackages: ["sharp", "onnxruntime-node"]
  })
)
