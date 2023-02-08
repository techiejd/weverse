import { createContext, useReducer, useEffect, useContext } from "react";

// TODO(techiejd): Find out what can be modularized away from VotingExperience/ and into Vote/

export type WeRaceVoteState = {
  allowance: number;
  allowanceMax: number;
  allowancePrepend: string;
  cost: number;
  numVotesByCandidateId: Record<string, number>;
  votingPrepend: string;
  filteredOnMyVotes?: boolean;
  focusedCandidate?: string;
  candidates: CandidatesById;
};

const WeRaceVoteContext = createContext<WeRaceVoteState | undefined>(undefined);

const WeRaceVoteDispatchContext = createContext<
  React.Dispatch<VotingAction> | undefined
>(undefined);

const WeRaceVoteProvider: React.FC<{
  children: JSX.Element;
  initialState: WeRaceVoteState;
}> = ({ children, initialState }) => {
  return (
    <WeRaceVoteContext.Provider value={votingState}>
      <WeRaceVoteDispatchContext.Provider value={votingReducer}>
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
