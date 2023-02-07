import { Box, Divider, Stack, Typography } from "@mui/material";
import { ComparativeCard } from "../../../../modules/weRace/v1/vote/components/votingExperience/candidate/comparativeCard";

const ExplanationBox = (props: { title: string; text: string }) => {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: "10px",
        }}
      >
        {props.title}
      </Typography>
      <Typography
        sx={{
          fontSize: "16px",
        }}
      >
        {props.text}
      </Typography>
    </Box>
  );
};

const Impact = () => {
  return (
    <Stack divider={<Divider flexItem />} sx={{ margin: 2 }} spacing={2}>
      <Box alignItems="center">
        <Typography
          sx={{
            fontSize: "34px",
          }}
          variant="h1"
        >
          Impact
        </Typography>
        <Typography variant="h2" sx={{ fontSize: "20px" }}>
          🏁 #3
        </Typography>
      </Box>
      <ComparativeCard height="406px" />
      <ExplanationBox title="📍 Ubicación" text="Quibdó, Chocó" />
      <ExplanationBox title="📸 Reportero" text="Carlos Mario" />
      <ExplanationBox
        title="✨ Áreas de impacto"
        text="Conservación - Igualdad de género - pobreza"
      />
    </Stack>
  );
};

export default Impact;
