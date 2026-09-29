/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ['10.2.0.2'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'mangadex.org',
                port: '',
                pathname: '/covers/**',
                search: '',
            }
        ]
    }
};

export default nextConfig;
