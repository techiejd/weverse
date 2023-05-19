import {
  Stack,
  Typography,
  Rating,
  TextField,
  CircularProgress,
  Button,
} from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  Maker,
  PosiFormData,
  Media,
  socialProof,
} from "../../functions/shared/src";
import { FileInput } from "../../modules/posi/input";
import { AppState } from "../context/appState";
import { useMyMaker } from "../context/weverseUtils";
import { socialProofConverter } from "../utils/firebase";
import LogInPrompt from "./logInPrompt";
import MakerCard from "../../modules/makers/MakerCard";
import ImpactCard from "../../modules/posi/action/card";
import { identity, pickBy } from "lodash";

const UploadSocialProofForm = ({
  forMaker,
  forAction,
  appState,
}: {
  forMaker: Maker;
  forAction?: PosiFormData;
  appState: AppState;
}) => {
  const [myMaker, myMakerLoading, myMakerError] = useMyMaker(appState);
  const [error, setError] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [media, setMedia] = useState<Media | undefined | "loading">(undefined);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const needsRatingMsg = "Calificación necesaria.";
  const router = useRouter();

  useEffect(() => {
    if (error == needsRatingMsg && rating != null) {
      setError("");
    }
  }, [rating, setError, error]);

  return (
    <Stack>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (rating == null) {
            setError(needsRatingMsg);
            return;
          }

          if (myMaker) {
            setUploading(true);
            console.log({
              rating: rating,
              byMaker: myMaker.id,
              forMaker: forMaker.id,
              forAction: forAction?.id,
              videoUrl: media && media != "loading" ? media.url : undefined,
              text: text != "" ? text : undefined,
            });
            const socialProofEncoded = socialProof.parse(
              pickBy(
                {
                  rating: rating,
                  byMaker: myMaker.id,
                  forMaker: forMaker.id,
                  forAction: forAction?.id,
                  videoUrl: media && media != "loading" ? media.url : undefined,
                  text: text != "" ? text : undefined,
                },
                identity
              )
            );

            await addDoc(
              collection(appState.firestore, `socialProofs`).withConverter(
                socialProofConverter
              ),
              socialProofEncoded
            );

            forAction
              ? router.push(`/posi/${forAction.id}/impact/upload/thanks`)
              : router.push(`/makers/${forMaker.id}/impact/upload/thanks`);
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
          <Stack
            spacing={1}
            sx={{ justifyContent: "center", alignItems: "center" }}
            p={2}
          >
            <Typography variant="h2">
              <Link href={`/makers/${forMaker.id}`}>{`${forMaker.name}:`}</Link>
            </Typography>
            <MakerCard makerId={forMaker.id!} />
            <Typography variant="h2">
              {` Pide que des tu opinión sobre `}
              {forAction ? (
                <Link
                  href={`/posi/${forAction.id}`}
                >{`la acción social: ${forAction.summary}.`}</Link>
              ) : (
                "su impacto social."
              )}
            </Typography>
            {forAction && <ImpactCard posiData={forAction} />}
          </Stack>
          <Typography variant="h2">Califica la acción:</Typography>
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
            setMedia={setMedia}
            maxFileSize={2147483648 /** 2GB */}
            accept={"video"}
            metadata={{ impactId: "", isTestimonial: "true", from: "" }}
          />
          <Typography>
            En forma escrita, cuentenos con detalle qué impacto ha tenido la
            acción hasta ahora en tu vida. (500 caracteres)
          </Typography>
          <TextField
            label="Opinión escrita."
            multiline
            rows={4}
            inputProps={{ maxLength: 500 }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            sx={{ maxWidth: 700, width: "100%" }}
          />
          {myMaker &&
            (media == "loading" || uploading ? (
              <CircularProgress />
            ) : (
              <Button type="submit" variant="contained">
                Dar opinión
              </Button>
            ))}
        </Stack>
      </form>
      {!myMaker && (
        <LogInPrompt title="Para dar tu opinión, hay que ingresar al sistema." />
      )}
    </Stack>
  );
};

export default UploadSocialProofForm;
