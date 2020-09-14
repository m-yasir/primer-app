import React, { useState, useRef } from "react";
import {
	StyleSheet,
	Alert,
	Keyboard,
	ScrollView,
	KeyboardAvoidingView,
} from "react-native";
import { Text, Layout, Input, Button } from "react-native-ui-kitten";
import { WrapComponentWithKittenProvider } from "../../../utils/theming";
import { useNavigation } from "react-navigation-hooks";
import { useMount } from "../../../utils/appUtil";
import {
	getSequenceWithTerminals,
	getSequenceCharacter,
	calculatePrimerValues,
	reverseString,
	calculateSequencing, getSequenceCharColor, getSequencingColorCharacters
} from "../../../utils/util";
/**
 * @typedef PrimerDetail
 * @property {number} AT
 * @property {number} GC
 * @property {number} TM
 * @property {string} total
 */

/**
 * @typedef PrimerCalculation
 * @property {PrimerDetail} fwdDetails
 * @property {PrimerDetail} revDetails
 */

const styles = StyleSheet.create({
	container: {
		margin: 20,
		overflow: "scroll",
	},
	fieldsContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		margin: 10,
	},
	fontSize20: {
		fontSize: 20,
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
	textHeadingLayout: {
		backgroundColor: "#319ede",
		marginTop: 10,
		width: "55%",
		padding: 5,
		paddingRight: 0,
	},
	textHeading: {
		color: "white",
		fontWeight: "bold",
		fontSize: 18,
	},
});

