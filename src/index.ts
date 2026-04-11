/* Packages */
import express from 'express';
import cors from 'cors';
import type { Request, Response } from 'express';
import type { RowDataPacket } from 'mysql2';

/* Local scripts */
import { variables } from './_config/scripts/variables';
import { pool } from './_config/scripts/db';

/* Set Express app */
const app = express();

/* Set CORS origin */
app.use(cors({ origin: variables.corsOrigin }));
app.use(express.json());

/* Validate incoming guess */
app.post('/answers', async (request: Request, response: Response) => {
	const { category, subCategory, questionId, guess } = request.body;

	if (!category || !subCategory || !questionId || !guess) {
		return response.status(400).json({ error: 'Missing required fields' });
	}

	try {
		// 1. Look up the answer in the database
		const [rows] = await pool.query<RowDataPacket[]>('SELECT answer FROM answers WHERE category = ? AND sub_category = ? AND question_id = ?', [
			category,
			subCategory,
			questionId,
		]);

		// 2. Handle missing questions gracefully
		if (rows.length === 0) {
			return response.status(404).json({ error: 'Question not found' });
		}

		// 3. Normalize strings (replace & with 'and', strip special characters, trim, lowercase)
		const normalize = (value: string) =>
			value
				.replace(/&/g, 'and')
				.replace(/[^a-z0-9\s]/gi, '')
				.toLowerCase()
				.trim();
		const normalizedGuess = normalize(guess);
		const normalizedAnswer = normalize(rows[0].answer as string);

		// 4. Check for exact match or close match (guess found within answer or vice versa, minimum 4 characters)
		const isMatch = normalizedGuess === normalizedAnswer;
		const isClose =
			!isMatch && normalizedGuess.length >= 4 && (normalizedAnswer.includes(normalizedGuess) || normalizedGuess.includes(normalizedAnswer));

		// 5. Set up message
		let message = 'Try again!';
		if (isMatch) {
			message = 'Correct!';
		} else if (isClose) {
			message = 'Close!';
		}

		// 6. Send back success and message
		response.json({
			success: isMatch,
			close: isClose,
			message: message,
		});
	} catch (error) {
		console.error('❌ /answers error:', error);
		response.status(500).json({ error: 'Internal server error' });
	}
});

/* Get hint for question */
app.post('/hints', async (request: Request, response: Response) => {
	const { category, subCategory, questionId, hintId } = request.body;

	if (!category || !subCategory || !questionId || !hintId) {
		return response.status(400).json({ error: 'Missing required fields' });
	}

	try {
		// 1. Look up the hint in the database
		const [rows] = await pool.query<RowDataPacket[]>(
			'SELECT hint FROM hints WHERE category = ? AND sub_category = ? AND question_id = ? AND hint_id = ?',
			[category, subCategory, questionId, hintId],
		);

		// 2. Handle missing hint gracefully
		if (rows.length === 0) {
			return response.status(404).json({ error: 'Hint not found' });
		}

		// 3. Send back hint
		response.json({
			message: rows[0].hint as string,
		});
	} catch (error) {
		console.error('❌ /hints error:', error);
		response.status(500).json({ error: 'Internal server error' });
	}
});

/* HEY! LISTEN!! */
app.listen(variables.port, () => {
	console.log(`🏃 Running in ${variables.environment} mode`);
	console.log(`⚡️ Server is running at ${variables.url}`);
});
