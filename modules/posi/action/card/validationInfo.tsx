import { Flaky, Verified } from "@mui/icons-material";
import { CardActionArea, Icon, Stack, Typography } from "@mui/material";
import { Validation } from "../../../../functions/shared/src";
import { useMaker } from "../../../../common/context/weverseUtils";
import ValidatorBadge, {
  ValidationProcessDialog,
} from "../../../../common/components/validatorBadge";
import { useState } from "react";
const ValidationInfo = ({ validated, validator: validatorId }: Validation) => {
  const [validator] = useMaker(validatorId);
  const ValidatedIcon = validated ? Verified : Flaky;
  const validationStatus = validated
    ? "Validado por:"
    : "En proceso de validación con:";
  const [validationProcessDialogOpen, setValidationProcessDialogOpen] =
    useState(false);
  return (
    <CardActionArea
      onClick={(e) => {
        setValidationProcessDialogOpen(true);
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <ValidationProcessDialog
        open={validationProcessDialogOpen}
        setOpen={setValidationProcessDialogOpen}
        validator={validator}
      />
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
    </CardActionArea>
  );
};

export default ValidationInfo;
