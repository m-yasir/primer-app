import React from "react";
import { ScrollView } from "react-native";

import { Layout, Text } from "react-native-ui-kitten";

const useStyles = () => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    margin: 10,
  },
  button: {
    minWidth: 200,
    margin: 10,
  },
  focusText: {
    fontWeight: "bold",
    fontSize: 14,
  },
});

const LiteratureModeTemplate = ({ content }) => {
  const styles = useStyles();
  return (
    <Layout style={styles.container}>
      <ScrollView>
        {content.map((item, idx) => (
          <Layout key={idx}>
            {Boolean(item.bold) && (
              <Text style={styles.focusText}>{item.bold}</Text>
            )}
            {item.content.map((el, idx) => (
              <Text key={idx}>
                <Text>{"\u2022" + " "}</Text>
                {el}
              </Text>
            ))}
          </Layout>
        ))}
      </ScrollView>
    </Layout>
  );
};

export default LiteratureModeTemplate;
