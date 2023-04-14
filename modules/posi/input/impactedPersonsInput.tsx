import { Typography, TextField, Stack } from "@mui/material";
import { ChangeEvent } from "react";
import { useFormData } from "./context";

const ImpactedPersonsInput = () => {
  const [formData, setFormData] = useFormData();
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
      <Typography variant="h3">
        ¿Cuántas personas fueron impactadas con tu proyecto?
      </Typography>
      <TextField
        required
        label="XXX personas"
        type="number"
        onChange={processNumImpacted}
        sx={{ width: 200 }}
        value={
          formData.impactedPeople?.amount ? formData.impactedPeople.amount : ""
        }
      />
      <Typography variant="h3">
        En una frase, ¿cómo podrías definir la población a la que ayudaste? (125
        caracteres)
      </Typography>
      <TextField
        required
        fullWidth
        label="Ej: La clase 2023 del colegio San Ignacio en el barrio Laureles."
        name="impactedPersons-identification"
        margin="normal"
        inputProps={{ maxLength: 125 }}
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
