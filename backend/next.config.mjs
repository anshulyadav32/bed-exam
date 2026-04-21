/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ["@prisma/client", "prisma"],
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "**.openai.com" },
            { protocol: "https", hostname: "**.oaiusercontent.com" }
        ]
    }
};

export default nextConfig;
