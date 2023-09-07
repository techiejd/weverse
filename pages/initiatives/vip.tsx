import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import {
  useActions,
  useMyInitiative,
  useSocialProofs,
} from "../../common/context/weverseUtils";
import LogInPrompt from "../../common/components/logInPrompt";
import { useVipState } from "../../common/utils/vip";
import { useEffect } from "react";
import { WithTranslationsStaticProps } from "../../common/utils/translations";
import { useTranslations } from "next-intl";
import UnderConstruction from "../../modules/posi/underConstruction";
import { asOneWePage } from "../../common/components/onewePage";

export const getStaticProps = WithTranslationsStaticProps();
const Vip = asOneWePage(() => {
  const router = useRouter();
  const [myInitiative] = useMyInitiative();
  const [socialProofs] = useSocialProofs(myInitiative?.id, "initiative");
  const [actions] = useActions(myInitiative?.id);
  const vipState = useVipState(myInitiative, socialProofs, actions);
  const vipTranslations = useTranslations("initiatives.vip");

  useEffect(() => {
    if (
      router.isReady &&
      myInitiative &&
      vipState.entryGiven != undefined &&
      !vipState.entryGiven
    ) {
      router.push(`/initiatives/${myInitiative.id}?vipDialogOpen=true`);
    }
  }, [myInitiative, vipState.entryGiven, router]);
  return myInitiative ? (
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
