/* Packages */
import dotenv from 'dotenv';
dotenv.config();

/* Check if environment variables are available */
const requiredEnvs = ['API_URL', 'CORS_ORIGIN', 'DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'] as const;

for (const env of requiredEnvs) {
	if (!process.env[env]) {
		console.error(`❌ Missing required environment variable: ${env}`);
		process.exit(1); // Stop the app immediately
	}
}

/* This config contains variables to use through application */
export const variables = {
	db: {
		host: process.env.DB_HOST! as string,
		port: parseInt(process.env.DB_PORT!, 10) as number,
		user: process.env.DB_USER! as string,
		password: process.env.DB_PASSWORD! as string,
		name: process.env.DB_NAME! as string,
	},
	corsOrigin: process.env.CORS_ORIGIN! as string,
	environment: process.env.NODE_ENV as 'development' | 'production',
	port: parseInt(process.env.PORT!, 10) as number,
	url: process.env.API_URL! as string,
};
