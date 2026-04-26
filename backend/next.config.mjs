import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    outputFileTracingRoot: path.join(__dirname, ".."),
    serverExternalPackages: ["@prisma/client", "prisma"],
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "**.openai.com" },
            { protocol: "https", hostname: "**.oaiusercontent.com" }
        ]
    },
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    { key: "X-Content-Type-Options",       value: "nosniff" },
                    { key: "X-Frame-Options",               value: "DENY" },
                    { key: "Content-Security-Policy",       value: "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'" },
                    { key: "Referrer-Policy",               value: "strict-origin-when-cross-origin" },
                    { key: "X-XSS-Protection",             value: "1; mode=block" },
                    { key: "Permissions-Policy",           value: "camera=(), microphone=(), geolocation=()" },
                    { key: "Cross-Origin-Opener-Policy",   value: "same-origin" },
                    { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
                    { key: "Strict-Transport-Security",    value: "max-age=63072000; includeSubDomains" }
                ]
            }
        ];
    }
};

export default nextConfig;
