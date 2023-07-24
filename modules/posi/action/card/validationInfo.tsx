import { Flaky, Verified } from "@mui/icons-material";
import { Avatar, Icon, Stack, Typography } from "@mui/material";
import { Validation } from "../../../../functions/shared/src";
import { useMaker } from "../../../../common/context/weverseUtils";
const ValidationInfo = ({ validated, validator: validatorId }: Validation) => {
  const [validator] = useMaker(validatorId);
  const ValidatedIcon = validated ? Verified : Flaky;
  const validationStatus = validated
    ? "Validado por:"
    : "En proceso de validación con:";
  return (
    <Stack spacing={1} sx={{ pt: 2 }}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Icon>
          <ValidatedIcon sx={{ color: "#179CF0" }} />
        </Icon>
        <Typography color="#7E7E7E" fontSize={13}>
          {validationStatus}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Avatar src={validator?.pic} sx={{ width: 18, height: 18 }} />
        <Typography fontSize={15} fontWeight={600} color="#615F5F">
          {validator?.name || "Espere un momento"}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default ValidationInfo;
