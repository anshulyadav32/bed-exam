import path from "node:path";
import { fileURLToPath } from "node:url";
import { withAmplifyAdapter } from "@aws-amplify/adapter-nextjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
    outputFileTracingRoot: path.join(__dirname, ".."),
    serverExternalPackages: ["@prisma/client", "prisma"],
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "**.openai.com" },
            { protocol: "https", hostname: "**.oaiusercontent.com" }
        ]
    }
};

export default withAmplifyAdapter(nextConfig);
