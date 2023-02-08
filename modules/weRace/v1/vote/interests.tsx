import { ComparativeVotingExperience } from "../../../../modules/weRace/v1/vote/votingExperience";
import { VotingExperience } from "./context";

const interestsVotingExperienceInfo = {
  explainExchange: {
    dialog: {
      emoji: "❤️‍🔥",
      label: "Escoges tus intereses",
      explanation:
        "Elige tus intereses para mostrarte los impactos sociales que a ti te mueven",
      leftSide: { emoji: "❤️‍🔥", label: "1 Interes" },
      rightSide: { emoji: "🎯", label: "1 Elección" },
    },
    prompt: "Agrega ❤️‍🔥 a temas sociales de tu interés.",
  },
  votingState: {
    experienceName: "interests" as VotingExperience,
    allowance: 5,
    allowanceMax: 5,
    allowancePrepend: "❤️‍🔥",
    value: 1,
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

const InterestsVoting = () => {
  return <ComparativeVotingExperience {...interestsVotingExperienceInfo} />;
};

export default InterestsVoting;
