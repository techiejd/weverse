import { EmojiPeople, Timer } from "@mui/icons-material";
import { Stack, Icon, Typography, Box } from "@mui/material";
import { InvestedTimeLevel, levelToColors } from "../input/context";

const QuickStats = ({
  impactedPeopleAmount,
  investedTimeLevel,
}: {
  impactedPeopleAmount: number;
  investedTimeLevel: InvestedTimeLevel;
}) => {
  return (
    <Stack>
      <Stack direction={"row"} spacing={2}>
        <Icon>
          <EmojiPeople />
        </Icon>
        <Typography color={"grey"}>Impacto:</Typography>
        <Typography>{impactedPeopleAmount}</Typography>
      </Stack>
      <Stack direction={"row"}>
        <Icon sx={{ mr: 2 }}>
          <Timer />
        </Icon>
        <Typography color={"grey"} width={"250px"}>
          Tiempo invertido:
        </Typography>
        <Box
          sx={{
            backgroundColor: levelToColors[investedTimeLevel],
            width: investedTimeLevel / InvestedTimeLevel.year,
          }}
        ></Box>
        <Box
          sx={{
            backgroundColor: "grey",
            width: 1 - investedTimeLevel / InvestedTimeLevel.year,
          }}
        ></Box>
      </Stack>
    </Stack>
  );
};

export default QuickStats;
