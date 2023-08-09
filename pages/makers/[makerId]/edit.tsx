import { useState } from "react";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAppState } from "../../../common/context/appState";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { User } from "firebase/auth";
import { pickBy, identity } from "lodash";
import { makerConverter } from "../../../common/utils/firebase";
import { Maker, maker as makerSchema } from "../../../functions/shared/src";
import MakerInput from "../../../modules/makers/makerInput";
import { WithTranslationsStaticProps } from "../../../common/utils/translations";
import { CachePaths } from "../../../common/utils/staticPaths";
import { useTranslations } from "next-intl";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const Edit = () => {
  const editMakerTranslations = useTranslations("makers.edit");
  const appState = useAppState();
  const router = useRouter();
  const { makerId } = router.query;

  const MakerForm = ({ makerId }: { makerId: string }) => {
    const { user } = useAppState().authState;
    const makerDocRef = doc(
      appState.firestore,
      "makers",
      makerId
    ).withConverter(makerConverter);
    const [maker, makerLoading, makerError] = useDocumentData(
      makerDocRef.withConverter(makerConverter)
    );

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
            router.push(`/makers/${makerIn.id}`);
          }}
        >
          <MakerInput
            userName={user.displayName ? user.displayName : ""}
            val={maker}
            setVal={setMaker}
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
      {makerId ? <MakerForm makerId={String(makerId)} /> : <CircularProgress />}
    </Stack>
  );
};

export default Edit;
