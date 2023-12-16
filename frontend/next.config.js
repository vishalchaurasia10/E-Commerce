/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    reactStrictMode: true,
    images: {
        domains: ['localhost','forevertrendin-bucket.s3.ap-south-1.amazonaws.com'],
    },
};
