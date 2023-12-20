import {
  Button,
  CircularProgress,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FileInput } from "../../../modules/posi/input";
import { collection, doc, writeBatch } from "firebase/firestore";
import { pickBy, identity } from "lodash";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Media, socialProof } from "../../../functions/shared/src";
import { useMyMember } from "../../context/weverseUtils";
import {
  useFromConverter,
  useSocialProofConverter,
} from "../../utils/firebase";
import { useAppState } from "../../context/appState";
import { useTranslations } from "next-intl";
import { useCurrentInitiative } from "../../../modules/initiatives/context";
import { useCurrentPosi } from "../../../modules/posi/context";

const buildThankYouPath = (path: string) => {
  const parts = path.split("/");
  parts.pop();
  return `${parts.join("/")}/thanks`;
};

const UploadSocialProofForm = () => {
  const appState = useAppState();
  const router = useRouter();
  const { asPath } = router;
  const [forInitiative] = useCurrentInitiative();
  const [forAction] = useCurrentPosi();
  const isAction = !!forAction;

  const [myMember] = useMyMember();
  const [error, setError] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [media, setMedia] = useState<Media | undefined | "loading">(undefined);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const needsRatingMsg = "Calificación necesaria.";
  const formTranslations = useTranslations("testimonials.form");
  const inputTranslations = useTranslations("input");
  const maxLength = 500;
  const socialProofConverter = useSocialProofConverter();
  const fromConverter = useFromConverter();
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

        if (myMember) {
          setUploading(true);
          if (!forInitiative) {
            return;
          }
          const socialProofEncoded = socialProof.parse(
            pickBy(
              {
                rating: rating,
                byMember: myMember.path,
                forInitiative: forInitiative.path,
                forAction: forAction?.path,
                videoUrl: media && media != "loading" ? media.url : undefined,
                text: text != "" ? text : undefined,
              },
              identity
            )
          );

          const batch = writeBatch(appState.firestore);
          const collectionPath = `${
            isAction ? forAction.path! : forInitiative.path!
          }/testimonials`;
          batch.set(
            doc(collection(appState.firestore, collectionPath)).withConverter(
              socialProofConverter
            ),
            socialProofEncoded
          );
          batch.set(
            doc(
              collection(appState.firestore, myMember.path!, "from")
            ).withConverter(fromConverter),
            { type: "testimonial", data: socialProofEncoded }
          );
          await batch.commit();

          router.push(buildThankYouPath(asPath));
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
          {formTranslations("rate", { forAction: isAction })}
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
            { forAction: isAction }
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
            { forAction: isAction }
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
        {myMember &&
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
