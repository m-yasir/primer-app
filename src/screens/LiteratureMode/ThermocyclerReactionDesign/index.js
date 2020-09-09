import React from "react";

import { WrapComponentWithKittenProvider } from "../../../components/utils/theming";
import LiteratureModeTemplate from "../../../components/literatureModeTemplate";

const content = [
  {
    bold: "DENATURATION",
    content: [
      `During this stage the cocktail containing the template DNA and all the other core ingredients is heated to 94-95⁰C.`,
      `This results in two single strands of DNA, which will act as templates for the production of the new strands of DNA.`,
    ],
  },
  {
    bold: "ANEALING",
    content: [
      `During this stage the reaction is cooled to 50-65⁰C. This enables the primers to attach to a specific location on the single-stranded template DNA by way of hydrogen bonding (the exact temperature depends on the melting temperature of the primers you are using).`,
      `The two separated strands of DNA are complementary and run in opposite directions (from one end - the 5’ end – to the other - the 3’ end); as a result, there are two primers – a forward primer and a reverse primer.`,
    ],
  },
  {
    bold: "EXTENTION",
    content: [
      `During this final step, the heat is increased to 72⁰C to enable the new DNA to be made by a special Taq DNA polymerase enzyme which adds DNA bases.`,
      `72⁰C is the optimum temperature for the Taq polymerase to build the complementary strand. It attaches to the primer and then adds DNA bases to the single strand one-by-one in the 5’ to 3’ direction.`,
      `The duration of this step depends on the length of DNA sequence being amplified but usually takes around one minute to copy 1,000 DNA bases (1Kb).`,
    ],
  },
];

const ThermocyclerReactionDesign = () => {
  return <LiteratureModeTemplate content={content} />;
};

const ThermocyclerReactionDesignContainer = WrapComponentWithKittenProvider(
  ThermocyclerReactionDesign
);

ThermocyclerReactionDesignContainer.navigationOptions = () => {
  return {
    title: "Thermocycler Reaction Design"
  };
};

export default ThermocyclerReactionDesignContainer;
