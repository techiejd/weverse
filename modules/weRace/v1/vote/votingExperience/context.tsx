import {
  getDatabase,
  connectDatabaseEmulator,
  ref,
  runTransaction,
  onValue,
} from "firebase/database";

import { initializeApp } from "firebase/app";

import {
  createContext,
  useReducer,
  useEffect,
  useContext,
  Dispatch,
} from "react";
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

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_REACT_APP_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_REACT_APP_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_REACT_APP_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_REACT_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
connectDatabaseEmulator(db, "localhost", 9000);

export enum VotingActionType {
  vote = "vote",
  get = "get",
  updateSum = "updateSum",
}

export type VotingAction = {
  type: VotingActionType;
  candidateId?: string;
  candidateSum?: number;
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
  //TODO(techijd): Move this header stuff out of here and into WeRaceVote
  const setHeaderState = useSetHeaderContext();
  const headerState = useHeaderState();

  const weRaceVoteDispatch = useWeRaceVoteDispatch();

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
        console.log("Updaing sum");
        console.log({
          ...state,
          candidates: {
            ...state.candidates,
            [action.candidateId!]: {
              ...state.candidates[action.candidateId!],
              sum: action.candidateSum!,
            },
          },
        });
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
    }
  }

  const [votingState, votingReducer]: [VotingState, Dispatch<VotingAction>] =
    useReducer<(state: VotingState, action: VotingAction) => VotingState>(
      voteReducer,
      initialState
    );

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
    console.log("In here!");
    if (votingState.experienceName == "ranking") {
      console.log("Hereee tooo");
      Object.entries(votingState.votes).forEach(([candidateId, votes]) => {
        const candidateRef = ref(db, `/${candidateId}/`);
        runTransaction(candidateRef, (candidate) => {
          return {
            sum: votes,
            jd: votes,
          };
        });
      });
    }
  }, [votingState.votes, votingState.experienceName]);

  useEffect(() => {
    console.log("Is there a change?");
    if (votingState.experienceName == "ranking") {
      Object.entries(votingState.candidates).forEach(([id, candidate]) => {
        console.log(candidate);
        const candidateSumRef = ref(db, `/${id}/sum`);
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

  /**useEffect(() => {
    if (initialState.experienceName == "ranking") {
      Object.entries(initialState.votes).forEach(([candidateId, votes]) => {
        const candidateRef = ref(db, `/${candidateId}/`);
        runTransaction(candidateRef, (candidate) => {
          return {
            sum: votes,
            jd: votes,
          };
        });
      });
    }
  });*/

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
