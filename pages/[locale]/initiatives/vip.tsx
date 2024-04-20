import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import {
  useActions,
  useMyInitiatives,
  useSocialProofs,
} from "../../../common/context/weverseUtils";
import LogInPrompt from "../../../common/components/logInPrompt";
import { useVipState } from "../../../common/utils/vip";
import { useEffect } from "react";
import {
  localesSpreadPaths,
  WithTranslationsStaticProps,
} from "../../../common/utils/translations";
import { useTranslations } from "next-intl";
import UnderConstruction from "../../../modules/posi/underConstruction";
import { asOneWePage } from "../../../common/components/onewePage";

// TODO(techiejd): Maybe remove or do something about this feature. It is unused and stale.
export const getStaticProps = WithTranslationsStaticProps();
export const getStaticPaths = localesSpreadPaths;

const Vip = asOneWePage(() => {
  const router = useRouter();
  const [myInitiatives] = useMyInitiatives();
  const [socialProofs] = useSocialProofs(
    myInitiatives?.[0]?.path,
    "initiative"
  );
  const [actions] = useActions(myInitiatives?.[0]?.path);
  const vipState = useVipState(myInitiatives?.[0], socialProofs, actions);
  const vipTranslations = useTranslations("initiatives.vip");

  useEffect(() => {
    if (
      router.isReady &&
      myInitiatives &&
      vipState.entryGiven != undefined &&
      !vipState.entryGiven
    ) {
      router.push(`${myInitiatives?.[0].path}?vipDialogOpen=true`);
    }
  }, [myInitiatives, vipState.entryGiven, router]);
  return myInitiatives ? (
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
