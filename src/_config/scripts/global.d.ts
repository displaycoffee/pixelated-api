/* Type definitions */
type Answers = {
	[key: string]: string;
};

type Hints = {
	[key: string]: string;
};

declare global {
	/* Declare global types */
	type AnswersType = Answers;

	type HintsType = Hints;
}

/* Export global types */
export {};
