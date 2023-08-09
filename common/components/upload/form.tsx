import {
  Button,
  CircularProgress,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FileInput } from "../../../modules/posi/input";
import { addDoc, collection } from "firebase/firestore";
import { pickBy, identity } from "lodash";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Maker, Media, socialProof } from "../../../functions/shared/src";
import { useMyMaker } from "../../context/weverseUtils";
import { socialProofConverter } from "../../utils/firebase";
import { PosiFormData } from "../../../functions/shared/lib";
import { useAppState } from "../../context/appState";
import { useTranslations } from "next-intl";

const UploadSocialProofForm = ({
  forMaker,
  forAction,
}: {
  forMaker: Maker;
  forAction?: PosiFormData;
}) => {
  const appState = useAppState();
  const [myMaker, myMakerLoading, myMakerError] = useMyMaker();
  const [error, setError] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [media, setMedia] = useState<Media | undefined | "loading">(undefined);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const needsRatingMsg = "Calificación necesaria.";
  const router = useRouter();
  const formTranslations = useTranslations("testimonials.form");
  const inputTranslations = useTranslations("input");
  const maxLength = 500;
  useEffect(() => {
    if (error == needsRatingMsg && rating != null) {
      setError("");
    }
  }, [rating, setError, error]);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (rating == null) {
          setError(needsRatingMsg);
          return;
        }

        if (myMaker) {
          setUploading(true);
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
        <Typography variant="h2">
          {formTranslations("rate", { forAction: !!forAction })}
        </Typography>
        <Rating
          value={rating}
          aria-required={true}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
        />
        {error != "" && <Typography color="red">{error}</Typography>}
        <Typography>
          {`${formTranslations("inVideoFormat")}, ${formTranslations(
            "whatImpactPrompt",
            { forAction: !!forAction }
          )}`}
          <br />({formTranslations("videoSuggestions")})
        </Typography>
        <FileInput
          setMedia={setMedia}
          maxFileSize={2147483648 /** 2GB */}
          accept={"video"}
          metadata={{ impactId: "", isTestimonial: "true", from: "" }}
        />
        <Typography>
          {`${formTranslations("inTextFormat")}, ${formTranslations(
            "whatImpactPrompt",
            { forAction: !!forAction }
          )}`}
          <br />(
          {formTranslations("andOptional", {
            numChars: inputTranslations("numChars", { numChars: maxLength }),
          })}
          )
        </Typography>
        <TextField
          label={formTranslations("writtenTestimonial")}
          multiline
          rows={4}
          inputProps={{ maxLength }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ maxWidth: 700, width: "100%" }}
        />
        {myMaker &&
          (media == "loading" || uploading ? (
            <CircularProgress />
          ) : (
            <Button type="submit" variant="contained">
              {formTranslations("submit")}
            </Button>
          ))}
      </Stack>
    </form>
  );
};

export default UploadSocialProofForm;
