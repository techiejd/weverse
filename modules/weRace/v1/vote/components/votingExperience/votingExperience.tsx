import { Stack } from "@mui/material";
import { PropsWithChildren } from "react";
import VotingProvider from "../../context";
import ExplainExchangeDialog, {
  SimpleEmojiProps,
} from "./explainExchangeDialog";
import { PillBoxMessage } from "./pillBoxMessage";

type VotingInfo = {
  allowance: number;
  allowanceMax: number;
  allowancePrepend: string;
  cost: number;
  numVotesByCandidateId: Record<string, number>;
  candidates: [{ mediaTitle: string }];
  votingPrompt: string;
  votingPrepend: string;
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

const VotingPortal = (props: PropsWithChildren<VotingInfo>) => (
  <VotingProvider initialState={props}>
    <Stack mx={2} mb={1}>
      <PillBoxMessage>{props.votingPrompt}</PillBoxMessage>
      {props.children}
    </Stack>
  </VotingProvider>
);

const VotingExperience = (props: PropsWithChildren<VotingExperienceInfo>) => (
  <div>
    <ExplainExchangeDialog {...props.explainExchangeDialog} />
    <VotingPortal {...props.votingInfo}>{props.children}</VotingPortal>
  </div>
);

export default VotingExperience;
