import { useState } from "react";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { User } from "firebase/auth";
import { pickBy, identity } from "lodash";
import { useTranslations } from "next-intl";
import { useCurrentInitiative } from "../../../../../modules/initiatives/context";
import { asOneWePage } from "../../../../../common/components/onewePage";
import { useAppState } from "../../../../../common/context/appState";
import { useInitiativeConverter } from "../../../../../common/utils/firebase";
import { CachePaths } from "../../../../../common/utils/staticPaths";
import {
  WithTranslationsStaticProps,
  Locale2Messages,
} from "../../../../../common/utils/translations";
import { Initiative, initiative } from "../../../../../functions/shared/src";
import InitiativeInput from "../../../../../modules/initiatives/input";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const InitiativeFormContent = ({
  user,
  initiativeIn,
  locale2Messages,
}: {
  user: User;
  initiativeIn: Initiative;
  locale2Messages: Locale2Messages;
}) => {
  const appState = useAppState();
  const callToActionTranslations = useTranslations("common.callToAction");
  const [workingInitiative, setWorkingInitiative] =
    useState<Initiative>(initiativeIn);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const initiativeConverter = useInitiativeConverter();

  return (
    <form
      onSubmit={async (e) => {
        setUploading(true);
        e.preventDefault();
        const cleanedInitiative = pickBy(workingInitiative, identity);
        const parsedInitiative = initiative.parse(cleanedInitiative);
        await updateDoc(
          doc(appState.firestore, initiativeIn.path!).withConverter(
            initiativeConverter
          ),
          parsedInitiative
        );
        router.push(`/${initiativeIn.path}`);
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
            {callToActionTranslations("update")}
          </Button>
        )}
      </Stack>
    </form>
  );
};
const InitiativeForm = (props: { locale2Messages: Locale2Messages }) => {
  const [currentIniative] = useCurrentInitiative();
  const { user } = useAppState().authState;
  return (
    (user && currentIniative && (
      <InitiativeFormContent
        user={user}
        initiativeIn={currentIniative}
        {...props}
      />
    )) || <CircularProgress />
  );
};

const Edit = asOneWePage((locale2Messages: Locale2Messages) => {
  const editInitiativeTranslations = useTranslations("initiatives.edit");
  return (
    <Stack sx={{ justifyContent: "center", alignItems: "center" }} spacing={2}>
      <Typography variant="h1">
        {editInitiativeTranslations("title")}
      </Typography>
      <Typography variant="h2">
        {editInitiativeTranslations("initiativeDefinition")}
      </Typography>
      <InitiativeForm locale2Messages={locale2Messages} />
    </Stack>
  );
});

export default Edit;
