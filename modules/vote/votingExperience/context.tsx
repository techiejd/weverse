import { ref, runTransaction, onValue } from "firebase/database";

import {
  createContext,
  useReducer,
  useEffect,
  useContext,
  Dispatch,
} from "react";
import {
  NumVotesByCandidateId,
  useVoteDispatch,
  VotingExperience,
  VoteActionType,
} from "../context";
import { CandidatesById } from "./votingExperience";
import { useAppState } from "../../../common/context/appState";

export enum VotingActionType {
  vote = "vote",
  get = "get",
  updateSum = "updateSum",
  updateRank = "updateRank",
}

export type VotingAction = {
  type: VotingActionType;
  candidateId?: string;
  candidateSum?: number;
  candidateRank?: number;
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
  const appState = useAppState();

  const voteDispatch = useVoteDispatch();

  function voteReducer(state: VotingState, action: VotingAction): VotingState {
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

      case VotingActionType.updateSum: {
        return {
          ...state,
          candidates: {
            ...state.candidates,
            [action.candidateId!]: {
              ...state.candidates[action.candidateId!],
              sum: action.candidateSum!,
            },
          },
        };
      }
      case VotingActionType.updateRank: {
        //TODO(techiejd): Merge these last three updates together
        return {
          ...state,
          candidates: {
            ...state.candidates,
            [action.candidateId!]: {
              ...state.candidates[action.candidateId!],
              rank: action.candidateRank!,
            },
          },
        };
      }
    }
  }

  const [votingState, votingReducer]: [VotingState, Dispatch<VotingAction>] =
    useReducer<(state: VotingState, action: VotingAction) => VotingState>(
      voteReducer,
      initialState
    );

  useEffect(() => {
    if (votingState.allowance == 0 && voteDispatch) {
      voteDispatch({
        type: VoteActionType.expendedAllowance,
        votingExperience: votingState.experienceName,
        votes: votingState.votes,
      });
    }
  }, [
    votingState.votes,
    voteDispatch,
    votingState.allowance,
    votingState.experienceName,
  ]);

  useEffect(() => {
    if (votingState.experienceName == "ranking" && appState?.user) {
      // TODO(techiejd): Modularize the ranking logic
      Object.entries(votingState.votes).forEach(([candidateId, votes]) => {
        const candidateRef = ref(appState.db, `candidates/${candidateId}/`);
        runTransaction(candidateRef, (candidate) => {
          if (!candidate) {
            return {
              sum: votes,
              [`${appState.user?.id}`]: votes,
            };
          }
          const prevVotes = candidate[`${appState.user?.id}`]
            ? candidate[`${appState.user?.id}`]
            : 0;
          const newSum = candidate.sum - prevVotes + votes;
          return { sum: newSum, [`${appState.user?.id}`]: votes };
        });
      });
    }
  }, [votingState.votes, votingState.experienceName]);

  useEffect(() => {
    if (votingState.experienceName == "ranking" && appState) {
      Object.entries(votingState.candidates).forEach(([id, candidate]) => {
        const candidateSumRef = ref(appState.db, `candidates/${id}/sum`);
        onValue(candidateSumRef, (snapshot) => {
          const sum = snapshot.val() ? snapshot.val() : undefined;
          votingReducer({
            type: VotingActionType.updateSum,
            candidateId: id,
            candidateSum: sum,
          });
        });
      });
    }
  }, []);

  /** 
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
  */

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
