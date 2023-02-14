import { Stack, Box, Typography } from "@mui/material";
import { useVotingDispatch, VotingActionType } from "../context";
import { Candidate } from "../votingExperience";
import CandidateMedia from "./candidateMedia";
import { VotingBar } from "./votingBar";

export const ComparativeCard = (props: {
  candidate: Candidate;
  height: string;
}) => {
  const votingDispatch = useVotingDispatch();
  // threshold: 0.9,

  return (
    <Stack spacing={1} sx={{ alignItems: "center" }}>
      <Box
        sx={{
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
        <Box
          sx={{
            flexGrow: 7,
          }}
        >
          {props.candidate.video ? (
            <CandidateMedia
              video={{
                threshold: 0.9,
                src: props.candidate.video,
              }}
            />
          ) : (
            <CandidateMedia image={{ src: props.candidate.image! }} />
          )}
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            alignItems: "center",
            display: "flex",
            paddingLeft: 1,
          }}
        >
          <Typography fontSize="12px" width="40vw">
            {props.candidate.name}
          </Typography>
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
