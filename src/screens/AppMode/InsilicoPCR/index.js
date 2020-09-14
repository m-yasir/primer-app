import React, { useState, useRef } from "react";
import {
	StyleSheet,
	Alert,
	Keyboard,
	ScrollView,
	KeyboardAvoidingView,
	Dimensions,
} from "react-native";
import { Text, Layout, Input, Button } from "react-native-ui-kitten";
import { WrapComponentWithKittenProvider } from "../../../utils/theming";
import { useNavigation } from "react-navigation-hooks";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
	container: {
		// margin: 20,
		overflow: "scroll",
		backgroundColor: "#fff",
		minWidth: width,
		minHeight: height,
	},
	fontSize20: {
		fontSize: 20,
	},
	fieldsContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		margin: 10,
	},
	mh5: {
		marginHorizontal: 5,
	},
	initialInputField: {
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
	// Functions needed to be initialized earlier and in order due to usage order.
	const getSequenceCharacter = (char) => {
		switch (char) {
			case "5'":
				return "3'";
			case "3'":
				return "5'";
			case "A":
				return "T";
			case "T":
				return "A";
			case "C":
				return "G";
			case "G":
				return "C";
		}
		return char;
	};

	const calculateSequencing = (seq) =>
		seq
			.split("")
			.map((char) => getSequenceCharacter(char))
			.join("");

	const reverseString = (str) => str.split("").reduce((a, b) => b + a) + "";
	// Nav-hook
	const navigation = useNavigation();
	// Non-states
	const dnaSequence = useRef(
		(() => {
			const original = navigation.getParam("DNA");
			const forward = calculateSequencing(original);
			return {
				original,
				forward,
				reverse: reverseString(forward),
			};
		})()
	);
	// Component States
	const [userFP, setUserFP] = useState("");
	const [userRP, setUserRP] = useState("");
	const [sequences, setSequences] = useState(null);

	// const getCharCountFromString = (string = "", char) => {
	// 	return string.split(char).length - 1;
	// };

	const getSequencingColorCharacters = (sequence, isReverse = false) => {
		return (isReverse ? reverseString(sequence) : sequence)
			.split("")
			.map((char) => getSequenceCharacter(char))
			.map(mapCharacterWithColor);
	};

	const highlightText = (start, end) => (text, idx) => {
		return React.cloneElement(text, {
			style: text.props.style.concat(
				idx >= start && idx <= end ? { backgroundColor: "yellow" } : {}
			),
		});
	};

	const getSequenceCharColor = (char) => {
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
	 *
	 * @param {string} sequence
	 * @param {string} subsequence
	 */
	const getBpIndices = (sequence, subsequence) => {
		const startIdx = sequence.search(subsequence);
		const endIdx = startIdx !== -1 ? startIdx + subsequence.length - 1 : -1;
		return [startIdx, endIdx];
	};

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
		if (start === -1 || end === -1) {
			notFound = true;
			Alert.alert("Forward or reverse primer not found");
		}
		return notFound
			? sequence.split("").map(mapCharacterWithColor)
			: sequence
					.split("")
					.map(mapCharacterWithColor)
					.map(highlightText(start, end));
	};

	// TODO: For hint use ALERT :D
	const setMainSequences = () => {
		if (!userFP || !userRP) {
			Alert.alert(
				"Information",
				"Please enter both reverse and forward primer!"
			);
			return;
		}
		const _sequences = {
			fpIndices: getBpIndices(
				dnaSequence.current.forward,
				calculateSequencing(userFP)
			),
			rpIndices: getBpIndices(
				dnaSequence.current.forward,
				reverseString(calculateSequencing(userRP))
			),
		};
		setSequences(_sequences);
	};

	// TODO: Break into components
	return (
		<KeyboardAvoidingView>
			<ScrollView style={styles.container}>
				<Layout style={styles.mh5}>
					<Layout>
						<Layout style={styles.sequenceContainer}>
							<Text
								style={[
									styles.fontSize20,
									styles.sequenceCharacter,
								]}
							>
								5'
							</Text>
							{getSequencingColorCharacters(
								dnaSequence.current.forward
							)}
							<Text
								style={[
									styles.fontSize20,
									styles.sequenceCharacter,
								]}
							>
								3'
							</Text>
						</Layout>
						<Layout style={styles.sequenceContainer}>
							<Text
								style={[
									styles.fontSize20,
									styles.sequenceCharacter,
								]}
							>
								3'
							</Text>
							{getSequencingColorCharacters(
								dnaSequence.current.reverse
							)}
							<Text
								style={[
									styles.fontSize20,
									styles.sequenceCharacter,
								]}
							>
								5'
							</Text>
						</Layout>
					</Layout>
				</Layout>
				<Layout style={styles.mh5}>
					<Layout>
						<Layout style={styles.textHeadingLayout}>
							<Text style={styles.textHeading}>
								Sequence for Forward Primer:
							</Text>
						</Layout>
						<Input
							style={styles.initialInputField}
							onChangeText={setUserFP}
							placeholder="Enter Sequence.."
						/>
					</Layout>
					<Layout>
						<Layout style={styles.textHeadingLayout}>
							<Text style={styles.textHeading}>
								Sequence for Reverse Primer:
							</Text>
						</Layout>
						<Input
							style={styles.initialInputField}
							onChangeText={setUserRP}
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
				{sequences && (
					<Layout style={styles.mh5}>
						<Layout>
							<Layout style={styles.sequenceContainer}>
								<Text style={styles.fontSize20}>5'</Text>
								{getHighlightedSequence(
									dnaSequence.current.forward,
									sequences.fpIndices[0],
									sequences.fpIndices[1]
								)}
								<Text style={styles.fontSize20}>3'</Text>
							</Layout>
							<Layout style={styles.sequenceContainer}>
								<Text style={styles.fontSize20}>3'</Text>
								{getHighlightedSequence(
									dnaSequence.current.reverse,
									sequences.rpIndices[0],
									sequences.rpIndices[1]
								)}
								<Text style={styles.fontSize20}>5'</Text>
							</Layout>
							{/* Product Size */}
							<Layout>
								<Text>
									Product Size:{" "}
									{sequences.fpIndices[0] === -1 ||
									sequences.rpIndices[1] === -1
										? "Not available"
										: `${
												sequences.rpIndices[1] -
												sequences.fpIndices[0]
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
