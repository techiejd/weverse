import { useRouter } from "next/router";
import ImpactPage, { PageTypes } from "../../../modules/posi/impactPage";
import AboutContent from "../../../modules/posi/impactPage/about/AboutContent";
import {
  PosiFormData,
  posiFormDataConverter,
} from "../../../modules/posi/input/context";
import { doc, DocumentReference } from "firebase/firestore";
import { useAppState } from "../../../common/context/appState";
import { z } from "zod";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useDocumentData } from "react-firebase-hooks/firestore";

const About = () => {
  const appState = useAppState();
  const router = useRouter();
  const { posiId } = router.query;

  const q = appState
    ? doc(
        appState.firestore,
        "impacts",
        z.string().parse(posiId)
      ).withConverter(posiFormDataConverter)
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
          <Typography>No hay ningun impacto aquí.</Typography>
        )}
        {posiData && (
          <AboutContent {...posiData} support={{ shareId: String(posiId) }} />
        )}
      </Box>
    );
  };
  return (
    <ImpactPage type={PageTypes.about} id={String(posiId)}>
      {q ? <QueriedAboutContent posiDocRef={q} /> : <CircularProgress />}
    </ImpactPage>
  );
};

export default About;
