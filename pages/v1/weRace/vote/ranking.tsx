import { Box, Stack, Typography } from "@mui/material";
import { PillBoxMessage } from "../../../../modules/weRace/v1/vote/components/pillBoxMessage";
import { VotingBar } from "../../../../modules/weRace/v1/vote/components/votingBar";

const CandidateRankingCard = () => {
  return (
    <Stack
      sx={{
        backgroundColor: "red",
        height: 88,
        marginLeft: 2,
        marginRight: 2,
        marginTop: 1,
        marginBottom: 1,
        p: 1,
        alignItems: "center",
        justifyContent: "space-between",
      }}
      direction="row"
      spacing={1}
    >
      <Box
        sx={{
          backgroundColor: "green",
          height: "72px",
          width: "100px",
        }}
      ></Box>
      <Stack
        sx={{ backgroundColor: "yellow", alignItems: "center" }}
        flexGrow={1}
      >
        <Typography>Impact</Typography>
        <Typography>1234 Votes</Typography>
        <VotingBar
          sx={{
            height: "20px",
            width: "104px",
          }}
        ></VotingBar>
      </Stack>
      <Stack
        sx={{
          backgroundColor: "blue",
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        <Typography># 11234</Typography>
        <Typography sx={{ marginLeft: "auto" }}>🗳️</Typography>
      </Stack>
    </Stack>
  );
};

const WeRank = () => {
  return (
    <Stack>
      <PillBoxMessage>
        Revisa el ranking y decide si cambiar tus votos.
      </PillBoxMessage>
      {Array(32)
        .fill(0)
        .map((el, i) => (
          <CandidateRankingCard key={i} />
        ))}
    </Stack>
  );
};

export default WeRank;
