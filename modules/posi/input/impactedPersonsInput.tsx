import { Typography, TextField, Stack } from "@mui/material";
import { ChangeEvent } from "react";
import { useFormData } from "./context";

const ImpactedPersonsInput = () => {
  const [formData, setFormData] = useFormData();
  const maxLength = 200;
  const processNumImpacted = (e: ChangeEvent<HTMLInputElement>) => {
    const result = e.target.value.replace(/\D/g, "");

    if (setFormData) {
      setFormData((fD) => ({
        ...fD,
        impactedPeople: {
          ...fD.impactedPeople,
          amount: Number(result),
        },
      }));
    }
  };

  const setHowToId = (input: string) => {
    if (setFormData) {
      setFormData((fD) => ({
        ...fD,
        impactedPeople: {
          ...fD.impactedPeople,
          howToIdentify: input,
        },
      }));
    }
  };

  return (
    <Stack spacing={2} margin={2} justifyContent={"space-between"}>
      <Typography>({`${maxLength}`} caracteres)</Typography>
      <TextField
        required
        fullWidth
        label="Ej: La clase 2023 del colegio San Ignacio en el barrio Laureles."
        name="impactedPersons-identification"
        margin="normal"
        inputProps={{ maxLength: maxLength }}
        value={
          formData.impactedPeople?.howToIdentify
            ? formData.impactedPeople.howToIdentify
            : ""
        }
        onChange={(e) => {
          setHowToId(e.target.value);
        }}
      />
    </Stack>
  );
};

export default ImpactedPersonsInput;
