import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Alert,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
import { Text, Layout, Input, Button } from "react-native-ui-kitten";
import { WrapComponentWithKittenProvider } from "../../../components/utils/theming";
import { useNavigation } from "react-navigation-hooks";
import { useMount } from "../../../components/utils/appUtil";

const styles = StyleSheet.create({
  container: {
    margin: 20,
    overflow: "scroll"
  },
  fieldsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10
  },
  resultsContainer: {
    display: "flex",
    flexDirection: "column",
    margin: 20
  },
  textHeadingLayout: {
    backgroundColor: "#319ede",
    marginTop: 10,
    width: "55%",
    padding: 5,
    paddingRight: 0
  },
  textHeading: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18
  }
});

const InsilicoPCR = () => {
  // Non-states
  const isForward = useRef(true);
  // Component States
  const navigation = useNavigation();
  const [dnaSequence, setDnaSequence] = useState("");
  const [forwardPrimer, setForwardPrimer] = useState("");
  const [reversePrimer, setReversePrimer] = useState("");
  const [calculation, setCalculation] = useState(null);
  const [sequenceTerminals, setSequenceTerminals] = useState({
    initial: "",
    end: ""
  });
  const [formValues, setFormValues] = useState({
    start: "1",
    end: null
  });

  const getCharCountFromString = (string = "", char) => {
    return string.split(char).length - 1;
  };

  const reverseString = str => str.split("").reduce((a, b) => b + a) + "";

  const getSequenceWithTerminals = (primerType, sequence) => {
    switch (primerType) {
      case "forward":
        return `5'${sequence}3'`;
      case "reverse":
        return `3'${sequence}5'`;
      default:
        return;
    }
  };

  useMount(() => {
    isForward.current = navigation.getParam("isForward");
    // const sequenceTerminals = { initial: "5'", end: "3'" };
    // if (!isForward.current) {
    //   sequenceTerminals.initial = "3'";
    //   sequenceTerminals.end = "5'";
    // }
    // setSequenceTerminals(sequenceTerminals);
    // setDnaSequence(navigation.getParam("DNA") || "");
    setDnaSequence(navigation.getParam("DNA") || "");
  });

  const getSequenceCharacter = char => {
    switch (char) {
      case "5'":
        return "3'";
      case "3'":
        return "5'";
      case "A":
        return "T";
      case "T":
        return "A";
      case "C":
        return "G";
      case "G":
        return "C";
      default:
        return char;
    }
  };

  const calculateSequencing = sequence => {
    return sequence
      .split("")
      .map(char => getSequenceCharacter(char))
      .join("");
  };

  calculateValues = (sliceStart, sliceEnd) => () => {
    Keyboard.dismiss();
    --sliceStart;
    if (
      sliceEnd <= sliceStart ||
      sliceEnd > dnaSequence.length ||
      sliceEnd > 24
    ) {
      Alert.alert("Error", "Invalid Slicing!");
      return;
    }
    const slicedSequence = dnaSequence.slice(sliceStart, sliceEnd);
    const AT =
      getCharCountFromString(slicedSequence, "A") +
      getCharCountFromString(slicedSequence, "T");
    const GC =
      getCharCountFromString(slicedSequence, "G") +
      getCharCountFromString(slicedSequence, "C");
    const TM = 4 * GC + 2 * AT;
    setCalculation({
      sequence: slicedSequence,
      AT,
      GC,
      TM,
      total: ((GC / slicedSequence.length) * 100).toFixed(1),
      complementary: isForward.current
        ? null
        : calculateSequencing(slicedSequence)
    });
  };

  const handleInputChange = key => value => {
    setFormValues({ ...formValues, [key]: value });
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView style={styles.container}>
        <Layout style={styles.textHeadingLayout}>
          <Text style={styles.textHeading}>Nucleotide Sequence:</Text>
        </Layout>
        <Text style={{ textAlign: "center" }}>{` ${dnaSequence}`}</Text>
        <Text style={{ marginTop: 5, marginBottom: 5 }}>
          <Text style={{ fontWeight: "bold" }}>Total Nucleotide:</Text>
          {` ${dnaSequence.length}`}
        </Text>
        <Layout style={styles.fieldsContainer}>
          <Input
            keyboardType="numeric"
            value={formValues.start}
            disabled
            onChangeText={handleInputChange("start")}
            placeholder="Enter DNA Start"
          />
          <Input
            keyboardType="numeric"
            value={formValues.end}
            onChangeText={handleInputChange("end")}
            placeholder="Enter DNA End"
          />
        </Layout>
        <Button
          appearance="outline"
          status="primary"
          onPress={calculateValues(+formValues.start, +formValues.end)}
        >
          Calculate
        </Button>
        <Layout style={styles.textHeadingLayout}>
          <Text
            style={{ ...styles.textHeading, width: "70%", textAlign: "center" }}
          >
            Forward Primer:
          </Text>
        </Layout>
        <Layout style={styles.fieldsContainer}>
          <Input
            value={formValues.start}
            disabled
            style={{
              minWidth: 200
            }}
            // onChangeText={handleInputChange("start")}
            value={forwardPrimer}
          />
        </Layout>
        <Layout style={styles.textHeadingLayout}>
          <Text
            style={[styles.textHeading, { width: "70%", textAlign: "center" }]}
          >
            Reverse Primer:
          </Text>
        </Layout>
        <Layout style={styles.fieldsContainer}>
          <Input
            value={formValues.start}
            disabled
            style={{
              minWidth: 200
            }}
            value={reversePrimer}
          />
        </Layout>
        {/* {calculation && (
          <Layout style={styles.resultsContainer}>
            <Text>
              <Text style={{ fontWeight: "bold" }}>Sequence:</Text>
              {` ${sequenceTerminals.initial} ${calculation.sequence} ${sequenceTerminals.end}`}
            </Text>
            <Text>{`AT: ${calculation.AT}`}</Text>
            <Text>{`GC: ${calculation.GC}`}</Text>
            <Text>{`Melting Temperature (TM): ${calculation.TM} (${
              calculation.TM >= 55 && calculation.TM <= 65
                ? "Stable"
                : "Unstable"
            })`}</Text>
            <Text>{`Primer Content: ${calculation.total}`}</Text>
            {calculation.complementary && (
              <Text>{`Complementary: 5' ${calculation.complementary} 3'`}</Text>
            )}
          </Layout>
        )} */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const InsilicoPCRContainer = WrapComponentWithKittenProvider(InsilicoPCR);

InsilicoPCRContainer.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam("headerTitle"),
  headerStyle: {
    backgroundColor: "#319ede"
  },
  headerTitleStyle: {
    fontWeight: "bold",
    color: "#fff"
  },
  headerTintColor: "#fff"
});

export default InsilicoPCRContainer;
