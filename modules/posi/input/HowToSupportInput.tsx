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
        <Typography variant="h3">Apoyo financiero:</Typography>
        <TextField
          required
          fullWidth
          label="Deja aquí el enlace o los datos de tus cuentas para recibir
          donaciones: (500 caracteres.)"
          name="summary"
          multiline
          minRows={2}
          inputProps={{ maxLength: 500 }}
          helperText="Si tu iniciativa está lista para recibir dinero, por favor indica los medios de pago. Por ejemplo: Datos de tu cuenta bancaria como Bancolombia, Nequi, Billetera Crypto, PayPal, etc."
          value={financeInput}
          onChange={(e) => {
            setFinanceInput(e.target.value);
          }}
        />
      </Box>
      <Box>
        <Typography variant="h3">Otro tipo de apoyo:</Typography>
        <TextField
          required
          fullWidth
          label="Deja aquí los datos de contacto para recibir ayudas de cualquier otro
          tipo. (500 caracteres.)"
          name="summary"
          multiline
          minRows={2}
          inputProps={{ maxLength: 500 }}
          helperText="Si tu iniciativa está listo para recibir voluntarios, hablar con medios de comunicación o con especialistas como abogados, desarrolladores, etc, por favor, indica tu solicitud y los enlaces o los detalles para ponerse en contacto contigo. Por ejemplo: número telefónico, correo electrónico, redes sociales, página web, etc."
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
