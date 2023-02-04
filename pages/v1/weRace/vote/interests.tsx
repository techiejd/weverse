import { Grid, Stack } from "@mui/material";
import { useState } from "react";
import { CandidateBox } from "../../../../modules/weRace/v1/vote/components/candidateBox";
import ExplainExchangeDialog from "../../../../modules/weRace/v1/vote/components/explainExchangeDialog";
import { PillBoxMessage } from "../../../../modules/weRace/v1/vote/components/pillBoxMessage";
import VotingProvider from "../../../../modules/weRace/v1/vote/context";

const WeRace = () => {
  const [isExplanationOpened, setIsExplanationOpened] = useState(true);
  const closeExplanation = () => setIsExplanationOpened(false);
  return (
    <div>
      <ExplainExchangeDialog
        open={isExplanationOpened}
        onClose={closeExplanation}
        emoji="❤️‍🔥"
        label="Escoges tus intereses"
        explanation="Elige tus intereses para mostrarte los impactos sociales que a ti te
  mueven"
        leftSide={{ emoji: "❤️‍🔥", label: "1 Interes" }}
        rightSide={{ emoji: "🎯", label: "1 Elección" }}
      />
      <VotingProvider
        initialState={Object({
          allowance: 5,
          incrementDisabled: false,
          prepend: "❤️‍🔥",
          step: 1,
          numVotesByCandidateId: {},
        })}
      >
        <Stack mx={2} mb={1}>
          <PillBoxMessage>
            Vota 🗳️ impactos sociales de tu interés.
          </PillBoxMessage>
          <Grid container spacing={1}>
            {Array(32)
              .fill(0)
              .map((el, i) => (
                <Grid item sm={6} md={4} lg={2} xl={1} key={i}>
                  <CandidateBox mediaTitle="Candidate Title" height="277px" />
                </Grid>
              ))}
          </Grid>
        </Stack>
      </VotingProvider>
    </div>
  );
};

export default WeRace;
