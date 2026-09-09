import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sibling projects share the Desktop/claude folder; pin tracing to this app.
  outputFileTracingRoot: path.dirname(new URL(import.meta.url).pathname.slice(1)),
};

export default nextConfig;
