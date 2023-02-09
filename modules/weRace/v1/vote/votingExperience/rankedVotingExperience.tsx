import { Stack } from "@mui/material";
import CandidateRankingCard from "./candidate/rankingCard";
import { useVotingState } from "./context";
import VotingExperience, { VotingExperienceInfo } from "./votingExperience";

const RankedContent = () => {
  const votingState = useVotingState();
  return (
    <Stack>
      {Object.entries(votingState!.candidates)
        .filter(([id, candidate]) => {
          if (votingState) {
            if (!votingState.filteredOnMyVotes) {
              return true;
            }
            return votingState.votes[id] > 0;
          }
          return true;
        })
        .sort(([idA, candidateA], [idB, candidateB]) => {
          console.log("sorting");
          // Sum higher = first
          console.log(candidateA.sum);
          console.log(candidateB.sum);
          if (candidateA.sum == undefined) {
            if (candidateB.sum == undefined) {
              return 0;
            }
            return 1;
          }
          if (candidateB.sum == undefined) {
            return -1;
          }
          return candidateB.sum - candidateA.sum;
        })
        .map(([id, candidate], i) => (
          <CandidateRankingCard candidate={candidate} key={i} rank={i + 1} />
        ))}
    </Stack>
  );
};

const RankedVotingExperience = (props: VotingExperienceInfo) => {
  return (
    <VotingExperience {...props}>
      <RankedContent />
    </VotingExperience>
  );
};

export default RankedVotingExperience;
