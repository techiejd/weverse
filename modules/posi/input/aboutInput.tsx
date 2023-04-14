import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useFormData } from "./context";

const AboutInput = () => {
  const [aboutInput, setAboutInput] = useState("");
  const [formData, setFormData] = useFormData();
  useEffect(() => {
    if (setFormData) {
      setFormData((fD) => ({
        ...fD,
        about: aboutInput,
      }));
    }
  }, [aboutInput, setFormData]);
  return (
    <TextField
      fullWidth
      label="Resumen (1000 caracteres)"
      name="summary"
      multiline
      minRows={3}
      inputProps={{ maxLength: 1000 }}
      helperText="Es aquí donde puedes dar todos los detalles que quieras sobre tu proyecto."
      value={aboutInput}
      onChange={(e) => setAboutInput(e.target.value)}
    />
  );
};

export default AboutInput;
