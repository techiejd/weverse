import { useState } from "react";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAppState } from "../../../common/context/appState";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { User } from "firebase/auth";
import { pickBy, identity } from "lodash";
import { useInitiativeConverter } from "../../../common/utils/firebase";
import {
  Initiative,
  initiative as initiativeSchema,
} from "../../../functions/shared/src";
import InitiativeInput from "../../../modules/initiatives/input";
import {
  Locale2Messages,
  WithTranslationsStaticProps,
} from "../../../common/utils/translations";
import { CachePaths } from "../../../common/utils/staticPaths";
import { useTranslations } from "next-intl";
import { asOneWePage } from "../../../common/components/onewePage";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const Edit = asOneWePage((locale2Messages: Locale2Messages) => {
  const editInitiativeTranslations = useTranslations("initiatives.edit");
  const appState = useAppState();
  const router = useRouter();
  const { initiativeId } = router.query;

  const InitiativeForm = ({
    initiativeId,
    locale2Messages,
  }: {
    initiativeId: string;
    locale2Messages: Locale2Messages;
  }) => {
    const { user } = useAppState().authState;
    const initiativeConverter = useInitiativeConverter();
    const initiativeDocRef = doc(
      appState.firestore,
      "initiatives",
      initiativeId
    ).withConverter(initiativeConverter);
    const [initiative] = useDocumentData(
      initiativeDocRef.withConverter(initiativeConverter)
    );

    const InitiativeFormContent = ({
      user,
      initiativeIn,
    }: {
      user: User;
      initiativeIn: Initiative;
    }) => {
      const callToActionTranslations = useTranslations("common.callToAction");
      const [initiative, setInitiative] = useState<Initiative>(initiativeIn);
      const [uploading, setUploading] = useState(false);
      return (
        <form
          onSubmit={async (e) => {
            setUploading(true);
            e.preventDefault();
            const cleanedInitiative = pickBy(initiative, identity);
            const parsedInitiative = initiativeSchema.parse(cleanedInitiative);
            await setDoc(initiativeDocRef, parsedInitiative);
            router.push(`/initiatives/${initiativeIn.id}`);
          }}
        >
          <InitiativeInput
            userName={user.displayName ? user.displayName : ""}
            val={initiative}
            setVal={setInitiative}
            locale2Messages={locale2Messages}
          />
          <Stack
            sx={{
              width: "100%",
              alignItems: "center",
              justifyItems: "center",
              pb: 2,
            }}
          >
            {uploading || initiative.pic == "loading" ? (
              <CircularProgress />
            ) : (
              <Button type="submit" variant="contained">
                {callToActionTranslations("update")}
              </Button>
            )}
          </Stack>
        </form>
      );
    };

    return (
      (user && initiative && (
        <InitiativeFormContent user={user} initiativeIn={initiative} />
      )) || <CircularProgress />
    );
  };
  return (
    <Stack sx={{ justifyContent: "center", alignItems: "center" }} spacing={2}>
      <Typography variant="h1">
        {editInitiativeTranslations("title")}
      </Typography>
      <Typography variant="h2">
        {editInitiativeTranslations("initiativeDefinition")}
      </Typography>
      {initiativeId ? (
        <InitiativeForm
          initiativeId={String(initiativeId)}
          locale2Messages={locale2Messages}
        />
      ) : (
        <CircularProgress />
      )}
    </Stack>
  );
});

export default Edit;
