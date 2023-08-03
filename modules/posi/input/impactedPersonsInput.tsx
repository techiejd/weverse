import { Typography, TextField, Stack } from "@mui/material";
import { useFormData } from "./context";
import { useTranslations } from "next-intl";

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

  const inputTranslations = useTranslations("input");
  const impactedPersonsTranslations = useTranslations(
    "actions.upload.sections.impactedPersons"
  );

  return (
    <Stack spacing={2} margin={2} justifyContent={"space-between"}>
      <Typography>
        ({inputTranslations("numChars", { numChars: maxLength })})
      </Typography>
      <TextField
        fullWidth
        label={impactedPersonsTranslations("example")}
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
