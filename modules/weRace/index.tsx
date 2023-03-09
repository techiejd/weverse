import { Box } from "@mui/material";
import { get, onValue, ref, set } from "firebase/database";
import { useEffect } from "react";
import { z } from "zod";
import {
  useWeRaceVoteDispatch,
  useWeRaceVoteState,
  WeRaceVoteActionType,
} from "./context";
import Finale from "./finale";
import IndividualVoting from "./individual";
import InterestsVoting from "./interests";
import RankingVoting from "./ranking";
import { useAppState, useSetAppState } from "../../common/context/appState";

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

const dBcandidates = z.record(z.object({ sum: z.number() }));

const WeRaceVote = () => {
  const voteState = useWeRaceVoteState();
  const weRaceVoteDispatch = useWeRaceVoteDispatch();
  const appState = useAppState();

  useEffect(() => {
    if (appState) {
      const endedRef = ref(appState.db, "ended");
      onValue(endedRef, (snapshot) => {
        const ended = snapshot.val() ? snapshot.val() : undefined;
        if (weRaceVoteDispatch) {
          const candidatesRef = ref(appState.db, "candidates");
          get(candidatesRef).then((snapshot) => {
            const candidatesNestedSum = dBcandidates.parse(snapshot.val());
            const votes = Object.entries(candidatesNestedSum).reduce(
              (acc, currCan) => {
                logger.info(acc);
                return { ...acc, [currCan[0]]: currCan[1].sum };
              },
              {}
            );
            weRaceVoteDispatch({
              type: WeRaceVoteActionType.ended,
              ended: ended ? { votes: votes } : undefined,
            });
          });
        }
      });
    }
  }, [appState, weRaceVoteDispatch]);

  return (
    <Box>
      {voteState?.votes?.interests ? (
        voteState?.ended ? (
          <Finale />
        ) : (
          <ImpactsVoting />
        )
      ) : (
        <InterestsVoting />
      )}
    </Box>
  );
};

export default WeRaceVote;
