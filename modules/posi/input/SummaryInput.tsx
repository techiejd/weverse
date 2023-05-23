import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useFormData } from "./context";
import { Expand, ExpandMore } from "@mui/icons-material";

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
      <Typography>(180 caracteres)</Typography>
      <Accordion sx={{ mt: 1, mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Buenos ejemplos de descripciones.</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List
            sx={{
              listStyleType: "disc",
              pl: 2,
              "& .MuiListItem-root": {
                display: "list-item",
              },
            }}
          >
            <ListItem>
              Ayudamos a 150 niños de un colegio de escasos recursos a utilizar
              inteligencia aritificial para cambiarles la vida de manera
              positiva.
            </ListItem>
            <ListItem>
              Llené 1 bolsa con basura por la canalización cerca mi casa.
            </ListItem>
            <ListItem>
              Realizamos clases extraescolares para 50 niños este verano pasado.
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
      <TextField
        required
        fullWidth
        label="Esta descripción será el título."
        inputProps={{ maxLength: 180 }}
        value={formData.summary ? formData.summary : ""}
        onChange={(e) => {
          setSummaryInput(e.target.value);
        }}
      />
    </Box>
  );
};

export default SummaryInput;
