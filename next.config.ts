import type { NextConfig } from "next";

const isEdgeOneStatic = process.env.EDGEONE_STATIC === "1";

const nextConfig: NextConfig = {
  ...(isEdgeOneStatic ? {
    output: "export",
    images: { unoptimized: true },
    trailingSlash: true,
  } : {}),
};

export default nextConfig;
