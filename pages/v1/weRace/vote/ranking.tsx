import RankedVotingExperience from "../../../../modules/weRace/v1/vote/components/votingExperience/rankedVotingExperience";

const rankedVotingExperienceInfo = {
  explainExchangeDialog: {
    emoji: "🥇 👀",
    label: "¡Voten juntos en vivo!",
    explanation: `Te dimos 3.000 LKS más por haber votado y 2.000 LKS más por haber hecho Log-In.`,
    leftSide: { emoji: "👛", label: "10.000 LKS" },
    rightSide: { emoji: "🗳️", label: "1 Voto" },
  },
  votingInfo: {
    allowance: 10000,
    allowanceMax: 10000,
    allowancePrepend: "👛",
    cost: 1000,
    numVotesByCandidateId: {},
    candidates: Array(32)
      .fill(0)
      .map((value, index) => {
        return {
          mediaTitle: `Candidate-${index}`,
        };
      }),
    votingPrompt: "Revisa el ranking y decide si cambiar tus votos.",
    votingPrepend: "🗳️",
  },
};

const IndividualVoting = () => {
  return <RankedVotingExperience {...rankedVotingExperienceInfo} />;
};

export default IndividualVoting;
