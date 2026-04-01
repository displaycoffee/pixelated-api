/* Check if environment variables are available */
const requiredEnvs = ['API_URL', 'ANSWERS'] as const;

for (const env of requiredEnvs) {
	if (!process.env[env]) {
		console.error(`❌ Missing required environment variable: ${env}`);
		process.exit(1); // Stop the app immediately
	}
}

/* Attempt to parse answers */
let parsedAnswers = {};
try {
	parsedAnswers = JSON.parse(process.env.ANSWERS!);
} catch (e) {
	console.error('❌ ANSWERS is not valid JSON. Check your .env.answers file.');
	process.exit(1);
}

/* This config contains variables to use through application */
export const variables = {
	answers: parsedAnswers as AnswersType,
	environment: process.env.NODE_ENV as 'development' | 'production',
	port: parseInt(process.env.PORT!, 10) as number,
	url: process.env.API_URL! as string,
};
