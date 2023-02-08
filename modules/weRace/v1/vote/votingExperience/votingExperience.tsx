import { Stack } from "@mui/material";
import { PropsWithChildren } from "react";
import {
  NumVotesByCandidateId,
  VotingExperience as VotingExperienceNames,
} from "../context";
import FocusedCandidateDialog from "./candidate/focusedCandidateDialog";
import ExplainExchangeDialog, {
  SimpleEmojiProps,
} from "./components/explainExchangeDialog";
import { PillBoxMessage } from "./components/pillBoxMessage";
import VoteFilter from "./components/voteFilter";
import VotingProvider from "./context";

export type Candidate = { title: string; id: string };
export type CandidatesById = Record<string, Candidate>;

type VotingInfo = {
  allowance: number;
  allowanceMax: number;
  allowancePrepend: string;
  value: number;
  votes: NumVotesByCandidateId;
  candidates: CandidatesById;
  filteredOnMyVotes?: boolean;
  votingPrompt: string;
  votingPrepend: string;
  focusedCandidate?: string;
  experienceName: VotingExperienceNames;
};

export type VotingExperienceInfo = {
  explainExchangeDialog: {
    emoji: string;
    label: string;
    explanation: string;
    leftSide: SimpleEmojiProps;
    rightSide: SimpleEmojiProps;
  };
  votingInfo: VotingInfo;
};

const VotingPortal = (props: PropsWithChildren<VotingInfo>) => {
  return (
    <VotingProvider initialState={props}>
      <div>
        <FocusedCandidateDialog />
        <Stack mx={2} mb={1}>
          <PillBoxMessage>{props.votingPrompt}</PillBoxMessage>
          {props.children}
          <VoteFilter />
        </Stack>
      </div>
    </VotingProvider>
  );
};

const VotingExperience = (props: PropsWithChildren<VotingExperienceInfo>) => (
  <div>
    <ExplainExchangeDialog {...props.explainExchangeDialog} />
    <VotingPortal {...props.votingInfo}>{props.children}</VotingPortal>
  </div>
);

export default VotingExperience;
