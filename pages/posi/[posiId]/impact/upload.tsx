import {
  Button,
  CircularProgress,
  Link,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { FileInput } from "../../../../modules/posi/input";
import { useEffect, useState } from "react";
import { addDoc, collection, doc } from "firebase/firestore";
import { AppState, useAppState } from "../../../../common/context/appState";
import { useRouter } from "next/router";
import {
  makerConverter,
  socialProof,
  socialProofConverter,
} from "../../../../common/context/weverse";
import { useAuthState } from "react-firebase-hooks/auth";
import LogInPrompt from "../../../../common/components/logInPrompt";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { posiFormDataConverter } from "../../../../modules/posi/input/context";
import { useMyMaker } from "../../../../common/context/weverseUtils";

const FormTitle = ({
  actionTitle,
  actionId,
  makerId,
  appState,
}: {
  actionTitle: string;
  actionId: string;
  makerId: string;
  appState: AppState;
}) => {
  const makerDocRef = doc(appState.firestore, "makers", makerId).withConverter(
    makerConverter
  );
  const [maker, makerLoading, makerError] = useDocumentData(makerDocRef);
  return (
    <Typography variant="h2">
      <Link href={`/makers/${makerId}`}>{`${maker?.name}`}</Link>
      {` pide que des tu opinión sobre `}
      <Link
        href={`/posi/${actionId}/action`}
      >{`la acción social: ${actionTitle}`}</Link>
    </Typography>
  );
};

const UploadForm = ({
  appState,
  posiId,
}: {
  appState: AppState;
  posiId: string;
}) => {
  const [user, userLoading, userError] = useAuthState(appState.auth);
  const [error, setError] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | undefined | "loading">("");
  const [uploading, setUploading] = useState(false);
  const needsRatingMsg = "Calificación necesaria.";

  const posiDocRef = doc(
    appState.firestore,
    "impacts",
    String(posiId)
  ).withConverter(posiFormDataConverter);
  const [action, actionLoading, actionError] = useDocumentData(posiDocRef);

  const [myMaker, myMakerLoading, myMakerError] = useMyMaker(appState);

  useEffect(() => {
    if (error == needsRatingMsg && rating != null) {
      setError("");
    }
  }, [rating, setError, error]);

  return action && user ? (
    <Stack>
      <form
        onSubmit={async (e) => {
          console.log("Being called");
          e.preventDefault();
          if (rating == null) {
            setError(needsRatingMsg);
            e.preventDefault();
            return;
          }

          console.log("action: ", action);
          if (appState && posiId && myMaker) {
            setUploading(true);
            const partialSocialProof = {
              rating: rating,
              byMaker: myMaker.id,
              forMaker: action.makerId,
              forAction: action.id,
            };
            const socialProofEncoded = socialProof.parse(
              videoUrl
                ? {
                    videoUrl: videoUrl,
                    ...partialSocialProof,
                  }
                : partialSocialProof
            );
            console.log("SocialProof: ", socialProofEncoded);

            await addDoc(
              collection(appState.firestore, `socialProofs`).withConverter(
                socialProofConverter
              ),
              socialProofEncoded
            );
          } else {
            setError("Internal error.");
            e.preventDefault();
          }
        }}
      >
        <Stack
          spacing={2}
          sx={{ justifyContent: "center", alignItems: "center" }}
          p={2}
        >
          <Typography variant="h1">Queremos escuchar de ¡tí!</Typography>
          {appState ? (
            <FormTitle
              actionId={String(action.id)}
              actionTitle={action.summary}
              makerId={action.makerId}
              appState={appState}
            />
          ) : (
            <CircularProgress />
          )}
          <Typography>Califica la acción:</Typography>
          <Rating
            value={rating}
            aria-required={true}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
          {error != "" && <Typography color="red">{error}</Typography>}
          <Typography>
            En forma selfie, cuentenos con detalle qué impacto ha tenido la
            acción hasta ahora en tu vida. (30s - 5 minutos y opcional.)
          </Typography>
          <FileInput
            setFileUrl={setVideoUrl}
            minFileSize={104857 /** 0.1MB */}
            maxFileSize={2147483648 /** 2GB */}
            accept={"video"}
            metadata={{ impactId: "", isTestimonial: "true", from: "" }}
          />
          {user &&
            (videoUrl == "loading" || uploading ? (
              <CircularProgress />
            ) : (
              <Button type="submit" variant="contained">
                Vociferar
              </Button>
            ))}
        </Stack>
      </form>
      {!user && (
        <LogInPrompt title="Para vociferar, hay que ingresar al sistema." />
      )}
    </Stack>
  ) : (
    <CircularProgress />
  );
};

const Upload = () => {
  const router = useRouter();
  const { posiId } = router.query;
  const appState = useAppState();

  // TODO(techiejd): Add a thank you and ask if they want to go back to that action, the testimonials of that action or back to all actions.

  return appState && router.isReady ? (
    <UploadForm posiId={String(posiId)} appState={appState} />
  ) : (
    <CircularProgress />
  );
};

export default Upload;
