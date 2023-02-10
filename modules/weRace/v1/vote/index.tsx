import { Box } from "@mui/material";
import { ref, set } from "firebase/database";
import { useCallback, useEffect } from "react";
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
      appState?.user == undefined &&
      setAppState
    ) {
      setAppState((a) =>
        a
          ? {
              ...a,
              requestLogIn: true,
            }
          : undefined
      );
    }
  }, [appState?.user, setAppState, voteState?.votes?.individual]);

  useEffect(() => {
    if (appState?.user && voteState?.votes?.interests) {
      set(
        ref(appState.db, `/users/${appState.user.id}/interests`),
        voteState?.votes?.interests
      );
    }
  }, [voteState?.votes?.interests, appState?.user, appState?.db]);

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
