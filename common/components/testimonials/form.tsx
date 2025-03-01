import {
  Button,
  CircularProgress,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FileInput } from "../../../modules/posi/input";
import { pickBy, identity } from "lodash";
import { useState, useEffect, useCallback, use } from "react";
import { z } from "zod";
import { Media, SocialProof, socialProof } from "../../../functions/shared/src";
import { useTranslations } from "next-intl";
import { writeBatch, doc, collection, Firestore } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAppState } from "../../context/appState";
import { pathAndType2FromCollectionId } from "../../context/weverseUtils";
import {
  useSocialProofConverter,
  useFromConverter,
} from "../../utils/firebase";

type onInteractionProp =
  | { type: "create"; parentPath: string }
  | {
      type: "update";
      path: string;
      fromPath: string;
    };

const workingSocialProof = socialProof
  .omit({ rating: true })
  .extend({ rating: z.number().nullable() });
type WorkingSocialProof = z.infer<typeof workingSocialProof>;

const useOnSubmitTestimonial = (parentPath: string | undefined) => {
  const appState = useAppState();
  const router = useRouter();
  const { asPath } = router;
  const socialProofConverter = useSocialProofConverter();
  const fromConverter = useFromConverter();

  const buildThankYouPath = (path: string) => {
    const parts = path.split("/");
    parts.pop();
    return `${parts.join("/")}/thanks`;
  };

  return useCallback(
    async (testimonial: SocialProof) => {
      if (!parentPath) throw new Error("parentPath is undefined");
      const batch = writeBatch(appState.firestore);
      const collectionPath = `${parentPath}/testimonials`;
      const testimonialDocRef = doc(
        collection(appState.firestore, collectionPath)
      ).withConverter(socialProofConverter);
      const testimonialFromPath = createTestimonialFromPath(
        appState.firestore,
        testimonial,
        testimonialDocRef
      );

      batch.set(testimonialDocRef, testimonial);
      batch.set(
        doc(appState.firestore, testimonialFromPath).withConverter(
          fromConverter
        ),
        { type: "testimonial", data: testimonial }
      );
      await batch.commit();

      router.push(buildThankYouPath(asPath));
    },
    [
      appState.firestore,
      asPath,
      fromConverter,
      parentPath,
      router,
      socialProofConverter,
    ]
  );
};

const buildThankYouPathForUpdate = (path: string) => {
  const parts = path.split("/testimonials/");
  parts.pop();
  parts.push("testimonials/upload/thanks");
  return `${parts.join("/")}`;
};

const useOnUpdateTestimonial = (
  path: string | undefined,
  fromPath: string | undefined
) => {
  const appState = useAppState();
  const router = useRouter();
  const { asPath } = router;
  const socialProofConverter = useSocialProofConverter();
  const fromConverter = useFromConverter();

  return useCallback(
    async (testimonial: SocialProof) => {
      if (!path || !fromPath)
        throw new Error(`path ${path} or fromPath ${fromPath} is undefined`);
      const batch = writeBatch(appState.firestore);
      const testimonialDocRef = doc(appState.firestore, path).withConverter(
        socialProofConverter
      );

      batch.update(testimonialDocRef, testimonial);
      batch.update(
        // No need to use `batch.set(memberFromTestimonialDoc,
        // { type: "testimonial", data }, { merge: true } );` because
        // we are completely overwriting the document.
        doc(appState.firestore, fromPath).withConverter(fromConverter),
        { type: "testimonial", data: testimonial }
      );
      await batch.commit();

      router.push(buildThankYouPathForUpdate(asPath));
    },
    [
      appState.firestore,
      asPath,
      fromConverter,
      fromPath,
      path,
      router,
      socialProofConverter,
    ]
  );
};

