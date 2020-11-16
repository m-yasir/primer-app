import React, { useState, useRef } from "react";
import {
	Alert,
	Dimensions,
	Image,
	Keyboard,
	KeyboardAvoidingView,
	ScrollView,
	StyleSheet
} from "react-native";
import { Text, Layout, Input, Button } from "react-native-ui-kitten";
import { WrapComponentWithKittenProvider } from "../../../utils/theming";
import { useNavigation } from "react-navigation-hooks";
import { useMount } from "../../../utils/appUtil";
import { calculatePrimerValues } from "../../../utils/util";

/**
 * IMAGES
 */
const DENATURING = require("../../../../assets/images/denaturing.png");
const ANNEALING1 = require("../../../../assets/images/Annealing1.png");
const ANNEALING2 = require("../../../../assets/images/Annealing2.png");
const EXTENSION = require("../../../../assets/images/Extension.png");

/**
 * DEVICE DETAILS
 */

 const {
	 width
 } = Dimensions.get("screen")

/**
 * { AT: number, GC: number, TM: number }
 */

/**
 * @typedef PrimerDetail
 * @property {number} AT
 * @property {number} GC
 * @property {number} TM
 */

/**
 * @typedef PrimerCalculationProp
 * @property {number} GCContent
 * @property {number} TM
 */

/**
 * @typedef PrimerCalculation
 * @property {PrimerCalculationProp} forward
 * @property {PrimerCalculationProp} reverse
 */

/**
 * @typedef AnnealingTemps
 * @property {number} temp1
 * @property {number} temp2
 */

/**
 * @typedef AnnealProductCalculation
 * @property {number} productSizeExtensionTime
 * @property {AnnealingTemps} annealingTemps
 */

/**
 * @typedef Form
 * @property {number} initial
 * @property {number} subsequent
 * @property {number} annealTime
 * @property {number} productSize
 */
const styles = StyleSheet.create({
	boldFace: {
		fontWeight: "bold",
	},
	container: {
		margin: 10,
		overflow: "scroll",
	},
	fieldsContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginVertical: 10,
	},
	resultsContainer: {
		display: "flex",
		flexDirection: "column",
		margin: 20,
	},
	images: {
		width: width - 100
	},
	textHeadingLayout: {
		backgroundColor: "#319ede",
		marginTop: 10,
		width: "55%",
		padding: 5,
		paddingRight: 0,
	},
	textContent: {
		marginBottom: 2,
	},
	textContentExtra: {
		marginBottom: 10,
	},
	textHeading: {
		color: "white",
		fontWeight: "bold",
		fontSize: 18,
	},
});

