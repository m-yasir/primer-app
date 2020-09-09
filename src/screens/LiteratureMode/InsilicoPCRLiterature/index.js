import React from "react";

import { WrapComponentWithKittenProvider } from "../../../components/utils/theming";
import LiteratureModeTemplate from "../../../components/literatureModeTemplate";

const content = [
  {
    bold: "",
    content: [
      `In silico PCR refers to computational tools used to calculate theoretical polymerase chain reaction (PCR) results using a given set of primers (probes) to amplify DNA sequences from a sequenced genome or transcriptome`,
      `These tools are used to optimize the design of primers for target DNA or cDNA sequences`,
      `The design of appropriate short or long primer pairs is only one goal of PCR product prediction. Other information provided by in silico PCR tools may include determining primer location, orientation, length of each amplicon.`,
      `A primer may bind to many predicted sequences, but only sequences with no or few mismatches (1 or 2, depending on location and nucleotide) at the 3' end of the primer can be used for polymerase extension. The last 10-12 bases at the 3' end of a primer are sensitive to initiation of polymerase extension and general primer stability on the template binding site. The effect of a single mismatch at these last 10 bases at the 3' end of the primer depends on its position and local structure, reducing the primer binding, selectivity, and PCR efficiency.`,
    ],
  },
];

const InsilicoPCR = () => {
  return <LiteratureModeTemplate content={content} />;
};

const InsilicoPCRContainer = WrapComponentWithKittenProvider(InsilicoPCR);

InsilicoPCRContainer.navigationOptions = () => {
  return {
    title: "InsilicoPCR Design"
  };
};

export default InsilicoPCRContainer;
