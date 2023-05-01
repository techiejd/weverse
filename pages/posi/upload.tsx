import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { collection, addDoc, doc } from "firebase/firestore";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { CitySearchInput } from "../../modules/posi/input";
import ImpactedPersonsInput from "../../modules/posi/input/impactedPersonsInput";
import {
  PartialPosiFormData,
  PosiFormContext,
  PosiFormDispatchContext,
  posiFormData,
  posiFormDataConverter,
  useFormData,
} from "../../modules/posi/input/context";
import ImpactVideoInput from "../../modules/posi/input/impactVideoInput";
import SummaryInput from "../../modules/posi/input/SummaryInput";
import AboutInput from "../../modules/posi/input/aboutInput";
import { AppState, useAppState } from "../../common/context/appState";
import AboutContent from "../../modules/posi/impactPage/about/AboutContent";
import { useRouter } from "next/router";
import AuthDialog, { AuthDialogButton } from "../../modules/auth/AuthDialog";
import { AuthAction } from "../../modules/auth/AuthDialog/context";
import { memberConverter } from "../../common/context/weverse";
import { useAuthState } from "react-firebase-hooks/auth";
import { User } from "firebase/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";

export const Section = ({
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
        <Box>
          {open /** We only want to parse the data when we're ready to display. */ && (
            <AboutContent {...posiFormData.parse(formData)} />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button
          variant="contained"
          onClick={async (e) => {
            const usersPosiFormData = posiFormData.parse(formData);
            if (appState) {
              const docRef = await addDoc(
                collection(appState.firestore, "impacts").withConverter(
                  posiFormDataConverter
                ),
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

const HandleLogInDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [logInDialogOpen, setLogInDialogOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);

  return (
    <Box>
      <AuthDialog open={logInDialogOpen} setOpen={setLogInDialogOpen} />
      <AuthDialog
        open={registerDialogOpen}
        setOpen={setRegisterDialogOpen}
        initialAuthAction={AuthAction.register}
      />
      <Dialog open={open}>
        <DialogTitle>¡Oh-oh! Primero se necesita iniciar sesión.</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Regístrese si no lo ha hecho. Inicia sesión si ya estás registrado.
          </DialogContentText>
        </DialogContent>
        <DialogActions onClick={(e) => setOpen(false)}>
          <Button size="small">Cancelar</Button>
          <AuthDialogButton setAuthDialogOpen={setLogInDialogOpen} />
          <AuthDialogButton
            setAuthDialogOpen={setRegisterDialogOpen}
            authAction={AuthAction.register}
            buttonVariant="contained"
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const GetMaker = ({ appState, user }: { appState: AppState; user: User }) => {
  const [formData, setFormData] = useFormData();
  const memberDocRef = doc(
    appState.firestore,
    "members",
    user.uid
  ).withConverter(memberConverter);
  const [member, loading, error] = useDocumentData(memberDocRef);

  useEffect(() => {
    if (member && setFormData) {
      setFormData((fD) => ({ ...fD, makerId: member.makerId }));
    }
  }, [member, setFormData]);

  return <></>;
};

const PosiForm = () => {
  const appState = useAppState();

  const PosiFormContent = ({ appState }: { appState: AppState }) => {
    const [user, loading, error] = useAuthState(appState.auth);
    const [formData, setFormData] = useState<PartialPosiFormData>({});
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [unauthorizedUserInteraction, setUnauthorizedUserInteraction] =
      useState(false);

    return (
      <Box>
        <HandleLogInDialog
          open={unauthorizedUserInteraction}
          setOpen={setUnauthorizedUserInteraction}
        />
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            posiFormData.parse(formData);
            setUploadDialogOpen(true);
          }}
          onClick={(e) => {
            if (!user) {
              setUnauthorizedUserInteraction(true);
            }
          }}
        >
          <PosiFormContext.Provider value={formData}>
            <PosiFormDispatchContext.Provider value={setFormData}>
              <ConfirmAndUploadDialog
                open={uploadDialogOpen}
                setOpen={setUploadDialogOpen}
              />
              {user && appState && <GetMaker appState={appState} user={user} />}
              <Stack
                spacing={2}
                margin={2}
                divider={<Divider flexItem />}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Stack
                  spacing={1}
                  justifyContent={"center"}
                  alignItems={"center"}
                  textAlign={"center"}
                >
                  <Typography variant="h1">Publica tu acción! 🪧</Typography>
                  <Typography>¡Hola, muchas gracias por estar aquí!</Typography>
                  <Typography>
                    Estamos creando un universo en el que le puedas mostrar al
                    mundo todo lo bueno que estás haciendo por los demás,
                    ¡porque vale la pena mostrarlo!
                  </Typography>
                  <Typography>
                    Aquí amamos el impacto social, poder demostrar con datos los
                    resultados de tus acciones sociales y brindarte el apoyo que
                    necesites. Por ende, necesitamos que nos muestres la acción
                    para nosotros emitirlo a la comunidad y medir el impacto.
                  </Typography>
                  <Typography>
                    De nuevo, gracias por querer compartirla con nuestra
                    comunidad.
                  </Typography>
                </Stack>
                <Section label="En pocas palabras">
                  <SummaryInput />
                </Section>
                <Section label="Hablemos sobre la población impactada">
                  <ImpactedPersonsInput />
                </Section>
                <Section label="¿Dónde realizaste esta acción?">
                  <CitySearchInput />
                </Section>
                <Section label="Muéstranos un poco de lo que has hecho">
                  <ImpactVideoInput />
                </Section>
                <Section label="¿Quieres contarnos más? ¡Adelante!">
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

  return appState ? (
    <PosiFormContent appState={appState} />
  ) : (
    <CircularProgress />
  );
};

export default PosiForm;
