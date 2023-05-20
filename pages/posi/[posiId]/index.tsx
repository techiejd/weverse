import {
  Box,
  CircularProgress,
  Grid,
  Link,
  SpeedDial,
  SpeedDialAction,
  Stack,
  Typography,
} from "@mui/material";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  AdminPanelSettings,
  Edit,
  Support as SupportIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { doc } from "firebase/firestore";
import LoadingFab from "../../../common/components/loadingFab";
import { ShareProps } from "../../../common/components/shareActionArea";
import SolicitDialog from "../../../common/components/solicitHelpDialog";
import { AppState, useAppState } from "../../../common/context/appState";
import { useMaker } from "../../../common/context/weverseUtils";
import { makerConverter } from "../../../common/utils/firebase";
import AboutContent from "../../../modules/posi/action/about";
import {
  useCurrentPosi,
  useCurrentPosiId,
  useCurrentSocialProofs,
} from "../../../modules/posi/context";
import { getSharePropsForPosi } from "../../../modules/posi/input/context";
import Support from "../../../common/components/support";
import SocialProofCard from "../../../modules/posi/socialProofCard";

const SupportButton = ({
  shareProps,
  makerId,
  posiId,
}: {
  shareProps: ShareProps;
  makerId: string;
  posiId: string;
}) => {
  const SupportButtonContent = ({ appState }: { appState: AppState }) => {
    // TODO(techiejd): create a userMaker(id).
    const makerDocRef = doc(appState.firestore, "makers", makerId);
    const [maker, makerLoading, error] = useDocumentData(
      makerDocRef.withConverter(makerConverter)
    );
    return maker ? (
      <Support
        howToSupport={maker.howToSupport ? maker.howToSupport : {}}
        shareProps={shareProps}
        addSocialProofPath={`/posi/${posiId}/impact/upload`}
      />
    ) : (
      <LoadingFab />
    );
  };

  const appState = useAppState();

  return appState ? (
    <SupportButtonContent appState={appState} />
  ) : (
    <LoadingFab />
  );
};

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

const Index = () => {
  const appState = useAppState();
  const posiId = useCurrentPosiId();

  const IndexContent = ({ appState }: { appState: AppState }) => {
    const [posiData, loading, error] = useCurrentPosi(appState);
    const [socialProofs, socialProofsLoading, socialProofsError] =
      useCurrentSocialProofs(appState);

    const Loading = () => {
      return (
        <Box>
          <Typography>Impacts: Loading...</Typography>
          <CircularProgress />
        </Box>
      );
    };

    return posiId ? (
      <Box>
        {error && (
          <Typography color={"red"}>Error: {JSON.stringify(error)}</Typography>
        )}
        {loading && <Loading />}
        {!loading && !error && posiData == undefined && (
          <Typography>No hay ninguna Action aquí.</Typography>
        )}
        {posiData && (
          <Box>
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
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Stack>
            )}
            <SupportButton
              shareProps={getSharePropsForPosi({
                summary: posiData!.summary!,
                id: posiData.id,
              })}
              makerId={posiData!.makerId!}
              posiId={posiId}
            />
            {appState && (
              <AdminButton
                posiId={String(posiData.id)}
                makerId={posiData!.makerId!}
                appState={appState}
              />
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
