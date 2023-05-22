import {
  AppBar,
  Box,
  CircularProgress,
  Grid,
  Link,
  SpeedDial,
  SpeedDialAction,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  AdminPanelSettings,
  Edit,
  Handshake,
  Hearing,
  Share,
  Support as SupportIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { doc } from "firebase/firestore";
import LoadingFab from "../../../common/components/loadingFab";
import ShareActionArea, {
  ShareProps,
} from "../../../common/components/shareActionArea";
import SolicitDialog from "../../../common/components/solicitHelpDialog";
import { AppState, useAppState } from "../../../common/context/appState";
import { useMaker, useMyMaker } from "../../../common/context/weverseUtils";
import { makerConverter } from "../../../common/utils/firebase";
import AboutContent from "../../../modules/posi/action/about";
import {
  useCurrentPosi,
  useCurrentPosiId,
  useCurrentSocialProofs,
} from "../../../modules/posi/context";
import { getSharePropsForPosi } from "../../../modules/posi/input/context";
import SupportBottomBar from "../../../common/components/supportBottomBar";
import SocialProofCard from "../../../modules/posi/socialProofCard";
import CenterBottomCircularProgress from "../../../common/components/centerBottomCircularProgress";
import { Maker, PosiFormData, maker } from "../../../functions/shared/src";
import CenterBottomFab from "../../../common/components/centerBottomFab";
import IconButtonWithLabel from "../../../common/components/iconButtonWithLabel";

const AdminButton = ({
  posiId,
  makerId,
  appState,
}: {
  posiId: string;
  makerId: string;
  appState: AppState;
}) => {
  const [user, userLoading, userError] = useAuthState(appState.auth);
  const [maker, makerLoading, makerError] = useMaker(appState, makerId);
  const [solicitDialogOpen, setSolicitDialogOpen] = useState(false);
  return (
    <>
      {maker && user && maker.ownerId == user.uid && (
        <>
          <SolicitDialog
            open={solicitDialogOpen}
            setOpen={setSolicitDialogOpen}
            howToSupport={maker.howToSupport ? maker.howToSupport : {}}
            solicitOpinionPath={`/posi/${posiId}/impact/upload`}
            pathUnderSupport={`/posi/${posiId}`}
            editMakerPath={`/makers/${maker.id}/edit`}
          />
          <SpeedDial
            ariaLabel="Administer Action"
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
              key="Edit Action"
              icon={
                <Link
                  href={`/posi/${posiId}/action/edit`}
                  sx={{ textDecoration: "none" }}
                >
                  <Edit />
                </Link>
              }
              tooltipTitle={
                <Link
                  href={`/posi/${posiId}/action/edit`}
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

const AdminBottomBar = ({
  action,
  myMaker,
}: {
  action: PosiFormData;
  myMaker: Maker;
}) => {
  const [solicitDialogOpen, setSolicitDialogOpen] = useState(false);
  const solicitOpinionPath = `/posi/${action.id}/impact/upload`;
  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{ top: "auto", bottom: 16, borderRadius: 8, boxShadow: 8 }}
    >
      <SolicitDialog
        open={solicitDialogOpen}
        setOpen={setSolicitDialogOpen}
        howToSupport={myMaker.howToSupport ? myMaker.howToSupport : {}}
        solicitOpinionPath={`/posi/${action.id}/impact/upload`}
        pathUnderSupport={`/posi/${action.id}`}
        editMakerPath={`/makers/${myMaker.id}/edit`}
      />
      <Toolbar>
        <IconButtonWithLabel href={`/posi/${action.id}/action/edit`}>
          <Edit />
          <Typography>Editar</Typography>
        </IconButtonWithLabel>
        <CenterBottomFab
          color="secondary"
          aria-label="add"
          sx={{ width: 70, height: 70 }}
        >
          <Handshake fontSize="large" />
          <Typography fontSize={12}>Apoyo</Typography>
        </CenterBottomFab>
        <Box sx={{ flexGrow: 1 }} />
        <ShareActionArea
          shareProps={{
            path: solicitOpinionPath,
            text: "Por favor dame tu testimonio sobre mi impacto social",
            title: "Por favor dame tu testimonio sobre mi impacto social",
          }}
        >
          <IconButtonWithLabel>
            <Hearing fontSize="large" />
            <Typography fontSize={12}>Escuchar</Typography>
          </IconButtonWithLabel>
        </ShareActionArea>
        <ShareActionArea
          shareProps={{
            path: `/posi/${action.id}`,
            text: "Mira mi acción social.",
            title: "Mira mi acción social.",
          }}
        >
          <IconButtonWithLabel>
            <Share fontSize="large" />
            <Typography fontSize={12}>Compartir</Typography>
          </IconButtonWithLabel>
        </ShareActionArea>
      </Toolbar>
    </AppBar>
  );
};

const Index = () => {
  const appState = useAppState();

  const IndexContent = ({ appState }: { appState: AppState }) => {
    const [posiData, loading, error] = useCurrentPosi(appState);
    const [socialProofs, socialProofsLoading, socialProofsError] =
      useCurrentSocialProofs(appState);
    const [myMaker, myMakerLoading, myMakerError] = useMyMaker(appState);
    const [maker, makerLoading, makerError] = useMaker(
      appState,
      posiData?.makerId
    );

    const Loading = () => {
      return (
        <Box>
          <Typography>Impacts: Loading...</Typography>
          <CircularProgress />
        </Box>
      );
    };

    return posiData ? (
      <Box>
        {error && (
          <Typography color={"red"}>Error: {JSON.stringify(error)}</Typography>
        )}
        {loading && <Loading />}
        {!loading && !error && posiData == undefined && (
          <Typography>No hay ninguna Action aquí.</Typography>
        )}
        {posiData && (
          /** Padding for bottom bar. */ <Box pb={15}>
            <AboutContent {...posiData} />
            {socialProofs && (
              <Stack spacing={1} m={1.5}>
                <Typography variant="h3">Testimonios</Typography>
                {socialProofs.length == 0 && (
                  <Typography>No hay testimonios.</Typography>
                )}
                <Grid container spacing={1}>
                  {socialProofs.map((socialProof) => {
                    return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        xl={2}
                        key={socialProof.id}
                      >
                        <SocialProofCard
                          key={socialProof.id}
                          socialProof={socialProof}
                          showAction={false}
                          showMaker={false}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Stack>
            )}
            {maker ? (
              myMaker && myMaker.id == maker.id ? (
                <AdminBottomBar action={posiData} myMaker={myMaker} />
              ) : (
                <SupportBottomBar beneficiary={{ maker, action: posiData }} />
              )
            ) : (
              <CenterBottomCircularProgress />
            )}
          </Box>
        )}
      </Box>
    ) : (
      <CircularProgress />
    );
  };
  return appState ? <IndexContent appState={appState} /> : <CircularProgress />;
};

export default Index;
