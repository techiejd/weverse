export enum VotingActionType {
  increment = "increment",
  decrement = "decrement",
}

export interface VotingAction {
  type: VotingActionType;
  candidateId: String;
}

export interface VotingState {
  allowance: Number;
  incrementDisabled: boolean;
  prepend: String;
  step: number;
}

export class Manager {
  
}

export function voteReducer(state: VotingState, action: VotingAction) {
  switch (action.type) {
    case VotingActionType.increment: {
      break;
    }
    case VotingActionType.decrement: {
      break;
    }
  }
  return {
    ...state,
  };
}