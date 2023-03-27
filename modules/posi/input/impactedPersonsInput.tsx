import { Box, Typography, TextField, Slider, Stack } from "@mui/material";
import { useState, ChangeEvent, useEffect } from "react";
import {
  ImpactQualifierLevel,
  impactQualifierLevel,
  useFormData,
} from "./context";

const ImpactedPersonsInput = () => {
  const defaultLevel = ImpactQualifierLevel.hour;
  const [formData, setFormData] = useFormData();
  const processNumImpacted = (e: ChangeEvent<HTMLInputElement>) => {
    const result = e.target.value.replace(/\D/g, "");

    if (setFormData) {
      setFormData((fD) => ({
        ...fD,
        impactedPeople: {
          ...fD.impactedPeople,
          amount: Number(result),
        },
      }));
    }
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

  const setLevel = (newLevel: number) => {
    if (setFormData) {
      // For when setFormData comes alive
      setFormData((fD) => ({
        ...fD,
        impactedPeople: {
          ...fD.impactedPeople,
          level: impactQualifierLevel.parse(newLevel),
        },
      }));
    }
  };
  useEffect(() => {
    if (setFormData) {
      setFormData((fD) => ({
        ...fD,
        impactedPeople: {
          ...fD.impactedPeople,
          level: fD.impactedPeople?.level
            ? fD.impactedPeople.level
            : defaultLevel,
        },
      }));
    }
  }, [defaultLevel, setFormData]); // For when setFormData comes alive

  const setHowToId = (input: string) => {
    if (setFormData) {
      setFormData((fD) => ({
        ...fD,
        impactedPeople: {
          ...fD.impactedPeople,
          howToIdentify: input,
        },
      }));
    }
  };

  return (
    <Stack spacing={2} margin={2} justifyContent={"space-between"}>
      <Typography variant="h3">¿Cuantas personas fueron impactadas?</Typography>
      <TextField
        required
        label="XXX personas"
        type="number"
        onChange={processNumImpacted}
        sx={{ width: 200 }}
        value={
          formData.impactedPeople?.amount ? formData.impactedPeople.amount : ""
        }
      />
      <Typography variant="h3">¿Qué nivel de impacto les tuviste?</Typography>
      <Box sx={{ width: 300 }} alignSelf={"center"}>
        <Typography>Yo le cambie para lo mejor a estas personas: </Typography>
        <Slider
          sx={{
            mt: 3,
          }}
          defaultValue={defaultLevel}
          valueLabelFormat={valueLabelFormat}
          valueLabelDisplay="auto"
          step={null}
          marks={marks}
          min={1}
          max={8}
          value={
            formData.impactedPeople?.level
              ? formData.impactedPeople.level
              : ImpactQualifierLevel.hour
          }
          onChange={(e, val) => {
            setLevel(val as number);
          }}
        />
      </Box>
      <Typography variant="h3">
        En una frase ¿cómo identificar a esta gente? (125 caracteres)
      </Typography>
      <TextField
        required
        fullWidth
        label="Ej: Hablale a cualquiera de la clase 2023 del colegio San Ignacio en el barrio Laureles."
        name="impactedPersons-identification"
        margin="normal"
        inputProps={{ maxLength: 125 }}
        value={
          formData.impactedPeople?.howToIdentify
            ? formData.impactedPeople.howToIdentify
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
