import React from "react";
import { StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "react-navigation-hooks";

import { Layout, Text, Input } from "react-native-ui-kitten";

import { WrapComponentWithKittenProvider } from "../../utils/theming";

const styles = StyleSheet.create({
	input: {
		marginHorizontal: 4,
	},
	button: {
		marginLeft: 15,
		marginRight: 15,
		borderWidth: 2,
		borderColor: "darkblue",
	},
	navBar: {
		paddingTop: 20,
		paddingBottom: 10,
	},
	contentHeader: {
		marginBottom: 20,
		marginTop: 20,
		textAlign: "center"
	},
	bgImage: {
		width: "100%",
		height: "100%",
	},
	seqReqBtns: {
		width: "40%",
	},
	initialNav: {
		display: "flex",
		flexDirection: "row",
		marginVertical: 10,
	},
	endNav: {
		alignItems: "center",
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
	},
	root: {
		margin: 10,
	},
});

function AppMode() {
	const [dnaSequence, setDnaSequence] = React.useState("");
	const navigation = useNavigation();

	// !IMPORTANT: PI = Primer or InsilicoPCR
	const navigateToDesign = (DNA, design) => () => {
		if (!DNA && design !== "thermocycler") {
			Alert.alert("Error", "Enter DNA Sequence!");
			return;
		}
		switch (design) {
			case "insilico":
				return navigation.navigate("AMInsilcoPCR", {
					DNA: DNA.toUpperCase(),
					headerTitle: "Insilico PCR",
				});
			case "primer":
				return navigation.navigate("AMPrimerDesign", {
					DNA: DNA.toUpperCase(),
					headerTitle: "Primer Design",
				});
			case "thermocycler":
				return navigation.navigate("AMThermocyclerReaction", {
					DNA: DNA.toUpperCase(),
					headerTitle: "Thermocycler Reaction Design",
				});
		}
	};

	return (
		<Layout style={styles.root}>
			<Text
				category="h4"
				style={styles.contentHeader}
				allowFontScaling
			>
				Enter DNA Sequence
			</Text>
			<Layout>
				<Input
					autoCapitalize="characters"
					style={styles.input}
					size="large"
					value={dnaSequence}
					onChangeText={setDnaSequence}
					placeholder="Enter DNA Sequence"
				/>
			</Layout>
			<Layout
				style={{
					overflow: "scroll",
				}}
			>
				<Layout style={styles.initialNav}>
					<TouchableOpacity
						style={[styles.button, styles.seqReqBtns]}
						activeOpacity={0.5}
						appearance="outline"
						onPress={navigateToDesign(dnaSequence, "primer")}
						status="primary"
					>
						<Image
							source={require("./../../../assets/pr_design.jpeg")}
							style={{
								width: 150,
								height: 150,
							}}
							resizeMode="contain"
						/>
					</TouchableOpacity>
					<TouchableOpacity
						appearance="outline"
						onPress={navigateToDesign(dnaSequence, "insilico")}
						status="primary"
						style={[styles.button, styles.seqReqBtns]}
						activeOpacity={0.5}
					>
						<Image
							source={require("./../../../assets/ins_pcr.jpeg")}
							style={{
								width: 150,
								height: 150,
							}}
							resizeMode="contain"
						/>
					</TouchableOpacity>
				</Layout>
				<Layout style={styles.endNav}>
					<TouchableOpacity
						appearance="outline"
						onPress={navigateToDesign(dnaSequence, "thermocycler")}
						status="primary"
						style={[styles.button]}
						activeOpacity={0.5}
					>
						<Image
							source={require("./../../../assets/therm_design.jpg")}
							style={{
								width: 150,
								height: 150,
							}}
							resizeMode="contain"
						/>
					</TouchableOpacity>
				</Layout>
			</Layout>
		</Layout>
	);
}

const AppModeContainer = WrapComponentWithKittenProvider(AppMode);

export default AppModeContainer;
