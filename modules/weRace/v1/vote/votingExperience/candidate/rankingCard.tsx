import { Box, Divider, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import {
  useVotingDispatch,
  useVotingState,
  VotingActionType,
} from "../context";
import { Candidate } from "../votingExperience";
import CandidateMedia from "./candidateMedia";
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
      divider={<Divider />}
    >
      <Box flexGrow={1}>
        <Box
          sx={{
            height: "72px",
            width: "100px",
          }}
        >
          <CandidateMedia
            video={{ threshold: 0.2, src: props.candidate.video! }}
          />
        </Box>
      </Box>
      <Stack
        sx={{
          alignItems: "center",
          textOverflow: "ellipsis",
          overflow: "hidden",
          minWidth: "0px",
          width: "100%",
        }}
        flexGrow={2}
      >
        <Typography fontSize={"12px"} alignSelf={"start"}>
          {props.candidate.name}
        </Typography>
        <Typography>{props.candidate.sum}</Typography>
        <VotingBar
          sx={{
            height: "20px",
            width: "104px",
          }}
          candidateId={props.candidate.id}
        ></VotingBar>
      </Stack>

      <Box>
        <Stack
          sx={{
            height: "100%",
            justifyContent: "space-between",
            alignItems: "end",
            overflow: "hidden",
          }}
          flexGrow={1}
        >
          <Typography noWrap># {props.rank}</Typography>
          {votingState?.votes[props.candidate.id] && (
            <Typography sx={{ marginLeft: "auto" }}>🗳️</Typography>
          )}
        </Stack>
      </Box>
    </Stack>
  );
};

export default CandidateRankingCard;
