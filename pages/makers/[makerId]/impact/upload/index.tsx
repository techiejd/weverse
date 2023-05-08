import {
  Button,
  CircularProgress,
  Link,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import LogInPrompt from "../../../../../common/components/logInPrompt";
import { AppState, useAppState } from "../../../../../common/context/appState";
import {
  socialProof,
  socialProofConverter,
} from "../../../../../common/context/weverse";
import { useMyMaker } from "../../../../../common/context/weverseUtils";
import { useCurrentMaker } from "../../../../../modules/makers/context";
import { FileInput } from "../../../../../modules/posi/input";
import { useRouter } from "next/router";

//TODO(techiejd): WET -> DRY

const FormTitle = ({
  makerName,
  makerId,
}: {
  makerName: string;
  makerId: string;
}) => {
  return (
    <Typography variant="h2">
      <Link href={`/makers/${makerId}`}>{`${makerName}`}</Link>
      {` pide que des tu opinión sobre su impacto social.`}
    </Typography>
  );
};

const UploadForm = ({ appState }: { appState: AppState }) => {
  const [user, userLoading, userError] = useAuthState(appState.auth);
  const [error, setError] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | undefined | "loading">("");
  const [uploading, setUploading] = useState(false);
  const needsRatingMsg = "Calificación necesaria.";
  const [maker, makerLoading, makerError] = useCurrentMaker(appState);
  const [myMaker, myMakerLoading, myMakerError] = useMyMaker(appState);
  const router = useRouter();

  useEffect(() => {
    if (error == needsRatingMsg && rating != null) {
      setError("");
    }
  }, [rating, setError, error]);

  return maker && user ? (
    <Stack>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (rating == null) {
            setError(needsRatingMsg);
            return;
          }

          if (appState && maker && myMaker) {
            setUploading(true);
            const partialSocialProof = {
              rating: rating,
              byMaker: myMaker.id,
              forMaker: maker.id,
            };
            const socialProofEncoded = socialProof.parse(
              videoUrl
                ? {
                    videoUrl: videoUrl,
                    ...partialSocialProof,
                  }
                : partialSocialProof
            );

            await addDoc(
              collection(appState.firestore, `socialProofs`).withConverter(
                socialProofConverter
              ),
              socialProofEncoded
            );
            router.push(`/makers/${maker.id}/impact/upload/thanks`);
          } else {
            setError("Internal error.");
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
            <FormTitle makerName={maker.name} makerId={maker.id!} />
          ) : (
            <CircularProgress />
          )}
          <Typography>Califica el impacto social de la Maker:</Typography>
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
            Maker hasta ahora en tu vida. (30s - 5 minutos y opcional.)
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
  const appState = useAppState();
  // TODO(techiejd): Add a thank you and ask if they want to go back to that maker, back to all actions or home.
  return appState ? <UploadForm appState={appState} /> : <CircularProgress />;
};

export default Upload;
