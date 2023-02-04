import { Box } from "@mui/material";
import { ExplainExchangeBox } from "../../modules/weRace/v1/vote/components/explainExchangeModal";

const ExplainVotingModal = () => {
  return (
    <Box>
      <ExplainExchangeBox
        emoji="👛 -> 🗳️"
        label="¡Vota!"
        explanation="Elige proyectos y causas que te conmuevan. Cada elección cuenta, así que elige bien."
        leftSide={{ emoji: "👛", label: "10.000 LKS" }}
        rightSide={{ emoji: "🗳️", label: "1 Voto" }}
      />
    </Box>
  );
};

export default ExplainVotingModal;
