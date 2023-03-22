import { Box, Typography, TextField, Slider } from "@mui/material";
import { useState, ChangeEvent } from "react";

const ImpactedPersonsInput = () => {
  const [numImpacted, setNumImpacted] = useState<number | undefined>();
  const processNumImpacted = (e: ChangeEvent<HTMLInputElement>) => {
    const result = e.target.value.replace(/\D/g, "");

    setNumImpacted(Number(result));
  };

  const marks = [
    {
      value: 1,
      label: "Poquíto",
    },
    {
      value: 2,
    },
    {
      value: 3,
    },
    {
      value: 5,
    },
    {
      value: 8,
      label: "Grande",
    },
  ];

  function valueLabelFormat(value: number) {
    const value2Explanation = {
      1: "la hora",
      2: "el día",
      3: "la semana",
      5: "el año",
      8: "la vida",
    };
    return value2Explanation[value as 1 | 2 | 3 | 5 | 8];
  }

  return (
    <Box>
      <Typography variant="h3">¿Cuantas personas fueron impactadas?</Typography>
      <TextField
        label="XXX personas"
        type="number"
        value={numImpacted}
        onChange={processNumImpacted}
      />
      <Typography variant="h3">¿Qué nivel de impacto les tuviste?</Typography>
      <Box sx={{ width: 300 }}>
        <Typography>Yo le cambie para lo mejor a estas personas: </Typography>
        <Slider
          defaultValue={1}
          valueLabelFormat={valueLabelFormat}
          valueLabelDisplay="auto"
          step={null}
          marks={marks}
          min={1}
          max={8}
        />
      </Box>
      <Typography variant="h3">
        En una frase ¿cómo identificar a esta gente (125 caracteres)?
      </Typography>
      <TextField
        fullWidth
        label="Ej: Hablale a cualquiera de la clase 2023 del colegio San Ignacio en el barrio Laureles."
        name="impactedPersons-identification"
        margin="normal"
        inputProps={{ maxLength: 125 }}
      />
    </Box>
  );
};

export default ImpactedPersonsInput;
