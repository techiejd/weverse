import { VotingExperience } from "./context";
import { impacts } from "./hardcoded";
import { ComparativeVotingExperience } from "./votingExperience";

const individualVotingExperienceInfo = {
  explainExchange: {
    dialog: {
      emoji: "👛 -> 🗳️",
      label: "¡Vota!",
      explanation:
        "Elige proyectos y causas que te conmuevan. Cada elección cuenta, así que elige bien.",
      leftSide: { emoji: "👛", label: "1.000 LKS" },
      rightSide: { emoji: "🗳️", label: "1 Voto" },
    },
    prompt: "Vota 🗳️ impactos sociales de tu interés.",
  },
  votingState: {
    experienceName: "individual" as VotingExperience,
    allowance: 5000,
    allowanceMax: 10000,
    allowancePrepend: "👛",
    value: 1000,
    votes: {},
    candidates: Object.fromEntries(
      impacts.map((impact) => [impact.id, impact])
    ),
    votingPrepend: "🗳️",
  },
};

const IndividualVoting = () => {
  return <ComparativeVotingExperience {...individualVotingExperienceInfo} />;
};

export default IndividualVoting;
