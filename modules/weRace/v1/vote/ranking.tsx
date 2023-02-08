import { RankedVotingExperience } from "../../../../modules/weRace/v1/vote/votingExperience";
import { VotingExperience } from "./context";

const rankedVotingExperienceInfo = {
  explainExchange: {
    dialog: {
      emoji: "🥇 👀",
      label: "¡Voten juntos en vivo!",
      explanation: `Te dimos 3.000 LKS más por haber votado y 2.000 LKS más por haber hecho Log-In.`,
      leftSide: { emoji: "👛", label: "10.000 LKS" },
      rightSide: { emoji: "🗳️", label: "1 Voto" },
    },
    prompt: "Revisa el ranking y decide si cambiar tus votos.",
  },
  votingState: {
    experienceName: "ranking" as VotingExperience,
    allowance: 10000,
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

const RankingVoting = () => {
  return <RankedVotingExperience {...rankedVotingExperienceInfo} />;
};

export default RankingVoting;
