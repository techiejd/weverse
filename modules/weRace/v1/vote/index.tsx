import { Box } from "@mui/material";
import { useWeRaceVoteState } from "./context";
import IndividualVoting from "./individual";
import InterestsVoting from "./interests";
import RankingVoting from "./ranking";

const ImpactsVoting = () => {
  const voteState = useWeRaceVoteState();
  return (
    <Box>
      {voteState?.votes?.individual ? <RankingVoting /> : <IndividualVoting />}
    </Box>
  );
};

const WeRaceVote = () => {
  const voteState = useWeRaceVoteState();
  return (
    <Box>
      {voteState?.votes?.interests ? <ImpactsVoting /> : <InterestsVoting />}
    </Box>
  );
};

export default WeRaceVote;
