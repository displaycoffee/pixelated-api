/* Packages */
import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';

/* Local scripts */
import { variables } from './_config/scripts/variables';

/* Set Express app */
const app = express();
app.use(cors());
app.use(express.json());

/* Validate incoming guess */
app.post('/validate', (request: Request, response: Response) => {
	const { questionId, guess } = request.body;

	// 1. Look up the answer in our secret object
	const correctAnswer = variables.answers[questionId];

	// 2. Handle missing questions gracefully
	if (!correctAnswer) {
		return response.status(404).json({ error: 'Question not found' });
	}

	// 3. Normalize strings (remove spaces, ignore casing)
	const isMatch = guess?.toLowerCase().trim() === correctAnswer.toLowerCase().trim();

	// 4. Send back success and message
	response.json({
		success: isMatch,
		message: isMatch ? 'Correct!' : 'Try again!',
	});
});

/* Get hint for question */
app.post('/hints', (request: Request, response: Response) => {
	const { hintId } = request.body;

	// 1. Look up the hint in our secret object
	const hint = variables.hints[hintId];

	// 2. Handle missing hint gracefully
	if (!hint) {
		return response.status(404).json({ error: 'Hint not found' });
	}

	// 3. Send back hint
	response.json({
		message: hint,
	});
});

/* HEY! LISTEN!! */
app.listen(variables.port, () => {
	console.log(`🏃 Running in ${variables.environment} mode`);
	console.log(`⚡️ Server is running at ${variables.url}`);
});
