import React, { useReducer } from "react";
import { Grid, Paper, Stack } from "@mui/material";
import { voteReducer } from "../../modules/weRace/v1/vote/reducer";
import VotingCard from "../../modules/weRace/v1/vote/components/votingCard";

const VotingPortal = () => {
  const [votingState, votingDispatch] = useReducer(voteReducer, {
    prepend: "⚡WEEN",
    incrementDisabled: false,
    allowance: 100,
    step: 1,
  });
  return (
    <Stack
      direction="column"
      sx={{
        height: "100vh",
      }}
    >
      {Array.from({ length: 20 }, (_, index) => (
        <Stack direction="row" sx={{ width: "100vw" }}>
          <VotingCard
            votingState={votingState}
            voteDispatch={votingDispatch}
          ></VotingCard>
          <VotingCard
            votingState={votingState}
            voteDispatch={votingDispatch}
          ></VotingCard>
        </Stack>
      ))}
    </Stack>
  );
};

export default VotingPortal;
