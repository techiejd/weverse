import React, { createContext, useContext, useEffect, useReducer } from "react";
import {
  useHeaderState,
  useSetHeaderContext,
} from "../../../../common/context/header";

export enum VotingActionType {
  increment = "increment",
  decrement = "decrement",
}

export interface VotingAction {
  type: VotingActionType;
  candidateId: string;
}

export interface VotingState {
  allowance: number;
  allowanceMax: number;
  prepend: string;
  cost: number;
  numVotesByCandidateId: Record<string, number>;
}

const VotingContext = createContext<VotingState | undefined>(undefined);

const VotingDispatchContext = createContext<
  React.Dispatch<VotingAction> | undefined
>(undefined);

const VotingProvider: React.FC<{
  children: JSX.Element;
  initialState: VotingState;
}> = ({ children, initialState }) => {
  const setHeaderState = useSetHeaderContext();
  const headerState = useHeaderState();

  function voteReducer(state: VotingState, action: VotingAction) {
    let newNumVotes, newAllowance;
    console.log(state);
    switch (action.type) {
      case VotingActionType.increment: {
        if (state.allowance == 0) return state;
        newNumVotes = state.numVotesByCandidateId[action.candidateId]
          ? state.numVotesByCandidateId[action.candidateId] + 1
          : 1;
        newAllowance = state.allowance - state.cost;
        break;
      }
      case VotingActionType.decrement: {
        if (state.allowance == state.allowanceMax) return state;
        newNumVotes = state.numVotesByCandidateId[action.candidateId] - 1;
        newAllowance = state.allowance + state.cost;
        break;
      }
    }
    return {
      ...state,
      allowance: newAllowance,
      numVotesByCandidateId: {
        ...state.numVotesByCandidateId,
        [action.candidateId]: newNumVotes,
      },
    };
  }

  const [votingState, votingReducer] = useReducer(voteReducer, initialState);

  useEffect(() => {
    console.log("hello");
    if (setHeaderState) {
      console.log("there");
      setHeaderState({
        ...headerState,
        exchangeInfo: {
          prepend: votingState.prepend,
          allowance: String(votingState.allowance),
        },
      });
    }
  }, [setHeaderState, votingState]);

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
