import { Stack } from "@mui/material";
import { PropsWithChildren } from "react";
import FocusedCandidateDialog from "./candidate/focusedCandidateDialog";
import ExplainExchangeDialog, {
  SimpleEmojiProps,
} from "./components/explainExchangeDialog";
import { PillBoxMessage } from "./components/pillBoxMessage";
import VoteFilter from "./components/voteFilter";
import VotingProvider, { VotingState } from "./context";

export type Candidate = {
  rank?: number;
  name: string;
  id: string;
  video: string;
  summary?: string;
  tags?: string;
  location?: string;
  sum?: number;
  reporter?: "Ana" | "JD";
};

export type CandidatesById = Record<string, Candidate>;

export type VotingExperienceInfo = {
  explainExchange: {
    dialog: {
      emoji: string;
      label: string;
      explanation: string;
      leftSide: SimpleEmojiProps;
      rightSide: SimpleEmojiProps;
    };
    prompt: string;
  };
  votingState: VotingState;
};

const VotingPortal = (props: PropsWithChildren<VotingState>) => {
  return (
    <VotingProvider initialState={props}>
      <div>
        <FocusedCandidateDialog />
        <Stack mx={2} mb={1}>
          {props.children}
          <VoteFilter />
        </Stack>
      </div>
    </VotingProvider>
  );
};

const VotingExperience = (props: PropsWithChildren<VotingExperienceInfo>) => (
  <div>
    <ExplainExchangeDialog {...props.explainExchange.dialog} />
    <VotingPortal {...props.votingState}>
      <PillBoxMessage>{props.explainExchange.prompt}</PillBoxMessage>
      {props.children}
    </VotingPortal>
  </div>
);

export default VotingExperience;
