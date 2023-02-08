import {
  SxProps,
  Stack,
  ButtonBase,
  Box,
  Typography,
  Theme,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  useVotingState,
  useVotingDispatch,
  VotingActionType,
} from "../context";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

export const VotingBar = ({
  candidateId,
  sx = [],
}: {
  candidateId: string;
  sx?: SxProps<Theme>;
}) => {
  const votingState = useVotingState();
  const votingDispatch = useVotingDispatch();
  const votingPrepend = votingState ? votingState.votingPrepend : "";

  const [count, setCount] = useState(
    votingState?.votes[candidateId] ? votingState?.votes[candidateId] : 0
  );
  const [disabledDecrement, setDisabledDecrement] = useState(count == 0);
  const [disabledIncrement, setDisabledIncrement] = useState(
    votingState?.allowance == 0
  );

  useEffect(() => {
    if (votingState?.votes[candidateId]) {
      setCount(votingState?.votes[candidateId]);
    } else {
      setCount(0);
    }
    //TODO(techiejd): Maybe use a reducer since count should not be captured.
  }, [votingState?.votes, votingState?.votes[candidateId], candidateId]);
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
              candidateId: candidateId,
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
              candidateId: candidateId,
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
