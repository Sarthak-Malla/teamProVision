/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        MONGODB_URI: process.env.MONGODB_URI,
        // Add other environment variables if needed
      }, 
}

module.exports = nextConfig
