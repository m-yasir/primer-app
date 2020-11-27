import React from "react"
import { View, Text, Image } from "react-native"
import { NavigationScreenProp } from "react-navigation"
import { NavigationStackOptions } from "react-navigation-stack"
/**
 * @typedef Props
 * @property {NavigationScreenProp} navigation
 * @property {NavigationStackOptions} navigationOptions
 */

/**
 * @param {Props} props
 */
export default (props) => {
    const { navigation, navigationOptions } = props;
    /** @type {string} */
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
                    source={require("./../../../assets/logo.png")}
                />
            )}
        </View>
    );
}