import { Box } from "@mui/material";
import Vote from "../../modules/vote";
import VoteProvider from "../../modules/vote/context";

const VotePage = () => {
  return (
    <Box>
      <VoteProvider>
        <Vote />
      </VoteProvider>
    </Box>
  );
};

export default VotePage;
