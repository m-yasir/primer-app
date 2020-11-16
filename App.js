import React from "react";
import { StyleSheet, Alert, Image, Text, View } from "react-native";
import { createAppContainer } from "react-navigation";
import { useNavigation } from "react-navigation-hooks";

import { Layout, Button } from "react-native-ui-kitten";
import { createStackNavigator } from "react-navigation-stack";
import { WrapComponentWithKittenProvider } from "./src/utils/theming";

import AppMode from "./src/screens/AppMode";
import LiteratureMode from "./src/screens/LiteratureMode";
import AMPrimerDesign from "./src/screens/AppMode/PrimerDesign";
import AMInsilcoPCR from "./src/screens/AppMode/InsilicoPCR";
import AMThermocyclerReaction from "./src/screens/AppMode/ThermocyclerReaction";
import LMInsilicoPCR from "./src/screens/LiteratureMode/InsilicoPCRLiterature";
import LMPrimerDesign from "./src/screens/LiteratureMode/PrimerLiterature";
import LMThermocyclerReaction from "./src/screens/LiteratureMode/ThermocyclerReactionDesign";
import { APP_EXPIRY_DATE } from "./src/utils/constants";
import { author } from "./package.json";

if (new Date() >= APP_EXPIRY_DATE) {
	Alert.alert(
		"IMPORTANT",
		`Expo: App has expired please contact the developer, ${author.name}`,
		[],
		{
			cancelable: false,
			onDismiss: () => {},
		}
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		paddingVertical: 8,
		paddingHorizontal: 4,
	},
	input: {
		flex: 1,
		marginHorizontal: 4,
	},
	button: {
		marginLeft: 15,
		marginRight: 15,
		minWidth: 150,
	},
	navBar: {
		paddingTop: 20,
		paddingBottom: 10,
	},
	contentHeader: {
		marginBottom: 20,
		marginTop: 20,
	},
	bgImage: {
		width: "100%",
		height: "100%",
	},
});

// const bg = require("./../../assets/splash.png");

function MainScreen() {
	const navigation = useNavigation();

	const navigateToScreen = (name) => () => {
		switch (name) {
			case "appmode":
				navigation.navigate("AppMode");
				break;
			case "literature":
				navigation.navigate("LiteratureMode");
				break;
		}
	};
	return (
		<Layout
			style={{
				flex: 1,
				flexDirection: "column",
				margin: 10,
				alignItems: "center",
				justifyContent: "space-between",
			}}
		>
			{/* <ImageBackground
        source={bg}
        style={{
          width: "100%",
          height: "100%",
          flex: 1
        }}
      > */}
			{/* <Text category="h4" style={styles.contentHeader}>
          Enter DNA Sequence
        </Text>
        <Input
          autoCapitalize="characters"
          style={styles.input}
          size="large"
          value={dnaSequence}
          onChangeText={setDnaSequence}
          placeholder="Enter DNA Sequence"
        /> */}
			<Layout
				style={{
					flex: 1,
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "flex-start",
				}}
			>
				<Button
					style={styles.button}
					appearance="outline"
					status="primary"
					onPress={navigateToScreen("literature")}
				>
					Literature Mode
				</Button>
				<Button
					style={styles.button}
					appearance="outline"
					status="primary"
					onPress={navigateToScreen("appmode")}
				>
					Tool Mode
				</Button>
			</Layout>
			{/* </ImageBackground> */}
		</Layout>
	);
}

const MainScreenContainer = WrapComponentWithKittenProvider(MainScreen);

MainScreenContainer.navigationOptions = () => {
	return {
		title: "PRIMeasy",
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

const MainNavigator = createStackNavigator(
	{
		Home: {
			screen: MainScreenContainer,
		},
		AppMode: {
			// TODO: Rename to Tool Mode
			screen: AppMode,
		},
		AMPrimerDesign: {
			screen: AMPrimerDesign,
		},
		AMInsilcoPCR: {
			screen: AMInsilcoPCR,
		},
		AMThermocyclerReaction: {
			screen: AMThermocyclerReaction,
		},
		LiteratureMode: {
			screen: LiteratureMode,
		},
		PrimerLiterature: {
			screen: LMPrimerDesign,
		},
		InsilicoPCRLiterature: {
			screen: LMInsilicoPCR,
		},
		LMThermocyclerReaction: {
			screen: LMThermocyclerReaction,
		},
	},
	{
		defaultNavigationOptions: ({ navigation, navigationOptions }) => ({
			cardStyle: { backgroundColor: "#fff", opacity: 1 },
			headerStyle: { backgroundColor: "#319ede" },
			headerTintColor: "#fff",
			headerTitleAlign: "left",
			headerTitleStyle: { fontWeight: "bold", color: "#fff" },
			headerTitle: () => {
				const headerTitle =
					navigation.getParam("headerTitle") ||
					navigationOptions.title;
				return (
					<View
						style={{
							alignItems: "center",
							display: "flex",
							flexDirection: "row",
							justifyContent: "flex-start",
							marginBottom: 10,
						}}
					>
						<Text
							style={{
								fontSize: 20,
								color: "#FFF",
								fontWeight: "bold",
							}}
						>
							{headerTitle || "PRIMeasy"}
						</Text>
						{!headerTitle && (
							<Image
								resizeMethod="scale"
								resizeMode="contain"
								style={{
									width: 50,
									height: 50,
								}}
								source={require("./assets/logo.png")}
							/>
						)}
					</View>
				);
			},
		}),
	}
	// {
	// 	// transparentCard: true
	// }
);

export default createAppContainer(MainNavigator);
