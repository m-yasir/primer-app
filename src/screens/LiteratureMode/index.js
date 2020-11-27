import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { Layout } from "react-native-ui-kitten";
import { WrapComponentWithKittenProvider } from "../../utils/theming";
import { useNavigation } from "react-navigation-hooks";

const useStyles = () => ({
	container: {
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
	},
	button: {
		borderColor: "darkblue",
    borderWidth: 2,
		margin: 10,
	},
});

const LiteratureMode = () => {
	const nav = useNavigation();
	const navigateToLiterature = (name) => () => {
		switch (name) {
			case "primer":
				nav.navigate("PrimerLiterature", {
					headerTitle: "Primer Design",
				});
				break;
			case "insilico":
				nav.navigate("InsilicoPCRLiterature", {
					headerTitle: "InsilicoPCR",
				});
				break;
			case "thermocycler":
				nav.navigate("LMThermocyclerReaction", {
					headerTitle: "Thermocycler Reaction",
				});
				break;
		}
	};
	const styles = useStyles();
	return (
		<Layout style={styles.container}>
			<Layout>
				<TouchableOpacity
					style={[styles.button]}
					activeOpacity={0.5}
					appearance="outline"
					onPress={navigateToLiterature("primer")}
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
			</Layout>
			<Layout>
				<TouchableOpacity
					style={[styles.button]}
					activeOpacity={0.5}
					appearance="outline"
					onPress={navigateToLiterature("insilico")}
					status="primary"
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
			<Layout>
				<TouchableOpacity
					style={[styles.button]}
					activeOpacity={0.5}
					appearance="outline"
					onPress={navigateToLiterature("thermocycler")}
					status="primary"
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
	);
};

const LiteratureModeContainer = WrapComponentWithKittenProvider(LiteratureMode);

LiteratureModeContainer.navigationOptions = () => {
	return {
		title: "Literature Mode",
		headerStyle: {
			backgroundColor: "#319ede",
		},
		headerTitleStyle: {
			fontWeight: "bold",
			color: "#fff",
		},
		headerTintColor: "#fff",
	};
};

export default LiteratureModeContainer;
