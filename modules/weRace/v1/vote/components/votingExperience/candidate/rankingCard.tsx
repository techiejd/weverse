import { Box, Stack, Typography } from "@mui/material";
import {
  useVotingDispatch,
  useVotingState,
  VotingActionType,
} from "../../../context";
import { Candidate } from "../votingExperience";
import { VotingBar } from "./votingBar";

const CandidateRankingCard = (props: { candidate: Candidate }) => {
  const votingState = useVotingState();
  const votingDispatch = useVotingDispatch();
  return (
    <Stack
      sx={{
        backgroundColor: "red",
        height: 88,
        marginLeft: 2,
        marginRight: 2,
        marginTop: 1,
        marginBottom: 1,
        p: 1,
        alignItems: "center",
        justifyContent: "space-between",
      }}
      direction="row"
      spacing={1}
      onClick={() => {
        if (votingDispatch) {
          votingDispatch({
            type: VotingActionType.get,
            candidateId: props.candidate.id,
          });
        }
      }}
    >
      <Box
        sx={{
          backgroundColor: "green",
          height: "72px",
          width: "100px",
        }}
      ></Box>
      <Stack
        sx={{ backgroundColor: "yellow", alignItems: "center" }}
        flexGrow={1}
      >
        <Typography>{props.candidate.title}</Typography>
        <Typography>1234 Votes</Typography>
        <VotingBar
          sx={{
            height: "20px",
            width: "104px",
          }}
          candidateId={props.candidate.id}
        ></VotingBar>
      </Stack>
      <Stack
        sx={{
          backgroundColor: "blue",
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        <Typography># 11234</Typography>
        <Typography sx={{ marginLeft: "auto" }}>🗳️</Typography>
      </Stack>
    </Stack>
  );
};

export default CandidateRankingCard;
