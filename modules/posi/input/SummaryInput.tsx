import { TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useFormData } from "./context";

const SummaryInput = () => {
  const [summaryInput, setSummaryInput] = useState("");
  const [formData, setFormData] = useFormData();
  useEffect(() => {
    if (setFormData) {
      setFormData((fD) => {
        return { ...fD, summary: summaryInput };
      });
    }
  }, [summaryInput, setFormData]);
  return (
    <TextField
      required
      fullWidth
      label="Resume la acción social en 100 caracteres."
      name="title"
      margin="normal"
      inputProps={{ maxLength: 100 }}
      value={summaryInput}
      onChange={(e) => {
        setSummaryInput(e.target.value);
      }}
    />
  );
};

export default SummaryInput;
