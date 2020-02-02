import React from "react";
import { StyleSheet, Alert } from "react-native";
import { createAppContainer } from "react-navigation";
import { useNavigation } from "react-navigation-hooks";

import { Layout, Text, Input, Button } from "react-native-ui-kitten";
import { createStackNavigator } from "react-navigation-stack";
import Primer from "./src/Primer";
import { WrapComponentWithKittenProvider } from "./src/components/utils/theming";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 4
  },
  input: {
    flex: 1,
    marginHorizontal: 4
  },
  button: {
    marginLeft: 15,
    marginRight: 15
  },
  navBar: {
    paddingTop: 20,
    paddingBottom: 10
  },
  contentHeader: {
    marginBottom: 20,
    marginTop: 20
  },
  bgImage: {
    width: "100%",
    height: "100%"
  }
});

function App() {
  const [dnaSequence, setDnaSequence] = React.useState("");
  const navigation = useNavigation();

  const reverseString = (str) => str.split("").reduce((a, b) => b + a) + "";

  const navigateToPrimer = (DNA = "", isForward = true) => () => {
    if (!DNA) {
      Alert.alert("Error", "Enter DNA Sequence!");
      return;
    }
    console.log("Type: ", isForward);
    navigation.navigate("Primer", {
      DNA: (isForward ? DNA : reverseString(DNA)).toUpperCase(),
      isForward,
      headerTitle: isForward ? "Forward Primer" : "Reverse Primer"
    });
  };

  return (
    <Layout
      style={{
        flex: 1,
        flexDirection: "column",
        margin: 10,
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      <Text category="h4" style={styles.contentHeader}>
        Enter DNA Sequence
      </Text>
      <Input
        autoCapitalize="characters"
        style={styles.input}
        size="large"
        value={dnaSequence}
        onChangeText={setDnaSequence}
        placeholder="Enter DNA Sequence"
      />
      <Layout
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Button
          style={[styles.button, {}]}
          appearance="outline"
          status="primary"
          onPress={navigateToPrimer(dnaSequence, true)}
        >
          Forward Primer
        </Button>
        <Button
          style={styles.button}
          appearance="outline"
          status="primary"
          onPress={navigateToPrimer(dnaSequence, false)}
        >
          Reverse Primer
        </Button>
      </Layout>
    </Layout>
  );
}

const AppContainer = WrapComponentWithKittenProvider(App);

AppContainer.navigationOptions = () => {
  return {
    title: "PrimEasy",
    headerStyle: {
      backgroundColor: "#319ede"
    },
    headerTitleStyle: {
      fontWeight: "bold",
      color: "#fff"
    }
  };
};

const MainNavigator = createStackNavigator({
  Home: {
    screen: AppContainer
  },
  Primer: {
    screen: Primer
  }
});

export default createAppContainer(MainNavigator);
