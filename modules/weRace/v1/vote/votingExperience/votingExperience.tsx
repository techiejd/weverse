import { Stack } from "@mui/material";
import { PropsWithChildren } from "react";
import { z } from "zod";
import FocusedCandidateDialog from "./candidate/focusedCandidateDialog";
import ExplainExchangeDialog, {
  SimpleEmojiProps,
} from "./components/explainExchangeDialog";
import { PillBoxMessage } from "./components/pillBoxMessage";
import VoteFilter from "./components/voteFilter";
import VotingProvider, { VotingState } from "./context";

const reporter = z.enum(["Ana", "JD", "Carlos Mario", "Yuly Espitia", "Nico"]);
export type Reporter = z.infer<typeof reporter>;

const candidate = z.object({
  rank: z.number().optional(),
  name: z.string(),
  id: z.string(),
  video: z.string().optional(),
  image: z.string().optional(),
  summary: z.string().optional(),
  tags: z.string().optional(),
  location: z.string().optional(),
  sum: z.number().optional(),
  reporter: reporter.optional(),
});
export type Candidate = z.infer<typeof candidate>;

export const candidatesById = z.record(candidate);
export type CandidatesById = z.infer<typeof candidatesById>;

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
