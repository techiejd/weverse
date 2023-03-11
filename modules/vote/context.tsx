import { createContext, useContext, Dispatch, useReducer } from "react";
import { z } from "zod";

const numVotesByCandidateId = z.record(z.number());
export type NumVotesByCandidateId = z.infer<typeof numVotesByCandidateId>;

const votingExperience = z.enum(["interests", "individual", "ranking"]);
export type VotingExperience = z.infer<typeof votingExperience>;

const ended = z.object({ votes: numVotesByCandidateId }).optional();
type Ended = z.infer<typeof ended>;

const voteState = z.object({
  votes: z.record(votingExperience, numVotesByCandidateId).optional(),
  ended: ended,
});
export type VoteState = z.infer<typeof voteState>;

export enum VoteActionType {
  expendedAllowance = "expendedAllowance",
  ended = "ended",
}

export type VoteAction = {
  type: VoteActionType;
  votingExperience?: VotingExperience;
  votes?: NumVotesByCandidateId;
  ended?: Ended;
};

const VoteContext = createContext<VoteState | undefined>(undefined);

const VoteDispatchContext = createContext<Dispatch<VoteAction> | undefined>(
  undefined
);

const voteReducer = (state: VoteState, action: VoteAction): VoteState => {
  switch (action.type) {
    case VoteActionType.expendedAllowance:
      const votingExperience = action.votingExperience!;
      return state.votes
        ? voteState.parse({
            ...state,
            votes: { ...state.votes, [votingExperience]: action.votes },
          })
        : voteState.parse({
            ...state,
            votes: { [votingExperience]: action.votes },
          });
    case VoteActionType.ended:
      return { ...state, ended: action.ended };
  }
};

const VoteProvider: React.FC<{
  children: JSX.Element;
}> = ({ children }) => {
  const [voteState, voteReduce] = useReducer(voteReducer, {});
  return (
    <VoteContext.Provider value={voteState}>
      <VoteDispatchContext.Provider value={voteReduce}>
        {children}
      </VoteDispatchContext.Provider>
    </VoteContext.Provider>
  );
};

export function useVoteState() {
  return useContext(VoteContext);
}

export function useVoteDispatch() {
  return useContext(VoteDispatchContext);
}

export default VoteProvider;
