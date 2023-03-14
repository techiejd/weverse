import { Box } from "@mui/material";
import { get, onValue, ref, set } from "firebase/database";
import { useEffect } from "react";
import { z } from "zod";
import { useVoteDispatch, useVoteState, VoteActionType } from "./context";
import Finale from "./finale";
import IndividualVoting from "./individual";
import InterestsVoting from "./interests";
import RankingVoting from "./ranking";
import { useAppState, useSetAppState } from "../../common/context/appState";
import { logger } from "../../common/utils/logger";

const ImpactsVoting = () => {
  const voteState = useVoteState();
  const appState = useAppState();

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

const Vote = () => {
  const voteState = useVoteState();
  const voteDispatch = useVoteDispatch();
  const appState = useAppState();

  useEffect(() => {
    if (appState) {
      const endedRef = ref(appState.db, "ended");
      onValue(endedRef, (snapshot) => {
        const ended = snapshot.val() ? snapshot.val() : undefined;
        if (voteDispatch) {
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
            voteDispatch({
              type: VoteActionType.ended,
              ended: ended ? { votes: votes } : undefined,
            });
          });
        }
      });
    }
  }, [appState, voteDispatch]);

  return (
    <Box>
      {voteState?.votes?.interests ? (
        voteState?.ended ? (
          // This should be vote/ after finish
          <Finale />
        ) : (
          // This should be vote/ before finish
          <ImpactsVoting />
        )
      ) : (
        // This should be registration/interests
        <InterestsVoting />
      )}
    </Box>
  );
};

export default Vote;
