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
 * @description --- Count **char** in **string** ---
 * @param {string} string
 * @param {string} char
 */
export const getCharCountFromString = (string = "", char) => {
	return string.split(char).length - 1;
};

/**
 * @description --- Get DNA Sequence Primer ---
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
 * @description --- Calculates sequence (for each character) and returns the modified string ---
 * @param {string} seq
 * @returns {string} string
 */
export const calculateSequencing = (seq) =>
	seq
		.split("")
		.map((char) => getSequenceCharacter(char))
		.join("");

/**
 * @description --- Get Sequence char color ---
 * @param {string} char
 * @returns {string} color i.e. HEX
 */
export const getSequenceCharColor = (char) => {
	switch (char) {
		case "T":
			return "#d20000";
		case "A":
			return "#0200ad";
		case "G":
			return "#4a9026";
		default:
			return "#000";
	}
};

/**
 * @description --- Returns colored sequence characters (<Text> element) ---
 * @param {string} sequence
 * @param {(char: string, idx: number) => JSX.Element} mapCharacterWithColor
 * @param {boolean} isReverse
 */
export const getSequencingColorCharacters = (sequence, mapCharacterWithColor, isReverse = false) => {
	return (isReverse ? reverseString(sequence) : sequence)
		.split("")
		.map((char) => getSequenceCharacter(char))
		.map(mapCharacterWithColor);
};

/**
 * @description --- Reverses String ---
 * @param {string} str
 * @returns {string} string
 */
export const reverseString = (str) =>
	str.split("").reduce((a, b) => b + a) + "";

/**
 * @description --- Returns sequence with terminal 5' or 3' characters ---
 * @param {'forward' | 'reverse' | 'complement'} primerType
 * @param {string} sequence
 */
export const getSequenceWithTerminals = (primerType, sequence) => {
	switch (primerType) {
		case "complement":
			return `3'${sequence}5'`;
			case "forward":
			case "reverse":
			return `5'${sequence}3'`;
		default:
			return sequence;
	}
};
