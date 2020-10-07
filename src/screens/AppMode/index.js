import React from "react";
import { StyleSheet, Alert } from "react-native";
import { useNavigation } from "react-navigation-hooks";

import { Layout, Text, Input, Button } from "react-native-ui-kitten";

import { WrapComponentWithKittenProvider } from "../../utils/theming";

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
  seqReqBtns: {
    width: "40%"
  },
  thermBtn: {
    width: "90%"
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
    <Layout
      style={{
        flex: 1,
        flexDirection: "column",
        margin: 10,
        alignItems: "center",
        justifyContent: "space-between",
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
          justifyContent: "flex-end",
        }}
      >
        <Layout
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            style={[styles.button, styles.seqReqBtns]}
            appearance="outline"
            status="primary"
            onPress={navigateToDesign(dnaSequence, "primer")}
          >
            Primer Design
          </Button>
          <Button
            style={[styles.button, styles.seqReqBtns]}
            appearance="outline"
            status="primary"
            onPress={navigateToDesign(dnaSequence, "insilico")}
          >
            Insilico PCR
          </Button>
        </Layout>
        <Layout
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Button
            style={[styles.button, styles.thermBtn]}
            appearance="outline"
            status="primary"
            onPress={navigateToDesign(dnaSequence, "thermocycler")}
          >
            Thermocycler Reaction Design
          </Button>
        </Layout>
      </Layout>
    </Layout>
  );
}

const AppModeContainer = WrapComponentWithKittenProvider(AppMode);

AppModeContainer.navigationOptions = () => {
  return {
    title: "PRIMeasy",
  };
};

export default AppModeContainer;
