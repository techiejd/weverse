import { Box } from "@mui/material";
import { useEffect } from "react";
import {
  useAppState,
  useSetAppState,
} from "../../../../common/context/appState";
import { useWeRaceVoteState } from "./context";
import IndividualVoting from "./individual";
import InterestsVoting from "./interests";
import RankingVoting from "./ranking";

const ImpactsVoting = () => {
  const voteState = useWeRaceVoteState();
  const appState = useAppState();
  const setAppState = useSetAppState();

  useEffect(() => {
    if (
      voteState?.votes?.individual &&
      appState &&
      appState?.user == undefined &&
      setAppState
    ) {
      setAppState({
        ...appState,
        requestLogIn: true,
      });
    }
  }, [voteState?.votes?.individual, appState, setAppState]);

  return (
    <Box>
      {voteState?.votes?.individual && appState?.user ? (
        <RankingVoting votes={voteState.votes.individual} />
      ) : (
        <IndividualVoting />
      )}
    </Box>
  );
};

const WeRaceVote = () => {
  const voteState = useWeRaceVoteState();
  return (
    <Box>
      {voteState?.votes?.interests ? <ImpactsVoting /> : <InterestsVoting />}
    </Box>
  );
};

export default WeRaceVote;
