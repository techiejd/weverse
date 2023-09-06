import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
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
import MakerCard from "../../modules/initiatives/MakerCard";
import PageTitle from "../../common/components/pageTitle";
import Edit from "@mui/icons-material/Edit";
import PlusOne from "@mui/icons-material/PlusOne";
import Share from "@mui/icons-material/Share";
import Visibility from "@mui/icons-material/Visibility";
import AuthDialog from "../../modules/auth/AuthDialog";
import LoadingFab from "../../common/components/loadingFab";
import SharingSpeedDialAction from "../../modules/initiatives/sharingSpeedDialAction";
import { Maker } from "../../functions/shared/src";
import { useMakerConverter } from "../../common/utils/firebase";
import { WithTranslationsStaticProps } from "../../common/utils/translations";
import { asOneWePage } from "../../common/components/onewePage";
import { useTranslations } from "next-intl";
import { useMyMaker } from "../../common/context/weverseUtils";

export const getStaticProps = WithTranslationsStaticProps();
const MyMakerSpeedDial = ({ maker }: { maker: Maker }) => {
  const callToActionTranslations = useTranslations("common.callToAction");
  const t = useTranslations("makers.myMakerPortal.myMakerSpeedDial");
  const actions = [
    <SpeedDialAction
      key="Ver"
      icon={
        <Link
          href={`/initiatives/${maker.id}`}
          style={{ textDecoration: "none" }}
        >
          <Visibility />
        </Link>
      }
      tooltipTitle={
        <Link
          href={`/initiatives/${maker.id}`}
          style={{ textDecoration: "none" }}
        >
          {t("view")}
        </Link>
      }
      tooltipOpen
    />,
    <SpeedDialAction
      key={"Editar"}
      icon={
        <Link
          href={`/initiatives/${maker.id}/edit`}
          style={{ textDecoration: "none" }}
        >
          <Edit />
        </Link>
      }
      tooltipTitle={
        <Link
          href={`/initiatives/${maker.id}/edit`}
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
      title={`Echa un vistazo a la página Maker de ${maker.name}`}
      path={`/initiatives/${maker.id}`}
    />,
  ];
  return (
    <SpeedDial
      ariaLabel="My Maker Speed Dial"
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

const MyMakerPortal = () => {
  const [myMaker, myMakerLoading] = useMyMaker();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const t = useTranslations("makers.myMakerPortal");

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
      {myMakerLoading ? (
        <LoadingFab />
      ) : myMaker ? (
        <MyMakerSpeedDial maker={myMaker} />
      ) : (
        registerFab
      )}
    </Box>
  );
};

const Makers = asOneWePage(() => {
  const appState = useAppState();
  const makerConverter = useMakerConverter();
  const [makersSnapshot, makersLoading, makersError] = useCollection(
    collection(appState.firestore, "makers").withConverter(makerConverter)
  );

  const [makers, setMakers] = useState<string[]>([]);

  useEffect(() => {
    makersSnapshot?.docChanges().forEach((docChange) => {
      // TODO(techiejd): Look into the other scenarios.
      if (docChange.type == "added") {
        setMakers((makers) => [...makers, docChange.doc.id]);
      }
    });
  }, [makersSnapshot]);
  return (
    <Box>
      <Stack
        sx={{ alignItems: "center", justifyContent: "center", p: 1 }}
        spacing={1}
      >
        <PageTitle title={<b>💪 Makers</b>} />
        {makersError && (
          <Typography color={"red"}>{JSON.stringify(makersError)}</Typography>
        )}
        {makersLoading && <CircularProgress />}
        {makers.map((maker) => (
          <MakerCard makerId={maker} key={maker} />
        ))}
      </Stack>
      <MyMakerPortal />
    </Box>
  );
});

export default Makers;
