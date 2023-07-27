import { Box, Typography, CardActionArea } from "@mui/material";
import { useEffect, useState } from "react";
import ValidatorBadge, {
  ValidationProcessDialog,
} from "../../../common/components/validatorBadge";
import { useMaker } from "../../../common/context/weverseUtils";
import { useFormData } from "./context";

const ValidatorInput = ({ incubator }: { incubator: string }) => {
  const [formData, setFormData] = useFormData();
  const [validationProcessDialogOpen, setValidationProcessDialogOpen] =
    useState(false);
  useEffect(() => {
    if (setFormData) {
      setFormData((fD) => ({
        ...fD,
        validation: { validated: false, validator: incubator },
      }));
    }
  }, [incubator, setFormData]);
  const [validator] = useMaker(incubator);
  return (
    <CardActionArea
      onClick={() => setValidationProcessDialogOpen(true)}
      disabled={!validator}
    >
      <Box sx={{ p: 2 }}>
        <Typography>
          Aviso: OneWe buscará la validación de tu incubadora.
        </Typography>
        <ValidationProcessDialog
          open={validationProcessDialogOpen}
          setOpen={setValidationProcessDialogOpen}
          validator={validator}
        />
        <ValidatorBadge validator={validator} />
      </Box>
    </CardActionArea>
  );
};

export default ValidatorInput;
