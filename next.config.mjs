import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sibling projects share the parent folder, so pin tracing to this app.
  // Must be an absolute path on every platform (Windows dev, Linux CI).
  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
};

export default nextConfig;
