import { useRouter } from "next/router";
import {
  Box,
  CircularProgress,
  Fab,
  Link,
  SpeedDial,
  SpeedDialAction,
  Typography,
} from "@mui/material";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  AdminPanelSettings,
  Edit,
  Support as SupportIcon,
} from "@mui/icons-material";
import { doc, DocumentReference } from "firebase/firestore";
import LoadingFab from "../../../../common/components/loadingFab";
import { ShareProps } from "../../../../common/components/shareActionArea";
import { AppState, useAppState } from "../../../../common/context/appState";
import ImpactPage, { PageTypes } from "../../../../modules/posi/impactPage";
import Support from "../../../../common/components/support";
import AboutContent from "../../../../modules/posi/action/about";
import { useCurrentPosiId } from "../../../../modules/posi/context";
import { useMaker } from "../../../../common/context/weverseUtils";
import SolicitDialog from "../../../../common/components/solicitHelpDialog";
import { useState } from "react";
import { PosiFormData } from "shared";
import {
  makerConverter,
  posiFormDataConverter,
} from "../../../../common/utils/firebase";
import { getSharePropsForPosi } from "../../../../modules/posi/input/context";

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
            pathUnderSupport={`/posi/${posiId}/action`}
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

const Action = () => {
  const appState = useAppState();
  const posiId = useCurrentPosiId();

  const q =
    appState && posiId
      ? doc(appState.firestore, "impacts", String(posiId)).withConverter(
          posiFormDataConverter
        )
      : undefined;

  const QueriedAboutContent = ({
    posiDocRef,
  }: {
    posiDocRef: DocumentReference<PosiFormData>;
  }) => {
    const [posiData, loading, error] = useDocumentData(posiDocRef);

    const Loading = () => {
      return (
        <Box>
          <Typography>Impacts: Loading...</Typography>
          <CircularProgress />
        </Box>
      );
    };

    console.log(posiId);
    console.log(posiData);
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
  return (
    <ImpactPage type={PageTypes.action} id={String(posiId)}>
      {q ? <QueriedAboutContent posiDocRef={q} /> : <CircularProgress />}
    </ImpactPage>
  );
};

export default Action;
