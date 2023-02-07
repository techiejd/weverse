import {
  Box,
  ButtonBase,
  Stack,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import {
  useVotingDispatch,
  useVotingState,
  VotingActionType,
} from "../../../context";

export const VotingBar = ({ sx = [] }: { sx?: SxProps<Theme> }) => {
  const id: string = "TRUST";
  const votingState = useVotingState();
  const votingDispatch = useVotingDispatch();
  const votingPrepend = votingState ? votingState.votingPrepend : "";

  const [count, setCount] = useState(
    votingState?.numVotesByCandidateId[id]
      ? votingState?.numVotesByCandidateId[id]
      : 0
  );
  const [disabledDecrement, setDisabledDecrement] = useState(count == 0);
  const [disabledIncrement, setDisabledIncrement] = useState(
    votingState?.allowance == 0
  );

  useEffect(() => {
    if (
      votingState?.numVotesByCandidateId &&
      votingState?.numVotesByCandidateId[id] != count
    ) {
      setCount(votingState?.numVotesByCandidateId[id]);
    }
  }, [
    count,
    votingState?.numVotesByCandidateId,
    votingState?.numVotesByCandidateId[id],
  ]);
  useEffect(() => {
    setDisabledIncrement(votingState?.allowance == 0);
  }, [votingState?.allowance]);
  useEffect(() => {
    setDisabledDecrement(count == 0);
  }, [count]);

  return (
    <Stack
      sx={[
        {
          backgroundColor: "red",
          borderRadius: 4,
          overflow: "hidden",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      direction="row"
      onClick={(e) => e.stopPropagation()}
    >
      <ButtonBase
        sx={{
          backgroundColor: "green",
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => {
          if (votingDispatch) {
            votingDispatch({
              type: VotingActionType.vote,
              candidateId: id,
              voteDirection: "decrement",
            });
          }
        }}
        disabled={disabledDecrement}
      >
        <RemoveIcon sx={{ fontSize: "21px" }}></RemoveIcon>
      </ButtonBase>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: "14px" }}>
          {votingPrepend} {count}
        </Typography>
      </Box>
      <ButtonBase
        sx={{
          backgroundColor: "yellow",
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => {
          if (votingDispatch) {
            votingDispatch({
              type: VotingActionType.vote,
              candidateId: id,
              voteDirection: "increment",
            });
          }
        }}
        disabled={disabledIncrement}
      >
        <AddIcon sx={{ fontSize: "21px" }}></AddIcon>
      </ButtonBase>
    </Stack>
  );
};
