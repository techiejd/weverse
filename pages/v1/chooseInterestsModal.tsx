import { Box } from "@mui/material";
import { ExplainExchangeModal } from "../../modules/weRace/v1/vote/components/explainExchangeModal";

const ChooseInterestsModal = () => {
  return (
    <Box>
      <ExplainExchangeModal
        emoji="❤️‍🔥 -> 🎯"
        label="Escoges tus intereses"
        explanation="Elige tus intereses para mostrarte los impactos sociales que a ti te
        mueven"
        leftSide={{ emoji: "❤️‍🔥", label: "1 Interes" }}
        rightSide={{ emoji: "🎯", label: "1 Elección" }}
      />
    </Box>
  );
};

export default ChooseInterestsModal;
