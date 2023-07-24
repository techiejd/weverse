import { Flaky, Verified } from "@mui/icons-material";
import { Icon, Stack, Typography } from "@mui/material";
import { Validation } from "../../../../functions/shared/src";
import { useMaker } from "../../../../common/context/weverseUtils";
import ValidatorBadge from "../../../../common/components/validatorBadge";
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
      <ValidatorBadge validator={validator} />
    </Stack>
  );
};

export default ValidationInfo;
