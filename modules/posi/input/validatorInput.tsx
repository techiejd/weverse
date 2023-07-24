import { Box, Typography, CardActionArea } from "@mui/material";
import { useEffect } from "react";
import ValidatorBadge from "../../../common/components/validatorBadge";
import { useMaker } from "../../../common/context/weverseUtils";
import { useFormData } from "./context";

const ValidatorInput = ({ incubator }: { incubator: string }) => {
  const [formData, setFormData] = useFormData();
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
    <CardActionArea href={`/makers/${validator?.id}`} disabled={!validator}>
      <Box sx={{ p: 2 }}>
        <Typography>
          Aviso: OneWe buscará la validación de tu incubadora.
        </Typography>

        <ValidatorBadge validator={validator} />
      </Box>
    </CardActionArea>
  );
};

export default ValidatorInput;
