import { Grid } from "@mui/material";
import { ComparativeCard } from "./candidate/comparativeCard";
import VotingExperience, {
  CandidatesById,
  VotingExperienceInfo,
} from "./votingExperience";

const ComparativeContent = ({ candidates }: { candidates: CandidatesById }) => {
  return (
    <Grid container spacing={1}>
      {Object.entries(candidates).map(([id, candidate], i) => (
        <Grid item sm={6} md={4} lg={2} xl={1} key={i}>
          <ComparativeCard candidate={candidate} height="277px" />
        </Grid>
      ))}
    </Grid>
  );
};

const ComparativeVotingExperience = (props: VotingExperienceInfo) => (
  <VotingExperience {...props}>
    <ComparativeContent candidates={props.votingInfo.candidates} />
  </VotingExperience>
);

export default ComparativeVotingExperience;
