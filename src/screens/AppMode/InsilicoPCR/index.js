import React, { useState, useRef } from "react";
import {
	Alert,
	KeyboardAvoidingView,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import { Text, Layout, Input, Button } from "react-native-ui-kitten";
import { WrapComponentWithKittenProvider } from "../../../utils/theming";
import { useNavigation } from "react-navigation-hooks";
import {
	calculateSequencing,
	getSequenceCharColor,
	getSequencingColorCharacters,
	reverseString
} from "../../../utils/util";

/**
 * @typedef InsilicoSequenceIndices
 * @property {number[]} fpIndices
 * @property {number[]} rpIndices
 */

// const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
	container: {
		margin: 10,
		overflow: "scroll",
		// backgroundColor: "#fff",
		// minWidth: width,
		// minHeight: height,
	},
	bold: {
		fontWeight: "bold",
	},
	fieldsContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		margin: 10,
	},
	flexRow: {
		alignItems: "center",
		display: "flex",
		flexDirection: "row",
	},
	fontSize20: {
		fontSize: 20,
	},
	mh5: {
		marginHorizontal: 5,
	},
	initialInputField: {
		alignItems: "center",
		display: "flex",
		marginLeft: 10,
		marginRight: 10,
	},
	resultsContainer: {
		display: "flex",
		flexDirection: "column",
		margin: 20,
	},
	sequenceCharacter: {
		paddingHorizontal: 2,
		paddingVertical: 2,
	},
	sequenceContainer: {
		alignItems: "center",
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "flex-start",
		marginHorizontal: 5,
		marginVertical: 10,
	},
	textHeadingLayout: {
		backgroundColor: "#319ede",
		marginTop: 10,
		marginBottom: 10,
		minWidth: "55%",
		maxWidth: "70%",
		padding: 5,
		paddingRight: 0,
	},
	textHeading: {
		color: "white",
		fontWeight: "bold",
		fontSize: 18,
	},
});

