import { NumVotesByCandidateId, VotingExperience } from "./context";
import { impacts } from "./hardcoded";
import { RankedVotingExperience } from "./votingExperience";

const partialRankedVotingExperienceInfo = {
  explainExchange: {
    dialog: {
      emoji: "🥇 👀",
      label: "¡Voten juntos en vivo!",
      explanation: `Te dimos 3.000 LKS más por haber votado y 2.000 LKS más por haber hecho Log-In.`,
      leftSide: { emoji: "👛", label: "1.000 LKS" },
      rightSide: { emoji: "🗳️", label: "1 Voto" },
    },
    prompt: "Revisa el ranking y decide si cambiar tus votos.",
  },
  votingState: {
    experienceName: "ranking" as VotingExperience,
    allowance: 5000,
    allowanceMax: 10000,
    allowancePrepend: "👛",
    value: 1000,
    candidates: Object.fromEntries(
      impacts.map((impact) => [impact.id, impact])
    ),
    votingPrepend: "🗳️",
  },
};

const RankingVoting = (props: { votes: NumVotesByCandidateId }) => {
  const rankedVotingExperienceInfo = {
    ...partialRankedVotingExperienceInfo,
    votingState: {
      ...partialRankedVotingExperienceInfo.votingState,
      votes: props.votes,
    },
  };
  return <RankedVotingExperience {...rankedVotingExperienceInfo} />;
};

export default RankingVoting;
