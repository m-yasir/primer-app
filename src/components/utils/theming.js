import React from "react";
import { ApplicationProvider } from "react-native-ui-kitten";
import { mapping, light } from "@eva-design/eva";

export const WrapComponentWithKittenProvider = Component => props => (
  <ApplicationProvider mapping={mapping} theme={light}>
    <Component {...props} />
  </ApplicationProvider>
);
