import { Box } from "@mui/material";
import WeRaceVote from "../../../../modules/weRace/v1/vote";
import WeRaceVoteProvider from "../../../../modules/weRace/v1/vote/context";

const Vote = () => {
  return (
    <Box>
      <WeRaceVoteProvider>
        <WeRaceVote />
      </WeRaceVoteProvider>
    </Box>
  );
};

export default Vote;
