/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next.js 15 uses Turbopack by default in dev mode (optional)
  // experimental: {
  //   turbo: {},
  // },
  experimental: {
    // Enables built-in HTTPS using a self-signed cert.
    // This allows camera access (getUserMedia / html5-qrcode)
    // from Android/iOS on local network (http://192.168.x.x → https://)
    //
    // Run with: npx next dev --experimental-https
    // Then open: https://192.168.29.63:3000 on your phone
    //
    // ⚠️ Android will show "Connection not private" warning —
    //    tap Advanced → Proceed to site. Camera will then work.
    //
    // ❌ Remove this block before deploying to production
    httpsServer: true,
  },
  images: {
    // domains is deprecated in Next.js 15, use remotePatterns only
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dummyimage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig

