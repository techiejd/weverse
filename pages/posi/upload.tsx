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
import { z } from "zod";

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

const impactQualifierLevel = z.enum(["hour", "day", "week", "year", "life"]);

// TODO(techiejd): Check all urls are with our hosting.
const formUrl = z.string().url();
const makerBase = z.object({ pic: formUrl, name: z.string().min(1) });
const makerType = z.enum(["individual", "organization"]);
const individual = makerBase.extend({
  type: z.literal(makerType.enum.individual),
});
const organization = makerBase.extend({
  type: z.literal(makerType.enum.organization),
});
const maker = z.discriminatedUnion("type", [individual, organization]);

const posiFormData = z.object({
  summary: z.string().min(5).max(100),
  impactedPeople: z.object({
    amount: z.number().int().nonnegative(),
    level: impactQualifierLevel,
    howToIdentify: z.string().min(5).max(125),
  }),
  tags: z.string().array(),
  location: z.string(),
  dates: z.object({ start: z.date(), end: z.date() }),
  video: formUrl,
  maker: maker,
  about: z.string().min(5).max(1000),
  howToSupport: z.string().min(5).max(1000),
});

const PosiForm = () => {
  const [video, setVideo] = useState<File | undefined>();
  const [makerImg, setMakerImg] = useState<File | undefined>();
  const partialPosiFormData = posiFormData.deepPartial();
  type PartialPosiFormData = z.infer<typeof partialPosiFormData>;
  const [formData, setFormData] = useState<PartialPosiFormData>({});

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log(JSON.stringify(posiFormData.safeParse(formData)));
      }}
    >
      <Stack
        spacing={2}
        margin={2}
        divider={<Divider flexItem />}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Box width="100%">
          <Typography variant="h1">Publica tu Impacto 🪧</Typography>
          <Typography>¡Bienvenido!</Typography>
          <Typography>
            Estamos creando un escenario donde puedes poner tu impacto en un
            pedestal.
          </Typography>
          <Typography>
            Tu audiencia son fanaticos del impacto social que aman los datos.
            Buscan aprender sobre tu impacto para encontrar a quién apoyar.
          </Typography>
          <Typography>
            Gracias por tu impacto valiente. Por favor,{" "}
            <b>¡presumame el impacto!</b>
          </Typography>
        </Box>
        <Section label="Dimelo Rapido">
          <TextField
            required
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
            required
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
        <Section label="Ahora sí, cuentemelo bien (opcional)">
          <TextField
            fullWidth
            label="Resumen (1000 caracteres)"
            name="summary"
            multiline
            minRows={3}
            inputProps={{ maxLength: 1000 }}
          />
        </Section>
        <Section label="¿Cómo apoyarte con este impacto?">
          <TextField
            required
            fullWidth
            label="Se especifico."
            name="summary"
            multiline
            minRows={2}
            inputProps={{ maxLength: 1000 }}
            helperText="Se especifico. Si estan listos para recibir dinero, por favor indique la forma de pago con detalles. Si estan listos para recibir voluntariados o hablar con los medios, por favor indique cómo ponerse en contacto con detalles."
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
