import { Box, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useFormData } from "./context";

const SummaryInput = () => {
  const [formData, setFormData] = useFormData();
  const setSummaryInput = (summary: string) => {
    if (setFormData) {
      setFormData((fD) => {
        return { ...fD, summary: summary };
      });
    }
  };

  return (
    <Box>
      <Typography>(100 caracteres)</Typography>
      <TextField
        required
        fullWidth
        label="Resume la acción social."
        name="title"
        margin="normal"
        inputProps={{ maxLength: 100 }}
        value={formData.summary ? formData.summary : ""}
        onChange={(e) => {
          setSummaryInput(e.target.value);
        }}
      />
    </Box>
  );
};

export default SummaryInput;
