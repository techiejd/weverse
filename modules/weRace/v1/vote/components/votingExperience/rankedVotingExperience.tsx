import { Stack } from "@mui/material";
import CandidateRankingCard from "./candidate/rankingCard";
import VotingExperience, {
  CandidatesById,
  VotingExperienceInfo,
} from "./votingExperience";

const RankedContent = ({ candidates }: { candidates: CandidatesById }) => {
  return (
    <Stack>
      {Object.entries(candidates).map(([id, candidate], i) => (
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
