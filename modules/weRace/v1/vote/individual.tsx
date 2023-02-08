import { ComparativeVotingExperience } from "../../../../modules/weRace/v1/vote/votingExperience";
import { VotingExperience } from "./context";

const individualVotingExperienceInfo = {
  explainExchange: {
    dialog: {
      emoji: "👛 -> 🗳️",
      label: "¡Vota!",
      explanation:
        "Elige proyectos y causas que te conmuevan. Cada elección cuenta, así que elige bien.",
      leftSide: { emoji: "👛", label: "10.000 LKS" },
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
      Array(32)
        .fill(0)
        .map((value, index) => {
          return [
            index,
            {
              title: `Candidate-${index}`,
              id: String(index),
            },
          ];
        })
    ),
    votingPrepend: "🗳️",
  },
};

const IndividualVoting = () => {
  return <ComparativeVotingExperience {...individualVotingExperienceInfo} />;
};

export default IndividualVoting;
