import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useFormData } from "./context";

const HowToSupportInput = () => {
  const [supportInput, setSupportInput] = useState("");
  const [formData, setFormData] = useFormData();
  useEffect(() => {
    if (setFormData) {
      setFormData((fD) => ({
        ...fD,
        howToSupport: supportInput,
      }));
    }
  }, [supportInput, setFormData]);
  return (
    <TextField
      required
      fullWidth
      label="Se especifico."
      name="summary"
      multiline
      minRows={2}
      inputProps={{ maxLength: 1000 }}
      helperText="Se especifico. Si estan listos para recibir dinero, por favor indique la forma de pago con detalles. Si estan listos para recibir voluntariados o hablar con los medios, por favor indique cómo ponerse en contacto con detalles."
      value={supportInput}
      onChange={(e) => {
        setSupportInput(e.target.value);
      }}
    />
  );
};

export default HowToSupportInput;
