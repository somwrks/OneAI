/** @type {import('next').NextConfig} */
module.exports = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    return config;
  },
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    LLAMA_API_KEY: process.env.LLAMA_API_KEY,
    CLAUDE_API_KEY: process.env.CLAUDE_API_KEY
  }
}
