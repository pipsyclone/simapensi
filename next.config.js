/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: [process.env.NEXTAUTH_URL],
	},
};

module.exports = nextConfig;
