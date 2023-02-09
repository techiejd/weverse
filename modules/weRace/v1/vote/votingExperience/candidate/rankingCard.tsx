import { Box, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import {
  useVotingDispatch,
  useVotingState,
  VotingActionType,
} from "../context";
import { Candidate } from "../votingExperience";
import CandidateVideo from "./candidateVideo";
import { VotingBar } from "./votingBar";

const CandidateRankingCard = (props: {
  candidate: Candidate;
  rank: number;
}) => {
  const votingDispatch = useVotingDispatch();
  const votingState = useVotingState();

  useEffect(() => {
    if (votingDispatch) {
      votingDispatch({
        type: VotingActionType.updateRank,
        candidateId: props.candidate.id,
        candidateRank: props.rank,
      });
    }
  }, [props.rank]);

  return (
    <Stack
      sx={{
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
          height: "72px",
          width: "100px",
        }}
      >
        <CandidateVideo threshold={0.2} src={props.candidate.video} />
      </Box>

      <Stack sx={{ alignItems: "center" }} flexGrow={1}>
        <Typography fontSize={"12px"}>{props.candidate.name}</Typography>
        <Typography>{props.candidate.sum}</Typography>
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
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        <Typography># {props.rank}</Typography>
        {votingState?.votes[props.candidate.id] && (
          <Typography sx={{ marginLeft: "auto" }}>🗳️</Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default CandidateRankingCard;
