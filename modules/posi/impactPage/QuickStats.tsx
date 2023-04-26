import { EmojiPeople } from "@mui/icons-material";
import { Stack, Icon, Typography } from "@mui/material";

const QuickStats = ({
  impactedPeopleAmount,
}: {
  impactedPeopleAmount: number;
}) => {
  return (
    <Stack direction={"row"} spacing={2}>
      <Icon>
        <EmojiPeople />
      </Icon>
      <Typography color={"grey"}>Impacto:</Typography>
      <Typography>{impactedPeopleAmount}</Typography>
    </Stack>
  );
};

export default QuickStats;
