// TYPES
/**
 * @typedef PrimerDetail
 * @property {number} AT
 * @property {number} GC
 * @property {number} TM
 */
// TYPES

/**
 * @param {string} sequence
 * @param {number} GC_CONSTANT
 * @returns {PrimerDetail} primerDetail
 */
export const calculatePrimerValues = (sequence, GC_CONSTANT = 4) => {
	const AT =
		getCharCountFromString(sequence, "A") +
		getCharCountFromString(sequence, "T");
	const GC =
		getCharCountFromString(sequence, "G") +
		getCharCountFromString(sequence, "C");
	return { AT, GC, TM: GC_CONSTANT * GC + 2 * AT };
};

/**
 * --- Count **char** in **string** ---
 * @param {string} string
 * @param {string} char
 */
export const getCharCountFromString = (string = "", char) => {
	return string.split(char).length - 1;
};

/**
 * --- Get DNA Sequence Primer ---
 * @param {string} char
 * @returns {string} string
 */
export const getSequenceCharacter = (char) => {
	switch (char) {
		case "A":
			return "T";
		case "T":
			return "A";
		case "C":
			return "G";
		case "G":
			return "C";
		default:
			return char;
	}
};

/**
 * -- Reverses String ---
 * @param {string} str
 * @returns {string} string
 */
export const reverseString = (str) => str.split("").reduce((a, b) => b + a) + "";

/**
 * @param {'forward' | 'reverse'} primerType
 * @param {string} sequence
 */
export const getSequenceWithTerminals = (primerType, sequence) => {
	switch (primerType) {
		case "forward":
			return `5'${sequence}3'`;
		case "reverse":
			return `3'${sequence}5'`;
		default:
			return;
	}
};
