import { useState } from "react";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAppState } from "../../../common/context/appState";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { User } from "firebase/auth";
import { pickBy, identity } from "lodash";
import { useMakerConverter } from "../../../common/utils/firebase";
import { Maker, maker as makerSchema } from "../../../functions/shared/src";
import InitiativeInput from "../../../modules/initiatives/input";
import {
  Locale2Messages,
  WithTranslationsStaticProps,
  spreadTranslationsStaticProps,
} from "../../../common/utils/translations";
import { CachePaths } from "../../../common/utils/staticPaths";
import { useTranslations } from "next-intl";
import { asOneWePage } from "../../../common/components/onewePage";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps(
  spreadTranslationsStaticProps
);
const Edit = asOneWePage((locale2Messages: Locale2Messages) => {
  const editMakerTranslations = useTranslations("makers.edit");
  const appState = useAppState();
  const router = useRouter();
  const { initiativeId } = router.query;

  const MakerForm = ({
    makerId,
    locale2Messages,
  }: {
    makerId: string;
    locale2Messages: Locale2Messages;
  }) => {
    const { user } = useAppState().authState;
    const makerConverter = useMakerConverter();
    const makerDocRef = doc(
      appState.firestore,
      "makers",
      makerId
    ).withConverter(makerConverter);
    const [maker] = useDocumentData(makerDocRef.withConverter(makerConverter));

    const MakerFormContent = ({
      user,
      makerIn,
    }: {
      user: User;
      makerIn: Maker;
    }) => {
      const callToActionTranslations = useTranslations("common.callToAction");
      const [maker, setMaker] = useState<Maker>(makerIn);
      const [uploading, setUploading] = useState(false);
      return (
        <form
          onSubmit={async (e) => {
            setUploading(true);
            e.preventDefault();
            const cleanedMaker = pickBy(maker, identity);
            const parsedMaker = makerSchema.parse(cleanedMaker);
            await setDoc(makerDocRef, parsedMaker);
            router.push(`/initiatives/${makerIn.id}`);
          }}
        >
          <InitiativeInput
            userName={user.displayName ? user.displayName : ""}
            val={maker}
            setVal={setMaker}
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
            {uploading || maker.pic == "loading" ? (
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
      (user && maker && <MakerFormContent user={user} makerIn={maker} />) || (
        <CircularProgress />
      )
    );
  };
  return (
    <Stack sx={{ justifyContent: "center", alignItems: "center" }} spacing={2}>
      <Typography variant="h1">{editMakerTranslations("title")}</Typography>
      <Typography variant="h2">
        {editMakerTranslations("makerDefinition")}
      </Typography>
      {initiativeId ? (
        <MakerForm
          makerId={String(initiativeId)}
          locale2Messages={locale2Messages}
        />
      ) : (
        <CircularProgress />
      )}
    </Stack>
  );
});

export default Edit;
