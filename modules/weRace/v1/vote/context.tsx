import React, { createContext, useContext, useReducer } from "react";

export enum VotingActionType {
  increment = "increment",
  decrement = "decrement",
}

export interface VotingAction {
  type: VotingActionType;
  candidateId: string;
}

export interface VotingState {
  allowance: Number;
  incrementDisabled: boolean;
  prepend: String;
  step: number;
  numVotesByCandidateId: Record<string, number>;
}

export function voteReducer(state: VotingState, action: VotingAction) {
  switch (action.type) {
    case VotingActionType.increment: {
      const newNumVotes = state.numVotesByCandidateId[action.candidateId]
        ? state.numVotesByCandidateId[action.candidateId] + 1
        : 1;
      return {
        ...state,
        numVotesByCandidateId: {
          ...state.numVotesByCandidateId,
          [action.candidateId]: newNumVotes,
        },
      };
    }
    case VotingActionType.decrement: {
      const newNumVotes = state.numVotesByCandidateId[action.candidateId] - 1;
      return {
        ...state,
        numVotesByCandidateId: {
          ...state.numVotesByCandidateId,
          [action.candidateId]: newNumVotes,
        },
      };
    }
  }
}

const VotingContext = createContext<VotingState | undefined>(undefined);

const VotingDispatchContext = createContext<
  React.Dispatch<VotingAction> | undefined
>(undefined);

const VotingProvider: React.FC<{
  children: JSX.Element;
  initialState: VotingState;
}> = ({ children, initialState }) => {
  const [votingState, votingReducer] = useReducer(voteReducer, initialState);
  return (
    <VotingContext.Provider value={votingState}>
      <VotingDispatchContext.Provider value={votingReducer}>
        {children}
      </VotingDispatchContext.Provider>
    </VotingContext.Provider>
  );
};

export function useVotingState() {
  return useContext(VotingContext);
}

export function useVotingDispatch() {
  return useContext(VotingDispatchContext);
}

export default VotingProvider;
