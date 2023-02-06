import { Stack } from "@mui/material";
import CandidateRankingCard from "./candidate/rankingCard";
import VotingExperience, { VotingExperienceInfo } from "./votingExperience";

const RankedContent = ({
  candidates,
}: {
  candidates: [{ mediaTitle: string }];
}) => {
  return (
    <Stack>
      {candidates.map((el, i) => (
        <CandidateRankingCard key={i} />
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
