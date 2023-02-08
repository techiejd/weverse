import { createContext, useReducer, useEffect, useContext } from "react";
import {
  useSetHeaderContext,
  useHeaderState,
} from "../../../../../common/context/header";
import {
  NumVotesByCandidateId,
  useWeRaceVoteDispatch,
  VotingExperience,
  WeRaceVoteActionType,
} from "../context";
import { CandidatesById } from "./votingExperience";

export enum VotingActionType {
  vote = "vote",
  get = "get",
}

export type VotingAction = {
  type: VotingActionType;
  candidateId?: string;
  filteredOnMyVotes?: boolean;
  voteDirection?: "increment" | "decrement";
};

export type VotingState = {
  allowance: number;
  allowanceMax: number;
  allowancePrepend: string;
  value: number;
  votes: NumVotesByCandidateId;
  votingPrepend: string;
  filteredOnMyVotes?: boolean;
  focusedCandidate?: string;
  candidates: CandidatesById;
  experienceName: VotingExperience;
};

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

  const weRaceVoteDispatch = useWeRaceVoteDispatch();

  function voteReducer(state: VotingState, action: VotingAction) {
    switch (action.type) {
      case VotingActionType.vote: {
        let newNumVotes: number, newAllowance: number;
        switch (action.voteDirection!) {
          case "increment": {
            if (state.allowance == 0) return state;
            newNumVotes = state.votes[action.candidateId!]
              ? state.votes[action.candidateId!] + 1
              : 1;
            newAllowance = state.allowance - state.value;
            break;
          }
          case "decrement": {
            if (state.allowance == state.allowanceMax) return state;
            newNumVotes = state.votes[action.candidateId!] - 1;
            newAllowance = state.allowance + state.value;
            break;
          }
        }

        return {
          ...state,
          allowance: newAllowance,
          votes: {
            ...state.votes,
            [action.candidateId!]: newNumVotes,
          },
        };
      }
      case VotingActionType.get: {
        return {
          ...state,
          focusedCandidate: action.candidateId,
          filteredOnMyVotes: action.filteredOnMyVotes,
        };
      }
    }
  }

  const [votingState, votingReducer] = useReducer(voteReducer, initialState);

  useEffect(() => {
    if (votingState.allowance == 0 && weRaceVoteDispatch) {
      weRaceVoteDispatch({
        type: WeRaceVoteActionType.expendedAllowance,
        votingExperience: votingState.experienceName,
        votes: votingState.votes,
      });
    }
  }, [
    votingState.votes,
    weRaceVoteDispatch,
    votingState.allowance,
    votingState.experienceName,
  ]);

  useEffect(() => {
    if (setHeaderState) {
      setHeaderState({
        ...headerState,
        exchangeInfo: {
          allowancePrepend: votingState.allowancePrepend,
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
