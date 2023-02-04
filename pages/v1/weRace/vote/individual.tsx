import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import { CandidateBox } from "../../../../modules/weRace/v1/vote/components/candidateBox";
import { PillBoxMessage } from "../../../../modules/weRace/v1/vote/components/pillBoxMessage";

const WeRace = () => {
  return (
    <Stack mx={2} mb={1}>
      <PillBoxMessage>Vota 🗳️ impactos sociales de tu interés.</PillBoxMessage>
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
  );
};

export default WeRace;
