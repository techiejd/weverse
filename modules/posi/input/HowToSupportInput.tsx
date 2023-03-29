import { Box, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useFormData } from "./context";

const HowToSupportInput = () => {
  const [contactInput, setContactInput] = useState("");
  const [financeInput, setFinanceInput] = useState("");
  const [formData, setFormData] = useFormData();
  useEffect(() => {
    if (setFormData) {
      setFormData((fD) => ({
        ...fD,
        howToSupport: {
          ...fD.howToSupport,
          finance: financeInput,
        },
      }));
    }
  }, [financeInput, setFormData]);
  useEffect(() => {
    if (setFormData) {
      setFormData((fD) => ({
        ...fD,
        howToSupport: {
          ...fD.howToSupport,
          contact: contactInput,
        },
      }));
    }
  }, [contactInput, setFormData]);
  return (
    <Stack spacing={2}>
      <Box>
        <Typography>Cómo ayudarte financialmente:</Typography>
        <TextField
          required
          fullWidth
          label="Se especifico para recibir dinero. (500 caracteres.)"
          name="summary"
          multiline
          minRows={2}
          inputProps={{ maxLength: 500 }}
          helperText="Si estan listos para recibir dinero, por favor indique la forma de pago con detalles. [Por ejemplo: datos de bancolombia, nequi o de tu billetera crypto o enlace de PayPal]"
          value={financeInput}
          onChange={(e) => {
            setFinanceInput(e.target.value);
          }}
        />
      </Box>
      <Box>
        <Typography>Cómo contactarte para ayudarte en otras formas:</Typography>
        <TextField
          required
          fullWidth
          label="Se especifico para recibir ayuda. (500 caracteres.)"
          name="summary"
          multiline
          minRows={2}
          inputProps={{ maxLength: 500 }}
          helperText="Si estan listos para recibir voluntariados o hablar con los medios, por favor indique cómo ponerse en contacto con detalles. [Por ejemplo: número télefonico, correo electronico, enlaces a paginas de los redes, etc.]"
          value={contactInput}
          onChange={(e) => {
            setContactInput(e.target.value);
          }}
        />
      </Box>
    </Stack>
  );
};
export default HowToSupportInput;
