/* Type definitions */
type Answers = {
	[key: string]: string;
};

declare global {
	/* Declare global types */
	type AnswersType = Answers;
}

/* Export global types */
export {};
