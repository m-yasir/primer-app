import React from "react";
import { Layout, Text } from "react-native-ui-kitten";
import { WrapComponentWithKittenProvider } from "../../../components/utils/theming";

const useStyles = () => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center"
  },
  button: {
    minWidth: 200,
    margin: 10
  }
});

const ThermocyclerReaction = () => {
  const styles = useStyles();
  return (
    <Layout style={styles.container}>
        <Text>Insert Text Here!</Text>
    </Layout>
  );
};

const ThermocyclerReactionContainer = WrapComponentWithKittenProvider(ThermocyclerReaction);

ThermocyclerReactionContainer.navigationOptions = () => {
  return {
    title: "ThermoCycler Reaction",
    headerStyle: {
      backgroundColor: "#319ede"
    },
    headerTitleStyle: {
      fontWeight: "bold",
      color: "#fff"
    }
  };
};

export default ThermocyclerReactionContainer;
