import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { CitySearchInput, TagsInput } from "../../modules/posi/input";
import ImpactedPersonsInput from "../../modules/posi/input/impactedPersonsInput";
import {
  PartialPosiFormData,
  PosiFormContext,
  PosiFormDispatchContext,
  posiFormData,
  useFormData,
} from "../../modules/posi/input/context";
import ImpactVideoInput from "../../modules/posi/input/impactVideoInput";
import SummaryInput from "../../modules/posi/input/SummaryInput";
import HowToSupportInput from "../../modules/posi/input/HowToSupportInput";
import AboutInput from "../../modules/posi/input/aboutInput";
import { useAppState } from "../../common/context/appState";
import TimeInfoInput from "../../modules/posi/input/timeInfoInput";
import AboutContent from "../../modules/posi/impactPage/about/AboutContent";
import { useRouter } from "next/router";

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

const ConfirmAndUploadDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [formData, setFormData] = useFormData();
  const appState = useAppState();
  const router = useRouter();
  return (
    <Dialog fullScreen open={open}>
      <DialogTitle>
        Confirma que este es el impacto que deseas cargar.
      </DialogTitle>
      <DialogContent>
        <Box sx={{ backgroundColor: "white" }}>
          {open /** We only want to parse the data when we're ready to display. */ && (
            <AboutContent {...posiFormData.parse(formData)} readonly />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button
          variant="contained"
          onClick={async (e) => {
            console.log(formData);
            const usersPosiFormData = posiFormData.parse(formData);
            if (appState) {
              const docRef = await addDoc(
                collection(appState.firestore, "impacts"),
                usersPosiFormData
              );
              router.push(`/posi/${docRef.id}/about`);
            }
          }}
        >
          Se ve bien!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PosiForm = () => {
  const [promptLogInDialogOpen, setPromptLogInDialogOpen] = useState(true);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [formData, setFormData] = useState<PartialPosiFormData>({});
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  return (
    <Box>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log(formData);
          posiFormData.parse(formData);
          setUploadDialogOpen(true);
        }}
        onClick={(e) => alert("Clicked!")}
      >
        <PosiFormContext.Provider value={formData}>
          <PosiFormDispatchContext.Provider value={setFormData}>
            <ConfirmAndUploadDialog
              open={uploadDialogOpen}
              setOpen={setUploadDialogOpen}
            />
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
                  Estamos creando un escenario donde puedes poner tu impacto en
                  un pedestal.
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
              <Section label="Cuenteme sobre el esfuerzo">
                <TimeInfoInput />
              </Section>
              <Section label="Mostramelo pues">
                <ImpactVideoInput />
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
    </Box>
  );
};

export default PosiForm;
