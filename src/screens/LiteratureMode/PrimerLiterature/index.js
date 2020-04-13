import React from "react";
import { ScrollView } from "react-native";

import { Layout, Text } from "react-native-ui-kitten";
import { WrapComponentWithKittenProvider } from "../../../components/utils/theming";

const useStyles = () => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    margin: 10
  },
  button: {
    minWidth: 200,
    margin: 10
  },
  focusText: {
    fontWeight: "bold",
    fontSize: 14
  }
});

const content = [
  {
    bold: "Q) What is Primer?",
    content: [
      `A primer is a short nucleic acid sequence that provides a starting point for DNA synthesis. ... The synthesis of a primer is necessary because the enzymes that synthesize DNA, which are called DNA polymerases, can only attach new DNA nucleotides to an existing strand of nucleotides.`
    ]
  },
  {
    bold: "Use in PCR (polymerase chain reaction)",
    content: [
      `The polymerase chain reaction (PCR) uses a pair of custom primers to direct DNA elongation toward each-other at opposite ends of the sequence being amplified. These primers are typically between 18 and 24 bases in length, and must code for only the specific upstream and downstream sites of the sequence being amplified. A primer that can bind to multiple regions along the DNA will amplify them all, eliminating the purpose of PCR.`,
      `A few criteria must be brought into consideration when designing a pair of PCR primers. Pairs of primers should have similar melting temperatures since annealing during PCR occurs for both strands simultaneously.`
    ]
  },
  {
    bold: "Online TOOLS",
    content: [
      `Many online tools are freely available for primer design, some of which focus on specific applications of PCR.`
    ]
  },
  {
    bold: "Q) Why we design primer?",
    content: [
      "When designing primers, additional nucleotide bases can be added to the back ends of each primer, resulting in a customized cap sequence on each end of the amplified region."
    ]
  }
];

const PrimerLiterature = () => {
  const styles = useStyles();
  return (
    <Layout style={styles.container}>
      <ScrollView>
        {content.map((item, idx) => (
          <Layout key={idx}>
            <Text style={styles.focusText}>{item.bold}</Text>
            {item.content.map((el, idx) => (
              <Text key={idx}>{el}</Text>
            ))}
          </Layout>
        ))}
      </ScrollView>
    </Layout>
  );
};

const PrimerLiteratureContainer = WrapComponentWithKittenProvider(
  PrimerLiterature
);

PrimerLiteratureContainer.navigationOptions = () => {
  return {
    title: "Primer Design",
    headerStyle: {
      backgroundColor: "#319ede"
    },
    headerTitleStyle: {
      fontWeight: "bold",
      color: "#fff"
    }
  };
};

export default PrimerLiteratureContainer;
