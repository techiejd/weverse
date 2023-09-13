import { Box, Typography, CardActionArea } from "@mui/material";
import { useEffect, useState } from "react";
import ValidatorBadge, {
  ValidationProcessDialog,
} from "../../../common/components/validatorBadge";
import { useInitiative } from "../../../common/context/weverseUtils";
import { useFormData } from "./context";
import { useTranslations } from "next-intl";

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
  const [validator] = useInitiative(incubator);
  const t = useTranslations("actions.upload.sections.validator");
  return (
    <CardActionArea
      onClick={() => setValidationProcessDialogOpen(true)}
      disabled={!validator}
    >
      <Box sx={{ p: 2 }}>
        <Typography>{t("explanation")}</Typography>
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
