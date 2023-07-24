import { Avatar, Stack, Typography } from "@mui/material";
import { Maker } from "../../functions/shared/src";

const ValidatorBadge = ({ validator }: { validator?: Maker }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Avatar src={validator?.pic} sx={{ width: 18, height: 18 }} />
      <Typography fontSize={15} fontWeight={600} color="#615F5F">
        {validator?.name || "Espere un momento"}
      </Typography>
    </Stack>
  );
};

export default ValidatorBadge;
