import { Tab, Typography } from "@mui/material";
import { SyntheticEvent } from "react";
import {
  useVotingState,
  useVotingDispatch,
  VotingActionType,
} from "../context";
import { Footer } from "../../../../common/components/footer";

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
