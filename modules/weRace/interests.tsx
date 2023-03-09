import { VotingExperience } from "./context";
import { tags } from "./hardcoded";
import { ComparativeVotingExperience } from "./votingExperience";

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
    candidates: Object.fromEntries(tags.map((tag) => [tag.id, tag])),
    votingPrepend: "🎯",
  },
};

const InterestsVoting = () => {
  return <ComparativeVotingExperience {...interestsVotingExperienceInfo} />;
};

export default InterestsVoting;
