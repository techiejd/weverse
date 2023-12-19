import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { collection, collectionGroup } from "firebase/firestore";
import { useAppState } from "../../common/context/appState";
import {
  Box,
  CircularProgress,
  Fab,
  Link,
  SpeedDial,
  SpeedDialAction,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import InitiativeCard from "../../modules/initiatives/InitiativeCard";
import PageTitle from "../../common/components/pageTitle";
import Edit from "@mui/icons-material/Edit";
import PlusOne from "@mui/icons-material/PlusOne";
import Share from "@mui/icons-material/Share";
import Visibility from "@mui/icons-material/Visibility";
import AuthDialog from "../../modules/auth/AuthDialog";
import LoadingFab from "../../common/components/loadingFab";
import SharingSpeedDialAction from "../../modules/initiatives/sharingSpeedDialAction";
import { Initiative } from "../../functions/shared/src";
import { useInitiativeConverter } from "../../common/utils/firebase";
import { WithTranslationsStaticProps } from "../../common/utils/translations";
import { asOneWePage } from "../../common/components/onewePage";
import { useTranslations } from "next-intl";
import { useMyInitiatives } from "../../common/context/weverseUtils";

export const getStaticProps = WithTranslationsStaticProps();
const MyInitiativeSpeedDial = ({ initiative }: { initiative: Initiative }) => {
  const callToActionTranslations = useTranslations("common.callToAction");
  const t = useTranslations(
    "initiatives.myInitiativePortal.myInitiativeSpeedDial"
  );
  const actions = [
    <SpeedDialAction
      key="Ver"
      icon={
        <Link href={`/${initiative.path}`} style={{ textDecoration: "none" }}>
          <Visibility />
        </Link>
      }
      tooltipTitle={
        <Link href={`/${initiative.path}`} style={{ textDecoration: "none" }}>
          {t("view")}
        </Link>
      }
      tooltipOpen
    />,
    <SpeedDialAction
      key={"Editar"}
      icon={
        <Link
          href={`/${initiative.path}/edit`}
          style={{ textDecoration: "none" }}
        >
          <Edit />
        </Link>
      }
      tooltipTitle={
        <Link
          href={`/${initiative.path}/edit`}
          style={{ textDecoration: "none" }}
        >
          {callToActionTranslations("edit")}
        </Link>
      }
      tooltipOpen
    />,
    <SharingSpeedDialAction
      key={"Compartir"}
      icon={<Share />}
      tooltipTitle={callToActionTranslations("share")}
      tooltipOpen
      title={`Echa un vistazo a la página Initiative de ${initiative.name}`}
      path={`${initiative.path}`}
    />,
  ];
  return (
    <SpeedDial
      ariaLabel="My Initiative Speed Dial"
      sx={{
        position: "fixed",
        bottom: 64,
        right: 16,
      }}
      icon={
        <div>
          <Typography fontSize={22}>💪</Typography>
          <Typography fontSize={10}>{t("mine")}</Typography>
        </div>
      }
    >
      {actions}
    </SpeedDial>
  );
};

const MyInitiativePortal = () => {
  const [myInitiatives, myInitiativesLoading] = useMyInitiatives();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const t = useTranslations("initiatives.myInitiativePortal");

  const registerFab = (
    <Fab
      variant="extended"
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
      }}
      color="primary"
      onClick={() => {
        setAuthDialogOpen(true);
      }}
    >
      <PlusOne sx={{ mr: 1 }} />
      <Typography>{t("join")}</Typography>
    </Fab>
  );

  return (
    <Box>
      <AuthDialog open={authDialogOpen} setOpen={setAuthDialogOpen} />
      {myInitiativesLoading ? (
        <LoadingFab />
      ) : myInitiatives ? (
        <MyInitiativeSpeedDial initiative={myInitiatives[0]} />
      ) : (
        registerFab
      )}
    </Box>
  );
};

const Initiatives = asOneWePage(() => {
  const appState = useAppState();
  const initiativeConverter = useInitiativeConverter();
  const [initiatives, initiativesLoading, initiativesError] = useCollectionData(
    collectionGroup(appState.firestore, "initiatives").withConverter(
      initiativeConverter
    )
  );
  const initiativesTranslations = useTranslations("initiatives");

  return (
    <Box>
      <Stack
        sx={{ alignItems: "center", justifyContent: "center", p: 1 }}
        spacing={1}
      >
        <PageTitle title={<b>💪 {initiativesTranslations("title")}</b>} />
        {initiativesError && (
          <Typography color={"red"}>
            {JSON.stringify(initiativesError)}
          </Typography>
        )}
        {initiativesLoading && <CircularProgress />}
        {initiatives?.map((i) => (
          <InitiativeCard initiativePath={i.path!} key={i.path!} />
        ))}
      </Stack>
      <MyInitiativePortal />
    </Box>
  );
});

export default Initiatives;