const ThermocyclerReaction = () => {
	// Component States
	const navigation = useNavigation();
	const [dnaSequence, setDnaSequence] = useState("");
	/**
	 * @type {[PrimerCalculation | null, React.Dispatch<PrimerCalculation>]}
	 */
	const [calculation, setCalculation] = useState(null);
	/**
	 * @type {[Form | null, React.Dispatch<Form>]}
	 */
	const [formValues, setFormValues] = useState({
		initial: "2",
		subsequent: null,
		annealTime: null,
		productSize: null,
	});
	const [primers, setPrimers] = useState({
		forward: "",
		reverse: "",
	});
	// BEGIN: AFTER calculate states

	/**
	 * @type {[AnnealProductCalculation | null, React.Dispatch<AnnealProductCalculation | null>]}
	 */
	const [annealProductSizeCalc, setAnnealProductSizeCalc] = useState(null);
	// END

	useMount(() => {
		// const sequenceTerminals = { initial: "5'", end: "3'" };
		// if (!isForward.current) {
		//   sequenceTerminals.initial = "3'";
		//   sequenceTerminals.end = "5'";
		// }
		// setSequenceTerminals(sequenceTerminals);
		// setDnaSequence(navigation.getParam("DNA") || "");
		setDnaSequence(navigation.getParam("DNA") || "");
	});

	/**
	 * @param {number} value
	 * @param {number} min
	 * @param {number} max
	 * @returns {boolean}
	 */
	const checkRangeNotIncl = (value, min, max) => value < min || value > max;

	/**
	 * @param {number} initial
	 * @param {number} subsqt
	 * @param {string} forwardPrimer
	 * @param {string} reversePrimer
	 * @returns {() => void}
	 */
	const calculateValues = (
		initial,
		subsqt,
		forwardPrimer,
		reversePrimer
	) => () => {
		Keyboard.dismiss();
		if (checkRangeNotIncl(subsqt, 15, 60)) {
			Alert.alert(
				"Error",
				"The subsequent Denaturation steps will be between 15 and 60 seconds"
			);
			return;
		}
		const fwdVals = calculatePrimerValues(forwardPrimer, 2);
		const revVals = calculatePrimerValues(reversePrimer, 2);
		setCalculation({
			forward: {
				GCContent: (fwdVals.GC / forwardPrimer.length) * 100,
				TM: fwdVals.TM,
			},
			reverse: {
				GCContent: (revVals.GC / reversePrimer.length) * 100,
				TM: revVals.TM,
			},
		});
	};

	/**
	 * @param {number} annealingTime
	 * @param {number} tmForwardPrimer
	 * @param {number} tmReversePrimer
	 * @param {number} productSize
	 * @returns {() => void}
	 */
	const calculateAnnealingProduct = (
		annealingTime,
		tmForwardPrimer,
		tmReversePrimer,
		productSize
	) => () => {
		if (checkRangeNotIncl(annealingTime, 15, 60)) {
			Alert.alert(
				"Error",
				"Annealing time shoiuld be equal to 15 sec or less than or equal to 1 min"
			);
			return;
		}
		if (checkRangeNotIncl(productSize, 500, 5000)) {
			Alert.alert(
				"Error",
				"The product size must greater than or equal to 500kb and less than or equal to 5000kb"
			);
			return;
		}
		setAnnealProductSizeCalc({
			annealingTemps: {
				temp1: tmForwardPrimer - 5,
				temp2: tmReversePrimer - 5,
			},
			productSizeExtensionTime: (productSize / 1000).toFixed(1),
		});
	};

	/**
	 * @param {string} key
	 * @param {(value: string | number | (() => number | string)) => void} setValue
	 * @returns {void} none
	 */
	const handleInputChange = (key, setValue) => (value) => {
		setValue((_values) => ({ ..._values, [key]: value }));
	};

	// TODO: Break into components
	return (
		<KeyboardAvoidingView>
			<ScrollView style={styles.container}>
				<Layout style={styles.textHeadingLayout}>
					<Text style={styles.textHeading}>Denaturation Time:</Text>
				</Layout>
				<Layout style={styles.fieldsContainer}>
					<Input
						disabled
						keyboardType="numeric"
						label="Initial Time"
						onChangeText={handleInputChange(
							"initial",
							setFormValues
						)}
						placeholder="Time"
						style={{
							marginRight: 5,
							width: "48%",
						}}
						value={formValues.initial}
					/>
					<Input
						keyboardType="numeric"
						label="Subsequent Time"
						onChangeText={handleInputChange(
							"subsequent",
							setFormValues
						)}
						placeholder="Time"
						style={{
							marginLeft: 5,
							width: "48%",
						}}
						value={formValues.subsequent}
					/>
				</Layout>
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
						style={{
							minWidth: 200,
						}}
						onChangeText={handleInputChange("forward", setPrimers)}
						value={primers.forward}
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
						style={{
							minWidth: 200,
						}}
						onChangeText={handleInputChange("reverse", setPrimers)}
						value={primers.reverse}
					/>
				</Layout>
				<Button
					appearance="outline"
					status="primary"
					onPress={calculateValues(
						formValues.initial,
						formValues.subsequent,
						primers.forward,
						primers.reverse
					)}
				>
					Calculate
				</Button>
				{calculation && (
					<React.Fragment>
						<Layout style={styles.resultsContainer}>
							<Text style={styles.textContent}>
								<Text
									style={styles.boldFace}
								>{`Initial denaturation time: `}</Text>
								<Text>{`${formValues.initial} seconds`}</Text>
							</Text>
							<Text style={styles.textContentExtra}>
								<Text
									style={styles.boldFace}
								>{`Initial denaturation Temperature: `}</Text>
								<Text>{"95˚c"}</Text>
							</Text>
							<Text style={styles.textContent}>
								<Text
									style={styles.boldFace}
								>{`Subsequent denaturation Temperature: `}</Text>
								<Text>{"95˚c"}</Text>
							</Text>
							<Text style={styles.textContentExtra}>
								<Text
									style={styles.boldFace}
								>{`Subsequent denaturation time: `}</Text>
								<Text>{`${formValues.subsequent} seconds`}</Text>
							</Text>

							<Text style={styles.textContent}>
								<Text
									style={styles.boldFace}
								>{`GC Content Forward Primer: `}</Text>
								<Text>{`${calculation.forward.GCContent}`}</Text>
							</Text>

							<Text style={styles.textContentExtra}>
								<Text
									style={styles.boldFace}
								>{`GC Content Reverse Complementary Primer: `}</Text>
								<Text>{`${calculation.reverse.GCContent}`}</Text>
							</Text>
							<Text style={styles.textContent}>
								<Text
									style={styles.boldFace}
								>{`Melting Temperature (TM) Forward Primer: `}</Text>
								<Text>{`${calculation.forward.TM}`}</Text>
							</Text>
							<Text style={styles.textContentExtra}>
								<Text
									style={styles.boldFace}
								>{`Melting Temperature (TM) Reverse Complementary Primer: `}</Text>
								<Text>{`${calculation.reverse.TM}`}</Text>
							</Text>
							<Image
								source={DENATURING}
								style={styles.images}
								resizeMethod="resize"
								resizeMode="contain"
							/>
							<React.Fragment>
								<Layout style={styles.textHeadingLayout}>
									<Text
										style={{
											...styles.textHeading,
											width: "85%",
											textAlign: "center",
										}}
									>
										Annealing Time:
									</Text>
								</Layout>
								<Layout style={styles.fieldsContainer}>
									<Input
										style={{
											minWidth: 200,
										}}
										onChangeText={handleInputChange(
											"annealTime",
											setFormValues
										)}
										value={formValues.annealTime}
									/>
								</Layout>
							</React.Fragment>
							<React.Fragment>
								<Layout style={styles.textHeadingLayout}>
									<Text
										style={{
											...styles.textHeading,
											width: "100%",
											textAlign: "center",
										}}
									>
										Product Size (in Kb):
									</Text>
								</Layout>
								<Layout style={styles.fieldsContainer}>
									<Input
										style={{
											minWidth: 200,
										}}
										onChangeText={handleInputChange(
											"productSize",
											setFormValues
										)}
										value={formValues.productSize}
									/>
								</Layout>
							</React.Fragment>
							<Button
								appearance="outline"
								status="primary"
								onPress={calculateAnnealingProduct(
									formValues.annealTime,
									calculation.forward.TM,
									calculation.reverse.TM,
									formValues.productSize
								)}
							>
								Submit
							</Button>
							{annealProductSizeCalc && (
								<React.Fragment>
									<Image
										source={ANNEALING1}
										style={styles.images}
										resizeMethod="resize"
										resizeMode="contain"
									/>
									<Text style={styles.textContent}>
										<Text
											style={styles.boldFace}
										>{`Annealing Temperature 1: `}</Text>
										<Text>{`${annealProductSizeCalc.annealingTemps.temp1}`}</Text>
									</Text>
									<Image
										source={ANNEALING2}
										style={styles.images}
										resizeMethod="resize"
										resizeMode="contain"
									/>
									<Text style={styles.textContentExtra}>
										<Text
											style={styles.boldFace}
										>{`Annealing Temperature 2: `}</Text>
										<Text>{`${annealProductSizeCalc.annealingTemps.temp2}`}</Text>
									</Text>
									<Image
										source={EXTENSION}
										style={styles.images}
										resizeMethod="resize"
										resizeMode="contain"
									/>
									<Text style={styles.textContent}>
										<Text
											style={styles.boldFace}
										>{`Extension Time: `}</Text>
										<Text>{`${annealProductSizeCalc.productSizeExtensionTime} minutes`}</Text>
									</Text>
									<Text>
										<Text
											style={styles.boldFace}
										>{`Extension Temperature: `}</Text>
										<Text>{`72˚c - 74˚c`}</Text>
									</Text>
								</React.Fragment>
							)}
						</Layout>
					</React.Fragment>
				)}
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

const ThermocyclerReactionContainer = WrapComponentWithKittenProvider(
	ThermocyclerReaction
);

export default ThermocyclerReactionContainer;
