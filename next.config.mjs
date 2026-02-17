import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
export default {
	reactStrictMode: false,
	transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
	webpack: (config, { isServer }) => {
		// Ensure React is properly resolved for all packages
		config.resolve.alias = {
			...config.resolve.alias,
			'react': path.resolve(__dirname, 'node_modules/react'),
			'react-dom': path.resolve(__dirname, 'node_modules/react-dom')
		};
		return config;
	}
}
