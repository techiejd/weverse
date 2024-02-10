import { useState } from "react";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { collection, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { User } from "firebase/auth";
import { pickBy, identity } from "lodash";
import { useTranslations } from "next-intl";
import { asOneWePage } from "../../../../common/components/onewePage";
import { useAppState } from "../../../../common/context/appState";
import { useInitiativeConverter } from "../../../../common/utils/firebase";
import { CachePaths } from "../../../../common/utils/staticPaths";
import {
  WithTranslationsStaticProps,
  Locale2Messages,
} from "../../../../common/utils/translations";
import {
  Initiative,
  initiative,
  zeroRatings,
} from "../../../../functions/shared/src";
import InitiativeInput from "../../../../modules/initiatives/input";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const InitiativeFormContent = ({
  user,
  locale2Messages,
}: {
  user: User;
  locale2Messages: Locale2Messages;
}) => {
  const appState = useAppState();
  const callToActionTranslations = useTranslations("common.callToAction");
  const [workingInitiative, setWorkingInitiative] = useState<Initiative>({
    name: user.displayName!,
    type: "individual",
    ratings: zeroRatings,
    locale: appState.languages.primary,
  });
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { flow } = router.query;
  const initiativeConverter = useInitiativeConverter();
  const initiativesCollection = collection(
    appState.firestore,
    "members",
    user.uid,
    "initiatives"
  );

  return (
    <form
      onSubmit={async (e) => {
        setUploading(true);
        e.preventDefault();
        const cleanedInitiative = pickBy(workingInitiative, identity);
        const parsedInitiative = initiative.parse(cleanedInitiative);
        const initiativeDoc = doc(initiativesCollection).withConverter(
          initiativeConverter
        );
        await setDoc(initiativeDoc, parsedInitiative);
        const nextPage = flow
          ? `/${initiativeDoc.path}?flow=true`
          : `/${initiativeDoc.path}`;
        router.push(nextPage);
      }}
    >
      <InitiativeInput
        userName={user.displayName ? user.displayName : ""}
        val={workingInitiative}
        setVal={setWorkingInitiative}
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
        {uploading || workingInitiative.pic == "loading" ? (
          <CircularProgress />
        ) : (
          <Button type="submit" variant="contained">
            {callToActionTranslations("publish")}
          </Button>
        )}
      </Stack>
    </form>
  );
};
const InitiativeForm = (props: { locale2Messages: Locale2Messages }) => {
  const { user } = useAppState().authState;
  return (
    (user && <InitiativeFormContent user={user} {...props} />) || (
      <CircularProgress />
    )
  );
};

const Add = asOneWePage((locale2Messages: Locale2Messages) => {
  const editInitiativeTranslations = useTranslations("initiatives.edit");
  return (
    <Stack sx={{ justifyContent: "center", alignItems: "center" }} spacing={2}>
      <Typography variant="h1">
        {editInitiativeTranslations("publishTitle")}
      </Typography>
      <Typography variant="h2">
        {editInitiativeTranslations("initiativeDefinition")}
      </Typography>
      <InitiativeForm locale2Messages={locale2Messages} />
    </Stack>
  );
});

export default Add;
