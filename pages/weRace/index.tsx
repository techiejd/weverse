import { Box } from "@mui/material";
import WeRaceVote from "../../modules/weRace";
import WeRaceVoteProvider from "../../modules/weRace/context";

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
