import { Stack, Box, Typography } from "@mui/material";
import { useVotingDispatch, VotingActionType } from "../../../context";
import { Candidate } from "../votingExperience";
import { VotingBar } from "./votingBar";

export const ComparativeCard = (props: {
  candidate: Candidate;
  height: string;
}) => {
  const votingDispatch = useVotingDispatch();
  return (
    <Stack spacing={1} sx={{ alignItems: "center" }}>
      <Box
        sx={{
          backgroundColor: "red",
          borderRadius: 4,
          height: props.height,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          overflow: "hidden",
        }}
        onClick={() => {
          if (votingDispatch) {
            votingDispatch({
              type: VotingActionType.get,
              candidateId: props.candidate.id,
            });
          }
        }}
      >
        <Box sx={{ backgroundColor: "yellow", flexGrow: 7 }}></Box>
        <Box
          sx={{
            backgroundColor: "Blue",
            flexGrow: 1,
            alignItems: "center",
            display: "flex",
            paddingLeft: 1,
          }}
        >
          <Typography fontSize="20px">{props.candidate.title}</Typography>
        </Box>
      </Box>
      <VotingBar
        sx={{
          height: "48px",
          width: "144px",
        }}
        candidateId={props.candidate.id}
      ></VotingBar>
    </Stack>
  );
};
