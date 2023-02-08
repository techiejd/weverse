import { createContext, useContext, Dispatch, useReducer } from "react";

import { z } from "zod";

const numVotesByCandidateId = z.record(z.number());
export type NumVotesByCandidateId = z.infer<typeof numVotesByCandidateId>;

const votingExperience = z.enum(["interests", "individual", "ranking"]);
export type VotingExperience = z.infer<typeof votingExperience>;

const weRaceVoteState = z.object({
  votes: z.record(votingExperience, numVotesByCandidateId).optional(),
});
export type WeRaceVoteState = z.infer<typeof weRaceVoteState>;

export enum WeRaceVoteActionType {
  expendedAllowance = "expendedAllowance",
}

export type WeRaceVoteAction = {
  type: WeRaceVoteActionType;
  votingExperience: VotingExperience;
  votes: NumVotesByCandidateId;
};

const WeRaceVoteContext = createContext<WeRaceVoteState | undefined>(undefined);

const WeRaceVoteDispatchContext = createContext<
  Dispatch<WeRaceVoteAction> | undefined
>(undefined);

const weRaceReducer = (
  state: WeRaceVoteState,
  action: WeRaceVoteAction
): WeRaceVoteState => {
  console.log(action);
  return state.votes
    ? weRaceVoteState.parse({
        votes: { ...state.votes, [action.votingExperience]: action.votes },
      })
    : weRaceVoteState.parse({
        votes: { [action.votingExperience]: action.votes },
      });
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
