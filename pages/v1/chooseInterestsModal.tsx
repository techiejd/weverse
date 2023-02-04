import { Box } from "@mui/material";
import { ExplainExchangeBox } from "../../modules/weRace/v1/vote/components/explainExchangeModal";

const ChooseInterestsModal = () => {
  return (
    <ExplainExchangeBox
      emoji="❤️‍🔥"
      label="Escoges tus intereses"
      explanation="Elige tus intereses para mostrarte los impactos sociales que a ti te
        mueven"
      leftSide={{ emoji: "❤️‍🔥", label: "1 Interes" }}
      rightSide={{ emoji: "🎯", label: "1 Elección" }}
    />
  );
};

export default ChooseInterestsModal;