const useOnDeleteTestimonial = (
  path: string | undefined,
  fromPath: string | undefined
) => {
  const appState = useAppState();
  const router = useRouter();
  const { asPath } = router;
  const socialProofConverter = useSocialProofConverter();
  const fromConverter = useFromConverter();

  return useCallback(async () => {
    if (!path || !fromPath)
      throw new Error(`path ${path} or fromPath ${fromPath} is undefined`);
    const batch = writeBatch(appState.firestore);
    const testimonialDocRef = doc(appState.firestore, path).withConverter(
      socialProofConverter
    );

    batch.delete(testimonialDocRef);
    batch.delete(
      doc(appState.firestore, fromPath).withConverter(fromConverter)
    );
    await batch.commit();

    router.push(buildThankYouPathForUpdate(asPath));
  }, [
    appState.firestore,
    asPath,
    fromConverter,
    fromPath,
    path,
    router,
    socialProofConverter,
  ]);
};

const TestimonialsForm = ({
  onInteraction,
  initialTestimonial,
}: {
  onInteraction: onInteractionProp;
  initialTestimonial: WorkingSocialProof;
}) => {
  const isAction = !!initialTestimonial.forAction;
  const initialMedia = initialTestimonial.videoUrl
    ? ({ url: initialTestimonial.videoUrl, type: "video" } as Media)
    : undefined;

  const [error, setError] = useState("");
  const [rating, setRating] = useState<number | null>(
    initialTestimonial.rating
  );
  const [media, setMedia] = useState<Media | undefined | "loading">(
    initialMedia
  );
  const [text, setText] = useState(initialTestimonial.text ?? "");
  const [uploading, setUploading] = useState(false);
  const needsRatingMsg = "Calificación necesaria.";
  const formTranslations = useTranslations("testimonials.form");
  const inputTranslations = useTranslations("input");
  const callToActionTranslations = useTranslations("common.callToAction");
  const uploadActionTranslation = useTranslations("actions.upload");
  const maxLength = 500;

  const onSubmit = useOnSubmitTestimonial(
    onInteraction.type == "create" ? onInteraction?.parentPath : undefined
  );
  const onUpdate = useOnUpdateTestimonial(
    onInteraction.type == "update" ? onInteraction.path : undefined,
    onInteraction.type == "update" ? onInteraction.fromPath : undefined
  );
  const onDelete = useOnDeleteTestimonial(
    onInteraction.type == "update" ? onInteraction?.path : undefined,
    onInteraction.type == "update" ? onInteraction?.fromPath : undefined
  );
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
        const socialProofEncoded = socialProof.parse(
          pickBy(
            {
              rating: rating,
              byMember: initialTestimonial.byMember,
              forInitiative: initialTestimonial.forInitiative,
              forAction: initialTestimonial.forAction,
              videoUrl: media && media != "loading" ? media.url : undefined,
              text: text != "" ? text : undefined,
            },
            identity
          )
        );
        setUploading(true);
        if (onInteraction.type == "create") {
          await onSubmit(socialProofEncoded);
        } else {
          await onUpdate(socialProofEncoded);
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
          initialMedia={initialMedia}
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
        {media == "loading" || uploading ? (
          <CircularProgress />
        ) : onInteraction.type == "create" ? (
          <Button variant="contained" sx={{ mt: 3 }} type="submit">
            {uploadActionTranslation("submit")}
          </Button>
        ) : (
          <Stack direction={"row"} sx={{ mt: 3 }} spacing={1}>
            <Button
              variant="outlined"
              onClick={() => {
                onDelete();
              }}
            >
              {callToActionTranslations("delete")}
            </Button>
            <Button variant="contained" type="submit">
              {callToActionTranslations("update")}
            </Button>
          </Stack>
        )}
      </Stack>
    </form>
  );
};

export default TestimonialsForm;
function createTestimonialFromPath(
  firestore: Firestore,
  testimonial: WorkingSocialProof,
  testimonialDocRef: ReturnType<typeof doc>
) {
  return `${
    collection(firestore, testimonial.byMember, "from").path
  }/${pathAndType2FromCollectionId(testimonialDocRef.path, "testimonial")!}`;
}
