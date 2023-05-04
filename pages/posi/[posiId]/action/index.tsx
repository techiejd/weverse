import { useRouter } from "next/router";
import { Box, CircularProgress, Fab, Link, Typography } from "@mui/material";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Edit } from "@mui/icons-material";
import { doc, DocumentReference } from "firebase/firestore";
import LoadingFab from "../../../../common/components/loadingFab";
import { ShareProps } from "../../../../common/components/shareActionArea";
import { AppState, useAppState } from "../../../../common/context/appState";
import { makerConverter } from "../../../../common/context/weverse";
import ImpactPage, { PageTypes } from "../../../../modules/posi/impactPage";
import {
  posiFormDataConverter,
  PosiFormData,
  getSharePropsForPosi,
} from "../../../../modules/posi/input/context";
import Support from "../../../../common/components/support";
import AboutContent from "../../../../modules/posi/action/about";

const SupportButton = ({
  shareProps,
  makerId,
}: {
  shareProps: ShareProps;
  makerId: string;
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

const EditButton = ({
  posiId,
  makerId,
  appState,
}: {
  posiId: string;
  makerId: string;
  appState: AppState;
}) => {
  const [user, userLoading, userError] = useAuthState(appState.auth);
  const makerDocRef = doc(appState.firestore, "makers", makerId);
  const [maker, makerLoading, makerError] = useDocumentData(
    makerDocRef.withConverter(makerConverter)
  );
  return (
    <>
      {maker?.ownerId == user?.uid && (
        <Fab
          sx={{
            position: "fixed",
            bottom: 64,
            right: 84,
          }}
          href={`/posi/${posiId}/action/edit`}
        >
          <Edit />
        </Fab>
      )}
    </>
  );
};

const Action = () => {
  const appState = useAppState();
  const router = useRouter();
  const { posiId } = router.query;

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

    return (
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
              shareProps={getSharePropsForPosi(posiData)}
              makerId={posiData.makerId}
            />
            {appState && (
              <EditButton
                posiId={String(posiData.id)}
                makerId={posiData.makerId}
                appState={appState}
              />
            )}
          </Box>
        )}
      </Box>
    );
  };
  return (
    <ImpactPage type={PageTypes.action} id={String(posiId)}>
      {q ? <QueriedAboutContent posiDocRef={q} /> : <CircularProgress />}
    </ImpactPage>
  );
};

export default Action;
