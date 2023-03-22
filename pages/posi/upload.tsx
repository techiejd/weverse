import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ReactNode, useState } from "react";
import {
  CitySearchInput,
  TagsInput,
  FileInput,
} from "../../modules/posi/input";
import DateRangeInput from "../../modules/posi/input/dateRangeInput";
import ImpactedPersonsInput from "../../modules/posi/input/impactedPersonsInput";
import MakerInput from "../../modules/posi/input/makerInput";

const Section = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => {
  return (
    <Box width="100%">
      <Typography variant="h2">{label}:</Typography>
      {children}
    </Box>
  );
};

const PosiForm = () => {
  const [video, setVideo] = useState<File | undefined>();
  const [makerImg, setMakerImg] = useState<File | undefined>();

  return (
    <form action="/api/posi">
      <Stack
        spacing={2}
        margin={2}
        divider={<Divider flexItem />}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography variant="h1">Publica tu Impacto 🪧</Typography>
        <Section label="Dimelo Rapido">
          <TextField
            fullWidth
            label="En una frase, ¿cuál fue tu impacto? (100 caracteres)"
            name="title"
            margin="normal"
            inputProps={{ maxLength: 100 }}
          />
        </Section>
        <Section label="Contame sobre las personas impactadas">
          <ImpactedPersonsInput />
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
          <MakerInput img={makerImg} setImg={setMakerImg} />
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
        <Button variant="outlined" sx={{ mt: 3 }} type="submit">
          Publicar
        </Button>
      </Stack>
    </form>
  );
};

export default PosiForm;
