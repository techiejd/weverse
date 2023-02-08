import { Grid } from "@mui/material";
import { ComparativeCard } from "./candidate/comparativeCard";
import { useVotingState } from "./context";
import VotingExperience, {
  CandidatesById,
  VotingExperienceInfo,
} from "./votingExperience";

const ComparativeContent = ({ candidates }: { candidates: CandidatesById }) => {
  const votingState = useVotingState();
  return (
    <Grid container spacing={1}>
      {Object.entries(candidates)
        .filter(([id, candidate]) => {
          if (votingState) {
            if (!votingState.filteredOnMyVotes) {
              return true;
            }
            return votingState.votes[id] > 0;
          }
          return true;
        })
        .map(([id, candidate], i) => (
          <Grid item sm={6} md={4} lg={2} xl={1} key={i}>
            <ComparativeCard candidate={candidate} height="277px" />
          </Grid>
        ))}
    </Grid>
  );
};

const ComparativeVotingExperience = (props: VotingExperienceInfo) => (
  <VotingExperience {...props}>
    <ComparativeContent candidates={props.votingState.candidates} />
  </VotingExperience>
);

export default ComparativeVotingExperience;
