import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { ReactNode, useState } from "react";
import { CitySearchInput, TagsInput } from "../../modules/posi/input";
import DateRangeInput from "../../modules/posi/input/dateRangeInput";
import ImpactedPersonsInput from "../../modules/posi/input/impactedPersonsInput";
import MakerInput from "../../modules/posi/input/makerInput";
import {
  PartialPosiFormData,
  PosiFormContext,
  PosiFormDispatchContext,
  posiFormData,
} from "../../modules/posi/input/context";
import ImpactVideoInput from "../../modules/posi/input/impactVideoInput";
import SummaryInput from "../../modules/posi/input/SummaryInput";
import HowToSupportInput from "../../modules/posi/input/HowToSupportInput";
import AboutInput from "../../modules/posi/input/aboutInput";
import { useAppState } from "../../common/context/appState";

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
  const [formData, setFormData] = useState<PartialPosiFormData>({});
  const appState = useAppState();
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const usersPosiFormData = posiFormData.parse(formData);
        if (appState) {
          await addDoc(
            collection(appState.firestore, "impacts"),
            usersPosiFormData
          );
        }
      }}
    >
      <PosiFormContext.Provider value={formData}>
        <PosiFormDispatchContext.Provider value={setFormData}>
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
                Tu audiencia son fanaticos del impacto social que aman los
                datos. Buscan aprender sobre tu impacto para encontrar a quién
                apoyar.
              </Typography>
              <Typography>
                Gracias por tu impacto valiente. Por favor,{" "}
                <b>¡presumame el impacto!</b>
              </Typography>
            </Box>
            <Section label="Dimelo Rapido">
              <SummaryInput />
            </Section>
            <Section label="¿Cómo apoyarte con este impacto?">
              <HowToSupportInput />
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
              <ImpactVideoInput />
            </Section>
            <Section label="¿Quien fue?">
              <MakerInput />
            </Section>
            <Section label="Ahora sí, cuentemelo bien (opcional)">
              <AboutInput />
            </Section>
            <Button variant="contained" sx={{ mt: 3 }} type="submit">
              Publicar
            </Button>
          </Stack>
        </PosiFormDispatchContext.Provider>
      </PosiFormContext.Provider>
    </form>
  );
};

export default PosiForm;
