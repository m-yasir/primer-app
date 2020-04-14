import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Alert,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { Text, Layout, Input, Button } from "react-native-ui-kitten";
import { WrapComponentWithKittenProvider } from "../../../components/utils/theming";
import { useNavigation } from "react-navigation-hooks";
import { useMount } from "../../../components/utils/appUtil";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    // margin: 20,
    overflow: "scroll",
    backgroundColor: "#fff",
    minWidth: width,
    minHeight: height,
  },
  fieldsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
  },
  initialInputField: {
    marginLeft: 10,
    marginRight: 10,
  },
  resultsContainer: {
    display: "flex",
    flexDirection: "column",
    margin: 20,
  },
  textHeadingLayout: {
    backgroundColor: "#319ede",
    marginTop: 10,
    marginBottom: 10,
    minWidth: "55%",
    maxWidth: "70%",
    padding: 5,
    paddingRight: 0,
  },
  textHeading: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

const InsilicoPCR = () => {
  // Non-states
  const isForward = useRef(true);
  // Component States
  const navigation = useNavigation();
  const [userFP, setUserFP] = useState("");
  const [userRP, setUserRP] = useState("");
  const [sequences, setSequences] = useState(null);

  const getCharCountFromString = (string = "", char) => {
    return string.split(char).length - 1;
  };

  const reverseString = (str) => str.split("").reduce((a, b) => b + a) + "";

  useMount(() => {});

  const getSequenceCharacter = (char) => {
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

  const calculateSequencing = (sequence) => {
    return sequence
      .split("")
      .map((char) => getSequenceCharacter(char))
      .join("");
  };

  const getSequenceCharColor = (char) => {
    switch (char) {
      case "T":
        return "red";
      case "A":
        return "blue";
      case "G":
        return "green";
      default:
        return "black";
    }
  };

  const setMainSequences = () => {
    const _sequences = {
      fp: userFP,
      rp: userRP,
    };
    setSequences(_sequences);
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView style={styles.container}>
        {!sequences ? (
          <Layout style={{ marginLeft: 5, marginRight: 5 }}>
            <Layout>
              <Layout style={styles.textHeadingLayout}>
                <Text style={styles.textHeading}>
                  Sequence for Forward Primer:
                </Text>
              </Layout>
              <Input
                style={styles.initialInputField}
                onChangeText={setUserFP}
                placeholder="Enter Sequence.."
              />
            </Layout>
            <Layout>
              <Layout style={styles.textHeadingLayout}>
                <Text style={styles.textHeading}>
                  Sequence for Reverse Primer:
                </Text>
              </Layout>
              <Input
                style={styles.initialInputField}
                onChangeText={setUserRP}
                placeholder="Enter Sequence.."
              />
            </Layout>
            <Button
              style={{
                margin: 10,
              }}
              appearance="outline"
              status="primary"
              onPress={setMainSequences}
            >
              Done
            </Button>
          </Layout>
        ) : (
          <>
            <Layout style={styles.textHeadingLayout}>
              <Text
                style={{
                  ...styles.textHeading,
                  // width: "70%",
                  textAlign: "center",
                }}
              >
                Forward Primer:
              </Text>
            </Layout>
            <Layout style={styles.fieldsContainer}>
              <Input
                // onChangeText={handleInputChange("start")}
                disabled
                style={{
                  minWidth: 200,
                }}
              />
            </Layout>
            <Layout style={styles.textHeadingLayout}>
              <Text
                style={[
                  styles.textHeading,
                  { textAlign: "center" },
                ]}
              >
                Reverse Primer:
              </Text>
            </Layout>
            <Layout style={styles.fieldsContainer}>
              <Input
                // onChangeText={handleInputChange("start")}
                disabled
                style={{
                  minWidth: 200,
                }}
              />
            </Layout>
          </>
        )}
        {/* <Layout style={styles.textHeadingLayout}>
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
              minWidth: 200,
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
              minWidth: 200,
            }}
            value={reversePrimer}
          />
        </Layout> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const InsilicoPCRContainer = WrapComponentWithKittenProvider(InsilicoPCR);

InsilicoPCRContainer.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam("headerTitle"),
});

export default InsilicoPCRContainer;
