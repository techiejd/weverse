import { Typography, TextField, Stack } from "@mui/material";
import { useFormData } from "./context";

const ImpactedPersonsInput = () => {
  const [formData, setFormData] = useFormData();
  const maxLength = 200;

  const setHowToId = (input: string) => {
    if (setFormData) {
      setFormData((fD) => {
        if (input == "") {
          const { howToIdentifyImpactedPeople, ...others } = fD;
          return others;
        }
        return {
          ...fD,
          howToIdentifyImpactedPeople: input,
        };
      });
    }
  };

  return (
    <Stack spacing={2} margin={2} justifyContent={"space-between"}>
      <Typography>({`${maxLength}`} caracteres)</Typography>
      <TextField
        fullWidth
        label="Ej: La clase 2023 del colegio San Ignacio en el barrio Laureles."
        name="impactedPersons-identification"
        margin="normal"
        inputProps={{ maxLength: maxLength }}
        value={
          formData.howToIdentifyImpactedPeople
            ? formData.howToIdentifyImpactedPeople
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
