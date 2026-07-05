import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // El repo tiene otro lockfile en la raíz; fijamos este proyecto como raíz
  // de tracing para que Next no infiera mal el workspace.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
