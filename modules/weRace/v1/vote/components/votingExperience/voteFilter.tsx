import { Tab, Typography } from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import { Footer } from "../../../../../../common/components/footer";
import {
  useVotingDispatch,
  useVotingState,
  VotingActionType,
} from "../../context";

const VoteFilter = () => {
  const votingState = useVotingState();
  const votingDispatch = useVotingDispatch();

  const handleFilterChange = (event: SyntheticEvent, newValue: number) => {
    const convertTabValueToFilterState = (v: number) => v > 0;

    if (votingDispatch) {
      votingDispatch({
        type: VotingActionType.get,
        filteredOnMyVotes: convertTabValueToFilterState(newValue),
      });
    }
  };

  return (
    <Footer
      value={Number(
        votingState?.filteredOnMyVotes ? votingState.filteredOnMyVotes : 0
      )}
      handleChange={handleFilterChange}
    >
      <Tab icon={<Typography>🏁</Typography>} label="WeRace" />
      <Tab icon={<Typography>🗳️</Typography>} label="Mis Votos" />
    </Footer>
  );
};

export default VoteFilter;
