import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { ReactNode, useState } from "react";
import {
  CitySearchInput,
  TagsInput,
  FileInput,
} from "../../modules/posi/input";
import DateRangeInput from "../../modules/posi/input/dateRangeInput";

const Section = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => {
  return (
    <Box>
      <Typography variant="h2">{label}:</Typography>
      {children}
    </Box>
  );
};

const PosiForm = () => {
  const [video, setVideo] = useState<File | undefined>();
  const [img, setImg] = useState<File | undefined>();

  return (
    <form action="/api/posi">
      <Stack spacing={2} margin={2}>
        <Typography variant="h1">🔏: Suba tu PoSI</Typography>
        <Section label="Dimelo Rapido">
          <TextField
            fullWidth
            label="En una frase, ¿cuál fue tu impacto? (100 caracteres)"
            name="title"
            margin="normal"
            inputProps={{ maxLength: 100 }}
          />
        </Section>
        <Section label="Etiquetamelo por favor">
          <TagsInput />
        </Section>
        <Section label="¿Donde fue?">
          <CitySearchInput />
        </Section>
        <Section label="¿De cúando a cúando?">
          <DateRangeInput />
        </Section>
        <Section label="Mostramelo pues">
          <FileInput
            file={video}
            setFile={setVideo}
            minFileSize={1048576 /** 1MB */}
            maxFileSize={2147483648 /** 2GB */}
            accept={"video"}
          />
        </Section>
        <Section label="¿Quien fue?">
          <Typography>Organization</Typography>
          <FileInput
            file={img}
            setFile={setImg}
            maxFileSize={1048576 /** 1MB */}
            accept={"img"}
          />
        </Section>
        <Section label="Ahora sí, cuentemelo bien">
          <TextField
            fullWidth
            label="Resumen (1000 caracteres)"
            name="summary"
            multiline
            inputProps={{ maxLength: 1000 }}
          />
        </Section>
        <Button variant="contained" sx={{ mt: 3 }} type="submit">
          Firmar & Subir
        </Button>
      </Stack>
    </form>
  );
};

export default PosiForm;
