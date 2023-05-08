import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  Link,
  SpeedDial,
  SpeedDialAction,
  Stack,
  Typography,
} from "@mui/material";
import {
  query,
  collection,
  where,
  CollectionReference,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { AppState, useAppState } from "../../../common/context/appState";
import ImpactsList from "../../../modules/posi/impactsList";
import {
  posiFormDataConverter,
  PosiFormData,
} from "../../../modules/posi/input/context";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import {
  makerConverter,
  organizationLabels,
} from "../../../common/context/weverse";
import LoadingFab from "../../../common/components/loadingFab";
import { useAuthState } from "react-firebase-hooks/auth";
import { AdminPanelSettings, Edit } from "@mui/icons-material";
import Support from "../../../common/components/support";

const SupportMaker = ({
  appState,
  makerId,
}: {
  appState: AppState;
  makerId: string;
}) => {
  const makerDocRef = doc(appState.firestore, "makers", makerId).withConverter(
    makerConverter
  );
  const [maker, makerLoading, makerError] = useDocumentData(
    makerDocRef.withConverter(makerConverter)
  );

  return maker ? (
    <Support
      howToSupport={maker.howToSupport ? maker.howToSupport : {}}
      shareProps={{
        path: `/makers/${makerId}`,
        text: `Echa un vistazo a la página Maker de ${maker.name}`,
        title: `Echa un vistazo a la página Maker de ${maker.name}`,
      }}
    />
  ) : (
    <LoadingFab />
  );
};

const AdministerMaker = ({
  appState,
  makerId,
}: {
  appState: AppState;
  makerId: string;
}) => {
  const [user, userLoading, userError] = useAuthState(appState.auth);
  const makerDocRef = doc(appState.firestore, "makers", makerId);
  const [maker, makerLoading, makerError] = useDocumentData(
    makerDocRef.withConverter(makerConverter)
  );

  return (
    <>
      {maker?.ownerId == user?.uid && (
        <SpeedDial
          ariaLabel="Administer Maker"
          sx={{
            position: "fixed",
            bottom: 64,
            right: 84,
          }}
          icon={
            <div>
              <AdminPanelSettings />
              <Typography fontSize={8} mt={-1}>
                Admin
              </Typography>
            </div>
          }
        >
          <SpeedDialAction
            key="Add Action"
            icon={
              <Link href={`/posi/upload`} sx={{ textDecoration: "none" }}>
                <Typography fontSize={24}>🤸</Typography>
              </Link>
            }
            tooltipTitle={
              <Link href={`/posi/upload`} style={{ textDecoration: "none" }}>
                Agregar Acción
              </Link>
            }
            tooltipOpen
          />
          <SpeedDialAction
            key="Edit Maker"
            icon={
              <Link
                href={`/makers/${makerId}/edit`}
                sx={{ textDecoration: "none" }}
              >
                <Edit />
              </Link>
            }
            tooltipTitle={
              <Link
                href={`/makers/${makerId}/edit`}
                style={{ textDecoration: "none" }}
              >
                Editar
              </Link>
            }
            tooltipOpen
          />
        </SpeedDial>
      )}
    </>
  );
};

const MakerContent = ({
  makerId,
  appState,
}: {
  makerId: string;
  appState: AppState;
}) => {
  const makerDocRef = doc(appState.firestore, "makers", makerId);
  const [maker, makerLoading, makerError] = useDocumentData(
    makerDocRef.withConverter(makerConverter)
  );
  return maker ? (
    <Stack
      spacing={2}
      sx={{ justifyContent: "center", alignItems: "center", pb: 2 }}
    >
      <Typography variant="h1">{maker.name}</Typography>
      <Avatar src={maker.pic} sx={{ width: 225, height: 225 }} />
      <Typography>
        {maker.type == "individual"
          ? "Individuo"
          : maker.organizationType
          ? organizationLabels[maker.organizationType]
          : "Error"}
      </Typography>
      <Stack sx={{ width: "100%" }}>
        <Typography variant="h2">Acerca de:</Typography>
        <Typography>
          {maker.about ? maker.about : "No hay sección 'acerca de'."}
        </Typography>
      </Stack>
    </Stack>
  ) : (
    <CircularProgress />
  );
};

const MakerPage = () => {
  const appState = useAppState();
  const router = useRouter();
  const { makerId } = router.query;

  const q =
    appState && makerId
      ? query(
          collection(appState.firestore, "impacts"),
          where("makerId", "==", makerId)
        ).withConverter(posiFormDataConverter)
      : undefined;
  return appState ? (
    <Box>
      <Stack p={2} divider={<Divider />}>
        {makerId && appState && (
          <MakerContent makerId={String(makerId)} appState={appState} />
        )}
        {q == undefined ? (
          <CircularProgress />
        ) : (
          <ImpactsList
            impactsQuery={
              // TODO(techiejd: Look into this casting why necessary? Something funky with zod.
              q as CollectionReference<PosiFormData>
            }
          />
        )}
      </Stack>
      <AdministerMaker appState={appState} makerId={String(makerId)} />
      <SupportMaker appState={appState} makerId={String(makerId)} />
    </Box>
  ) : (
    <CircularProgress />
  );
};

export default MakerPage;
