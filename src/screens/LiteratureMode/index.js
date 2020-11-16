import React from "react";
import { Layout, Button } from "react-native-ui-kitten";
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
    minWidth: 300,
    margin: 10,
  },
});

const LiteratureMode = () => {
  const nav = useNavigation();
  const navigateToLiterature = (name) => () => {
    switch (name) {
      case "primer":
        nav.navigate("PrimerLiterature", { headerTitle: 'Primer Design' });
        break;
      case "insilico":
        nav.navigate("InsilicoPCRLiterature", { headerTitle: 'InsilicoPCR' });
        break;
      case "thermocycler":
        nav.navigate("LMThermocyclerReaction", { headerTitle: 'Thermocycler Reaction' });
        break;
    }
  };
  const styles = useStyles();
  return (
    <Layout style={styles.container}>
      <Layout>
        <Button
          appearance="outline"
          status="primary"
          style={styles.button}
          onPress={navigateToLiterature("primer")}
        >
          Primer Design
        </Button>
      </Layout>
      <Layout>
        <Button
          appearance="outline"
          status="primary"
          style={styles.button}
          onPress={navigateToLiterature("insilico")}
        >
          Insilico PCR Design
        </Button>
      </Layout>
      <Layout>
        <Button
          appearance="outline"
          status="primary"
          style={styles.button}
          onPress={navigateToLiterature("thermocycler")}
        >
          Thermocycler Reaction Design
        </Button>
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
