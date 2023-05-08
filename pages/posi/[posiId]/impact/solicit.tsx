import { CircularProgress, Stack, Typography } from "@mui/material";
import ShareActionArea from "../../../../common/components/shareActionArea";
import { Hearing } from "@mui/icons-material";
import { useRouter } from "next/router";
import { doc } from "firebase/firestore";
import { posiFormDataConverter } from "../../../../modules/posi/input/context";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { AppState, useAppState } from "../../../../common/context/appState";
import { makerConverter } from "../../../../common/context/weverse";

const Solicit = () => {
  const router = useRouter();
  const { posiId } = router.query;
  const appState = useAppState();

  const ContentSolicit = ({ appState }: { appState: AppState }) => {
    const posiDocRef = doc(
      appState.firestore,
      "impacts",
      String(posiId)
    ).withConverter(posiFormDataConverter);
    const [posi, posiLoading, posiError] = useDocumentData(posiDocRef);
    const PromptMaker = ({ makerId }: { makerId: string }) => {
      const makerDocRef = doc(
        appState.firestore,
        "makers",
        makerId
      ).withConverter(makerConverter);
      const [maker, makerLoading, makerError] = useDocumentData(makerDocRef);
      return maker ? (
        <Typography variant="h1">
          {maker.name}, ¡Obten los comentarios y obten más participación!
        </Typography>
      ) : (
        <CircularProgress />
      );
    };
    return posi ? (
      <Stack
        spacing={2}
        sx={{ justifyContent: "center", alignItems: "center", p: 2 }}
      >
        <PromptMaker makerId={posi.makerId} />
        {posi.howToIdentifyImpactedPeople ? (
          <Typography variant="h2">
            Escuchemos a los siguientes: {posi.howToIdentifyImpactedPeople}
          </Typography>
        ) : (
          <Typography>
            No indicaste a quien mandarle la encuesta, pero confiamos en tí de
            encontrarlos.
          </Typography>
        )}
        <ShareActionArea
          shareProps={{
            title: `Por favor dame tu opinion sobre mi acción social: ${posi.summary}`,
            text: `Por favor dame tu opinion sobre mi acción social: ${posi.summary}`,
            path: `/posi/${posiId}/impact/upload`,
          }}
        >
          <Hearing sx={{ fontSize: 160 }} />
        </ShareActionArea>
        <Typography>
          Haz clic en la oreja para enviarles una encuesta sobre esta acción.
        </Typography>
      </Stack>
    ) : (
      <CircularProgress />
    );
  };

  return appState ? (
    <ContentSolicit appState={appState} />
  ) : (
    <CircularProgress />
  );
};

export default Solicit;
