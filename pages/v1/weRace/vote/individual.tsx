import { ComparativeVotingExperience } from "../../../../modules/weRace/v1/vote/components/votingExperience";

const individualVotingExperienceInfo = {
  explainExchangeDialog: {
    emoji: "👛 -> 🗳️",
    label: "¡Vota!",
    explanation:
      "Elige proyectos y causas que te conmuevan. Cada elección cuenta, así que elige bien.",
    leftSide: { emoji: "👛", label: "10.000 LKS" },
    rightSide: { emoji: "🗳️", label: "1 Voto" },
  },
  votingInfo: {
    allowance: 10000,
    allowanceMax: 10000,
    allowancePrepend: "👛",
    cost: 1000,
    numVotesByCandidateId: {},
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
    votingPrompt: "Vota 🗳️ impactos sociales de tu interés.",
    votingPrepend: "🗳️",
  },
};

const IndividualVoting = () => {
  return <ComparativeVotingExperience {...individualVotingExperienceInfo} />;
};

export default IndividualVoting;
