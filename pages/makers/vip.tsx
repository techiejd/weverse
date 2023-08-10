import { Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import {
  useActions,
  useMyMaker,
  useSocialProofs,
} from "../../common/context/weverseUtils";
import LogInPrompt from "../../common/components/logInPrompt";
import { calculateVipState } from "../../common/utils/vip";
import { useEffect } from "react";
import { WithTranslationsStaticProps } from "../../common/utils/translations";
import { useTranslations } from "next-intl";
import UnderConstruction from "../../modules/posi/underConstruction";
import { asOneWePage } from "../../common/components/onewePage";

export const getStaticProps = WithTranslationsStaticProps();
const Vip = asOneWePage(() => {
  const router = useRouter();
  const [myMaker] = useMyMaker();
  const [socialProofs] = useSocialProofs(myMaker?.id, "maker");
  const [actions] = useActions(myMaker?.id);
  const vipState = calculateVipState(myMaker, socialProofs, actions);
  const vipTranslations = useTranslations("makers.vip");

  useEffect(() => {
    if (
      router.isReady &&
      myMaker &&
      vipState.entryGiven != undefined &&
      !vipState.entryGiven
    ) {
      router.push(`/makers/${myMaker.id}?vipDialogOpen=true`);
    }
  }, [myMaker, vipState.entryGiven, router]);
  return myMaker ? (
    <Stack spacing={2} p={2} alignItems="center">
      <Typography variant="h1" textAlign="center">
        {vipTranslations("welcome")}
      </Typography>
      <Typography>{vipTranslations("underConstruction")}</Typography>
      <UnderConstruction />
    </Stack>
  ) : (
    <LogInPrompt title={vipTranslations("logInPrompt")} />
  );
});

export default Vip;
