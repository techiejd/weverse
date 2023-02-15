import { createContext, useContext, Dispatch, useReducer } from "react";
import { z } from "zod";

const numVotesByCandidateId = z.record(z.number());
export type NumVotesByCandidateId = z.infer<typeof numVotesByCandidateId>;

const votingExperience = z.enum(["interests", "individual", "ranking"]);
export type VotingExperience = z.infer<typeof votingExperience>;

const ended = z.object({ votes: numVotesByCandidateId }).optional();
type Ended = z.infer<typeof ended>;

const weRaceVoteState = z.object({
  votes: z.record(votingExperience, numVotesByCandidateId).optional(),
  ended: ended,
});
export type WeRaceVoteState = z.infer<typeof weRaceVoteState>;

export enum WeRaceVoteActionType {
  expendedAllowance = "expendedAllowance",
  ended = "ended",
}

export type WeRaceVoteAction = {
  type: WeRaceVoteActionType;
  votingExperience?: VotingExperience;
  votes?: NumVotesByCandidateId;
  ended?: Ended;
};

const WeRaceVoteContext = createContext<WeRaceVoteState | undefined>(undefined);

const WeRaceVoteDispatchContext = createContext<
  Dispatch<WeRaceVoteAction> | undefined
>(undefined);

const weRaceReducer = (
  state: WeRaceVoteState,
  action: WeRaceVoteAction
): WeRaceVoteState => {
  switch (action.type) {
    case WeRaceVoteActionType.expendedAllowance:
      const votingExperience = action.votingExperience!;
      return state.votes
        ? weRaceVoteState.parse({
            ...state,
            votes: { ...state.votes, [votingExperience]: action.votes },
          })
        : weRaceVoteState.parse({
            ...state,
            votes: { [votingExperience]: action.votes },
          });
    case WeRaceVoteActionType.ended:
      return { ...state, ended: action.ended };
  }
};

const WeRaceVoteProvider: React.FC<{
  children: JSX.Element;
}> = ({ children }) => {
  const [weRaceVoteState, weRaceVoteReduce] = useReducer(weRaceReducer, {});
  return (
    <WeRaceVoteContext.Provider value={weRaceVoteState}>
      <WeRaceVoteDispatchContext.Provider value={weRaceVoteReduce}>
        {children}
      </WeRaceVoteDispatchContext.Provider>
    </WeRaceVoteContext.Provider>
  );
};

export function useWeRaceVoteState() {
  return useContext(WeRaceVoteContext);
}

export function useWeRaceVoteDispatch() {
  return useContext(WeRaceVoteDispatchContext);
}

export default WeRaceVoteProvider;
