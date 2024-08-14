/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['cdn.freebiesupply.com'],
    },
    async headers() {
        return [
            {
                // matching all API routes
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                ]
            }
        ]
    },
    // Add this section to increase the API timeout
    serverRuntimeConfig: {
        api: {
            bodyParser: {
                sizeLimit: '1mb'
            },
            responseLimit: '8mb',
            externalResolver: true,
            // Set the timeout to 60 seconds (60000 milliseconds)
            // You can adjust this value as needed, up to the maximum allowed by your Vercel plan
            timeout: 60000
        }
    }
};

export default nextConfig;