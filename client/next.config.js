/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'avatar.iran.liara.run',
            port: '',
            pathname: '/public/**',
        }]
    }
}

module.exports = nextConfig