const InsilicoPCR = () => {
	// Nav-hook
	const navigation = useNavigation()
	// Non-states
	/** @type {React.MutableRefObject<{ original: string, forward: string }>} */
	const dnaSequence = useRef(
		(() => {
			const original = navigation.getParam("DNA");
			const forward = calculateSequencing(original);
			return {
				original,
				forward,
				// reverse: reverseString(forward),
			};
		})()
	);
	// Component States
	/**
	 * @type {[string | undefined, React.Dispatch<string>]}
	 */
	const [userFP, setUserFP] = useState("");
	/**
	 * @type {[string | undefined, React.Dispatch<string>]}
	 */
	const [userRP, setUserRP] = useState("");
	/**
	 * @type {[InsilicoSequenceIndices | undefined, React.Dispatch<InsilicoSequenceIndices>]}
	 */
	const [sequenceIndices, setSequenceIndices] = useState(null);
	/**
	 * @type {[ScrollView | undefined, React.Dispatch<ScrollView>]}
	 */
	const [scrollViewRef, setScrollViewRef] = useState();

	const highlightText = (start, end) => (text, idx) => {
		return React.cloneElement(text, {
			style: text.props.style.concat(
				idx >= start && idx <= end ? { backgroundColor: "yellow" } : {}
			),
		});
	};
	
	/**
	 * 
	 * @param {(value: string) => void} setValue
	 * @returns {(value: string) => void}
	 */
	const setIndices = (setValue) => (value) => {
		setSequenceIndices(null);
		setValue(value);
	}

	/**
	 *
	 * @param {string} sequence
	 * @param {string} subsequence
	 */
	const getBpIndices = (sequence, subsequence) => {
		const startIdx = sequence.search(subsequence);
		const endIdx = startIdx !== -1 ? startIdx + subsequence.length - 1 : -1;
		return [startIdx, endIdx];
	};

	/**
	 * @param {string} char
	 * @param {number} idx
	 * @returns {JSX.Element} JSX.Element
	 */
	const mapCharacterWithColor = (char, idx) => (
		<Text
			key={idx}
			style={[
				styles.fontSize20,
				styles.sequenceCharacter,
				{ color: getSequenceCharColor(char) },
			]}
		>
			{char}
		</Text>
	);

	const getHighlightedSequence = (sequence, start, end) => {
		let notFound = false;
		if (start === -1) {
			notFound = true;
			Alert.alert("Forward primer not found");
		}
		if (end === -1) {
			notFound = true;
			Alert.alert("Reverse primer not found");
		}
		return notFound
			? sequence.split("").map(mapCharacterWithColor)
			: sequence
					.split("")
					.map(mapCharacterWithColor)
					.map(highlightText(start, end));
	};

	// TODO: For hint use ALERT :D
	/**
	 * Calculates and sets up main sequences and scrolls view to the bottom
	 * @param {React.RefObject<ScrollView>} scrollViewRef
	 * @returns {void} void
	 */
	const setMainSequences = () => {
		if (!userFP || !userRP) {
			Alert.alert(
				"Information",
				"Please enter both reverse and forward primer!"
			);
			return;
		}
		const reverseIndices = getBpIndices(
			reverseString(dnaSequence.current.forward),
			userRP
		)
		/**
		 * Sequence Length
		 * @type {number}
		 */
		const L = dnaSequence.current.forward.length
		/** @type {InsilicoSequenceIndices} */
		const _sequences = {
			fpIndices: getBpIndices(
				dnaSequence.current.original,
				userFP
			),
			rpIndices: [L - reverseIndices[1] - 1, L - reverseIndices[0] - 1],
		};
		setSequenceIndices(_sequences);
		setTimeout(() => {
			scrollViewRef.scrollToEnd({ animated: true });
		});
	};
	/**
	 * 
	 * @param {ScrollView | undefined} ref 
	 */
	const handleScrollViewRef = (ref) => {
		if (ref && !scrollViewRef) {
			setScrollViewRef(ref)
		}
	}

	// TODO: Break into components
	return (
		<KeyboardAvoidingView>
			<ScrollView ref={handleScrollViewRef} style={styles.container}>
				<Layout style={styles.mh5}>
					<View style={styles.sequenceContainer}>
						<Text
							style={[
								styles.fontSize20,
								styles.sequenceCharacter,
							]}
						>
							5'
						</Text>
						{getSequencingColorCharacters(
							dnaSequence.current.original,
							mapCharacterWithColor,
							false
						)}
						<Text
							style={[
								styles.fontSize20,
								styles.sequenceCharacter,
							]}
						>
							3'
						</Text>
					</View>
					<View style={styles.sequenceContainer}>
						<Text
							style={[
								styles.fontSize20,
								styles.sequenceCharacter,
							]}
						>
							3'
						</Text>
						{getSequencingColorCharacters(
							dnaSequence.current.forward,
							mapCharacterWithColor,
							false
						)}
						<Text
							style={[
								styles.fontSize20,
								styles.sequenceCharacter,
							]}
						>
							5'
						</Text>
					</View>
				</Layout>
				<Layout style={styles.mh5}>
					<Layout style={styles.textHeadingLayout}>
						<Text style={styles.textHeading}>
							Sequence for Reverse Primer:
						</Text>
					</Layout>
					<Layout>
						<Input
							style={styles.initialInputField}
							onChangeText={setIndices(setUserFP)}
							placeholder="Enter Sequence.."
						/>
					</Layout>
					<Layout style={styles.textHeadingLayout}>
						<Text style={styles.textHeading}>
							Sequence for Forward Primer:
						</Text>
					</Layout>
					<Layout>
						<Input
							style={styles.initialInputField}
							onChangeText={setIndices(setUserRP)}
							placeholder="Enter Sequence.."
						/>
					</Layout>
					<Button
						style={{
							margin: 10,
						}}
						appearance="outline"
						status="primary"
						onPress={setMainSequences}
					>
						Done
					</Button>
				</Layout>
				{sequenceIndices && (
					<Layout style={styles.mh5}>
						<Layout>
							<Layout style={styles.sequenceContainer}>
								<Text style={styles.fontSize20}>5'</Text>
								{getHighlightedSequence(
									dnaSequence.current.original,
									sequenceIndices.fpIndices[0],
									sequenceIndices.fpIndices[1]
								)}
								<Text style={styles.fontSize20}>3'</Text>
							</Layout>
							<Layout style={styles.sequenceContainer}>
								<Text style={styles.fontSize20}>5'</Text>
								{getHighlightedSequence(
									dnaSequence.current.forward,
									sequenceIndices.rpIndices[0],
									sequenceIndices.rpIndices[1]
								)}
								<Text style={styles.fontSize20}>3'</Text>
							</Layout>
							{/* Product Size */}
							<Layout style={styles.flexRow}>
								<Text style={styles.bold}>Product Size:{" "}</Text>
								<Text>
									{sequenceIndices.fpIndices[0] === -1 ||
									sequenceIndices.rpIndices[1] === -1
										? "Not available"
										: `${
												Math.abs(sequenceIndices.fpIndices[0] -
												sequenceIndices.rpIndices[1])
										  } bp`}
								</Text>
							</Layout>
						</Layout>
					</Layout>
				)}
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

const InsilicoPCRContainer = WrapComponentWithKittenProvider(InsilicoPCR);

InsilicoPCRContainer.navigationOptions = ({ navigation }) => ({
	title: navigation.getParam("headerTitle"),
});

export default InsilicoPCRContainer;
