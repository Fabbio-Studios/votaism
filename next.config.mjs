/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'resultados.tse.jus.br',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'divulgacandcontas.tse.jus.br',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
