import { Stack } from "@mui/material";
import { useVotingState } from "../../context";
import CandidateRankingCard from "./candidate/rankingCard";
import VotingExperience, {
  CandidatesById,
  VotingExperienceInfo,
} from "./votingExperience";

const RankedContent = ({ candidates }: { candidates: CandidatesById }) => {
  const votingState = useVotingState();
  return (
    <Stack>
      {Object.entries(candidates)
        .filter(([id, candidate]) => {
          if (votingState) {
            if (!votingState.filteredOnMyVotes) {
              return true;
            }
            return votingState.numVotesByCandidateId[id] > 0;
          }
          return true;
        })
        .map(([id, candidate], i) => (
          <CandidateRankingCard candidate={candidate} key={i} />
        ))}
    </Stack>
  );
};

const RankedVotingExperience = (props: VotingExperienceInfo) => {
  return (
    <VotingExperience {...props}>
      <RankedContent candidates={props.votingInfo.candidates} />
    </VotingExperience>
  );
};

export default RankedVotingExperience;
