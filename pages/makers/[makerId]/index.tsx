import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  Link,
  Rating,
  SpeedDial,
  SpeedDialAction,
  Stack,
  Typography,
} from "@mui/material";
import { AppState, useAppState } from "../../../common/context/appState";
import LoadingFab from "../../../common/components/loadingFab";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  AdminPanelSettings,
  Edit,
  Support as SupportIcon,
} from "@mui/icons-material";
import Support from "../../../common/components/support";
import {
  useCurrentActions,
  useCurrentImpacts,
  useCurrentMaker,
} from "../../../modules/makers/context";
import { useEffect, useState } from "react";
import moment from "moment";
import ImpactCard from "../../../modules/posi/action/card";
import Media from "../../../modules/posi/media";
import { useAction, useMaker } from "../../../common/context/weverseUtils";
import SolicitDialog from "../../../common/components/solicitHelpDialog";
import { SocialProof, organizationLabels } from "shared";
import { Content } from "../../../modules/posi/content";
import RatingsStack from "../../../common/components/ratings";

const SupportMaker = ({ appState }: { appState: AppState }) => {
  const [maker, makerLoading, makerError] = useCurrentMaker(appState);

  return maker ? (
    <Support
      howToSupport={maker.howToSupport ? maker.howToSupport : {}}
      shareProps={{
        path: `/makers/${maker.id}`,
        text: `Echa un vistazo a la página Maker de ${maker.name}`,
        title: `Echa un vistazo a la página Maker de ${maker.name}`,
      }}
      addSocialProofPath={`/makers/${maker.id}/impact/upload`}
    />
  ) : (
    <LoadingFab />
  );
};

const AdministerMaker = ({ appState }: { appState: AppState }) => {
  const [user, userLoading, userError] = useAuthState(appState.auth);
  const [maker, makerLoading, makerError] = useCurrentMaker(appState);
  const [solicitDialogOpen, setSolicitDialogOpen] = useState(false);

  return (
    <>
      {maker && maker.ownerId == user?.uid && (
        <>
          <SolicitDialog
            open={solicitDialogOpen}
            setOpen={setSolicitDialogOpen}
            howToSupport={maker.howToSupport ? maker.howToSupport : {}}
            solicitOpinionPath={`/makers/${maker.id}/impact/upload`}
            pathUnderSupport={`/makers/${maker.id}`}
            editMakerPath={`/makers/${maker.id}/edit`}
          />
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
                  href={`/makers/${maker.id}/edit`}
                  sx={{ textDecoration: "none" }}
                >
                  <Edit />
                </Link>
              }
              tooltipTitle={
                <Link
                  href={`/makers/${maker.id}/edit`}
                  style={{ textDecoration: "none" }}
                >
                  Editar
                </Link>
              }
              tooltipOpen
            />
            <SpeedDialAction
              key="solicit"
              icon={<SupportIcon />}
              tooltipTitle="Apoyo"
              tooltipOpen
              onClick={() => setSolicitDialogOpen(true)}
            />
          </SpeedDial>
        </>
      )}
    </>
  );
};

const MakerProfile = ({ appState }: { appState: AppState }) => {
  const [maker, makerLoading, makerError] = useCurrentMaker(appState);
  return maker ? (
    <Stack
      spacing={2}
      sx={{ justifyContent: "center", alignItems: "center", pb: 2 }}
    >
      <Typography variant="h1">{maker.name}</Typography>
      <RatingsStack ratings={maker.ratings} />
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

const SocialProofCard = ({ socialProof }: { socialProof: SocialProof }) => {
  // TODO(techiejd): WET => DRY.
  const appState = useAppState();
  const SocialProofCardHeader = ({ appState }: { appState: AppState }) => {
    const [byMaker, byMakerLoading, byMakerError] = useMaker(
      appState,
      socialProof.byMaker
    );
    return (
      <CardHeader
        title={
          <Stack
            direction={"row"}
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            <Box pr={2}>
              {byMaker ? `${byMaker.name}: ` : <CircularProgress />}
            </Box>
            <Rating value={socialProof.rating} />
          </Stack>
        }
      />
    );
  };
  const SocialProofCardContent = ({ appState }: { appState: AppState }) => {
    const [action, actionLoading, actionError] = useAction(
      appState,
      socialProof.forAction
    );
    return (
      <>
        {action && <CardContent>Por la acción: {action.summary}</CardContent>}
      </>
    );
  };
  return (
    <Card sx={{ width: "100%" }}>
      {appState ? (
        <SocialProofCardHeader appState={appState} />
      ) : (
        <CircularProgress />
      )}
      {socialProof.videoUrl && (
        <Box
          sx={{
            height: "50vh",
            width: "100%",
          }}
        >
          <Media
            video={{
              threshold: 0.9,
              muted: false,
              controls: true,
              controlsList:
                "play volume fullscreen nodownload noplaybackrate notimeline",
              disablePictureInPicture: true,
              src: socialProof.videoUrl,
            }}
          />
        </Box>
      )}
      {appState && <SocialProofCardContent appState={appState} />}
    </Card>
  );
};

const MakerContent = ({ appState }: { appState: AppState }) => {
  const [actions, actionsLoading, actionsError] = useCurrentActions(appState);
  const [socialProofs, socialProofsLoading, socialProofsError] =
    useCurrentImpacts(appState);
  const [actionsContent, setActionsContent] = useState<Content[]>([]);
  const [socialProofsContent, setSocialProofsContent] = useState<Content[]>([]);
  const [content, setContent] = useState<Content[]>([]);

  useEffect(() => {
    if (actions && actions.length > 0) {
      setActionsContent(
        actions.map((action) => ({
          type: "action",
          data: action,
          createdAt: action.createdAt ? action.createdAt : moment().toDate(),
        }))
      );
    }
  }, [actions, setActionsContent]);
  useEffect(() => {
    if (socialProofs && socialProofs.length > 0) {
      setSocialProofsContent(
        socialProofs.map((socialProof) => ({
          type: "impact",
          data: socialProof,
          createdAt: socialProof.createdAt
            ? socialProof.createdAt
            : moment().toDate(),
        }))
      );
    }
  }, [socialProofs, setSocialProofsContent]);

  useEffect(() => {
    setContent(
      [...actionsContent, ...socialProofsContent].sort(
        (a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()
      )
    );
  }, [actionsContent, socialProofsContent, setContent]);

  return (
    <Grid container spacing={1}>
      {content.map((c, idx) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          key={c.data.id ? c.data.id : idx}
        >
          {c.type == "action" ? (
            <ImpactCard posiData={c.data} />
          ) : (
            <SocialProofCard socialProof={c.data} />
          )}
        </Grid>
      ))}
    </Grid>
  );
};

const MakerPage = () => {
  const appState = useAppState();
  return appState ? (
    <Box>
      <Stack p={2} divider={<Divider />}>
        <MakerProfile appState={appState} />
        <MakerContent appState={appState} />
      </Stack>
      <AdministerMaker appState={appState} />
      <SupportMaker appState={appState} />
    </Box>
  ) : (
    <CircularProgress />
  );
};

export default MakerPage;
