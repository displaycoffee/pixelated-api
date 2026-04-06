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

console.log('CORS origin:', variables.corsOrigin);

app.use(cors({ origin: variables.corsOrigin }));
app.use(express.json());

/* Validate incoming guess */
app.post('/validate', async (request: Request, response: Response) => {
	const { category, subCategory, questionId, guess } = request.body;

	if (!category || !subCategory || !questionId || !guess) {
		return response.status(400).json({ error: 'Missing required fields' });
	}

	try {
		// 1. Look up the answer in the database
		const [rows] = await pool.query<RowDataPacket[]>(
			'SELECT answer FROM answers WHERE category = ? AND sub_category = ? AND question_id = ?',
			[category, subCategory, questionId],
		);

		// 2. Handle missing questions gracefully
		if (rows.length === 0) {
			return response.status(404).json({ error: 'Question not found' });
		}

		// 3. Normalize strings (remove spaces, ignore casing)
		const correctAnswer = rows[0].answer as string;
		const isMatch = guess?.toLowerCase().trim() === correctAnswer.toLowerCase().trim();

		// 4. Send back success and message
		response.json({
			success: isMatch,
			message: isMatch ? 'Correct!' : 'Try again!',
		});
	} catch (error) {
		console.error('❌ /validate error:', error);
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