const PrimerDesign = () => {
	// Non-states
	const isForward = useRef(true);
	// Component States
	const navigation = useNavigation();
	const [dnaSequence, setDnaSequence] = useState("");
	const [forwardPrimer, setForwardPrimer] = useState("");
	const [reversePrimer, setReversePrimer] = useState("");
	/**
	 * @type {[PrimerCalculation | null, React.Dispatch<PrimerCalculation>]}
	 */
	const [calculation, setCalculation] = useState(null);
	const [sequenceTerminals, setSequenceTerminals] = useState({
		initial: "",
		end: "",
	});
	const [formValues, setFormValues] = useState({
		fwStart: "1",
		fwEnd: null,
		revStart: "-1",
		revEnd: null,
	});

	useMount(() => {
		isForward.current = true;
		setDnaSequence(navigation.getParam("DNA") || "");
	});
	
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

	/**
	 * @param {number} fwStart
	 * @param {number} fwEnd
	 * @param {number} revStart
	 * @param {number} revEnd
	 * @returns{() => void}
	 */
	const calculateValues = (fwStart, fwEnd, revStart, revEnd) => () => {
		Keyboard.dismiss();
		--fwStart;
		if (fwEnd <= fwStart || fwEnd > dnaSequence.length || fwEnd > 30) {
			Alert.alert("Error", "Invalid Forward Primer Range!");
			return;
		}
		if (
			revStart >= 0 ||
			revEnd >= 0 ||
			revStart <= revEnd ||
			revEnd < -dnaSequence.length
		) {
			Alert.alert("Error", "Invalid Reverse Primer Range!");
			return;
		}
		const slicedSequence = dnaSequence.slice(fwStart, fwEnd + 1);
		const slicedRevSequence = calculateSequencing(
			reverseString(dnaSequence).slice(
				revEnd + dnaSequence.length,
				revStart + dnaSequence.length + 1
			)
		);
		const fwdPrimerDetail = calculatePrimerValues(slicedSequence);
		const revPrimerDetail = calculatePrimerValues(slicedRevSequence);

		// Set Forward and Reverse Primers to display after calc in their respective fields
		setForwardPrimer(getSequenceWithTerminals("forward", slicedSequence));
		setReversePrimer(
			getSequenceWithTerminals("reverse", slicedRevSequence)
		);
		// calculateSequencing(slicedRevSequence)
		// Set `calculation state` for showing them up after values are calculated
		setCalculation({
			// sequence: slicedSequence,
			fwdDetails: {
				AT: fwdPrimerDetail.AT,
				GC: fwdPrimerDetail.GC,
				TM: fwdPrimerDetail.TM,
				total: (
					(fwdPrimerDetail.GC / slicedSequence.length) *
					100
				).toFixed(1),
			},
			revDetails: {
				AT: revPrimerDetail.AT,
				GC: revPrimerDetail.GC,
				TM: revPrimerDetail.TM,
				total: (
					(revPrimerDetail.GC / slicedRevSequence.length) *
					100
				).toFixed(1),
			},
			// complementary: isForward.current
			//   ? null
			//   : calculateSequencing(slicedSequence)
		});
	};;

	const handleInputChange = (key) => (value) => {
		setFormValues({ ...formValues, [key]: value });
	};

	// TODO: Break into components
	return (
		<KeyboardAvoidingView>
			<ScrollView style={styles.container}>
				<Layout style={styles.textHeadingLayout}>
					<Text style={styles.textHeading}>Nucleotide Sequence:</Text>
				</Layout>
				<Text
					style={{
						textAlign: "center",
						display: "flex",
						flexWrap: "wrap",
					}}
				>{` ${getSequencingColorCharacters(dnaSequence, mapCharacterWithColor)}`}</Text>
				<Text style={{ marginTop: 5, marginBottom: 5 }}>
					<Text style={{ fontWeight: "bold" }}>
						Total Nucleotide:
					</Text>
					{` ${dnaSequence.length}`}
				</Text>
				<Layout style={styles.textHeadingLayout}>
					<Text
						style={[
							styles.textHeading,
							{ width: "70%", textAlign: "center" },
						]}
					>
						Forward Primer:
					</Text>
				</Layout>
				<Layout style={styles.fieldsContainer}>
					<Input
						keyboardType="numeric"
						label="Start"
						value={formValues.fwStart}
						disabled
						onChangeText={handleInputChange("fwStart")}
						placeholder="Enter DNA Start"
					/>
					<Input
						keyboardType="numeric"
						label="End"
						value={formValues.fwEnd}
						onChangeText={handleInputChange("fwEnd")}
						placeholder="Enter DNA End"
					/>
				</Layout>
				<Layout style={styles.textHeadingLayout}>
					<Text
						style={[
							styles.textHeading,
							{ width: "70%", textAlign: "center" },
						]}
					>
						Reverse Primer:
					</Text>
				</Layout>
				<Layout style={styles.fieldsContainer}>
					<Input
						keyboardType="numeric"
						label="Start (negative)"
						value={formValues.revStart}
						onChangeText={handleInputChange("revStart")}
						placeholder="Enter DNA Start"
					/>
					<Input
						keyboardType="numeric"
						label="End (negative)"
						value={formValues.revEnd}
						onChangeText={handleInputChange("revEnd")}
						placeholder="Enter DNA End"
					/>
				</Layout>
				<Button
					appearance="outline"
					status="primary"
					onPress={calculateValues(
						parseInt(formValues.fwStart),
						parseInt(formValues.fwEnd),
						parseInt(formValues.revStart),
						parseInt(formValues.revEnd)
					)}
				>
					Calculate
				</Button>
				{calculation && (
					<React.Fragment>
						<Layout style={styles.textHeadingLayout}>
							<Text
								style={{
									...styles.textHeading,
									width: "70%",
									textAlign: "center",
								}}
							>
								Forward Primer:
							</Text>
						</Layout>
						<Layout style={styles.fieldsContainer}>
							<Input
								disabled
								style={{
									minWidth: 200,
								}}
								value={calculation ? forwardPrimer : ""}
							/>
						</Layout>
						<Layout style={styles.resultsContainer}>
							<Text>{`AT: ${calculation.fwdDetails.AT}`}</Text>
							<Text>{`GC: ${calculation.fwdDetails.GC}`}</Text>
							<Text>{`Melting Temperature (TM): ${
								calculation.fwdDetails.TM
							} (${
								calculation.fwdDetails.TM >= 55 &&
								calculation.fwdDetails.TM <= 65
									? "Stable"
									: "Unstable"
							})`}</Text>
							<Text>{`Primer Content: ${calculation.fwdDetails.total}`}</Text>
						</Layout>
						<Layout style={styles.textHeadingLayout}>
							<Text
								style={[
									styles.textHeading,
									{ width: "70%", textAlign: "center" },
								]}
							>
								Reverse Primer:
							</Text>
						</Layout>
						<Layout style={styles.fieldsContainer}>
							<Input
								disabled
								style={{
									minWidth: 200,
								}}
								value={calculation ? reversePrimer : ""}
							/>
						</Layout>
						<Layout style={styles.resultsContainer}>
							<Text>{`AT: ${calculation.revDetails.AT}`}</Text>
							<Text>{`GC: ${calculation.revDetails.GC}`}</Text>
							<Text>{`Melting Temperature (TM): ${
								calculation.revDetails.TM
							} (${
								calculation.revDetails.TM >= 55 &&
								calculation.revDetails.TM <= 65
									? "Stable"
									: "Unstable"
							})`}</Text>
							<Text>{`Primer Content: ${calculation.revDetails.total}`}</Text>
						</Layout>
					</React.Fragment>
				)}
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

const PrimerDesignContainer = WrapComponentWithKittenProvider(PrimerDesign);

PrimerDesignContainer.navigationOptions = ({ navigation }) => ({
	title: navigation.getParam("headerTitle"),
});

export default PrimerDesignContainer;
