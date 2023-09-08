import {
  AppBar,
  Box,
  CircularProgress,
  Grid,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import Handshake from "@mui/icons-material/Handshake";
import Hearing from "@mui/icons-material/Hearing";
import Share from "@mui/icons-material/Share";
import { useState } from "react";
import ShareActionArea from "../../../common/components/shareActionArea";
import SolicitDialog from "../../../common/components/solicitHelpDialog";
import {
  useInitiative,
  useMyInitiative,
} from "../../../common/context/weverseUtils";
import AboutContent from "../../../modules/posi/action/about";
import {
  useCurrentPosi,
  useCurrentSocialProofs,
} from "../../../modules/posi/context";
import SupportBottomBar from "../../../common/components/supportBottomBar";
import SocialProofCard from "../../../modules/posi/socialProofCard";
import CenterBottomCircularProgress from "../../../common/components/centerBottomCircularProgress";
import { Initiative, PosiFormData } from "../../../functions/shared/src";
import CenterBottomFab from "../../../common/components/centerBottomFab";
import IconButtonWithLabel from "../../../common/components/iconButtonWithLabel";
import {
  WithTranslationsStaticProps,
  useLocalizedPresentationInfo,
} from "../../../common/utils/translations";
import { CachePaths } from "../../../common/utils/staticPaths";
import { useTranslations } from "next-intl";
import { asOneWePage } from "../../../common/components/onewePage";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();

const AdminBottomBar = ({
  action,
  myInitiative,
}: {
  action: PosiFormData;
  myInitiative: Initiative;
}) => {
  const [solicitDialogOpen, setSolicitDialogOpen] = useState(false);
  const solicitOpinionPath = `/posi/${action.id}/impact/upload`;
  const callToActionTranslations = useTranslations("common.callToAction");
  const solicitTranslations = useTranslations("actions.solicit");
  const presentationInfo = useLocalizedPresentationInfo(action);
  const initiativePresentationInfo = useLocalizedPresentationInfo(myInitiative);
  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{ top: "auto", bottom: 16, borderRadius: 8, boxShadow: 8 }}
    >
      <SolicitDialog
        open={solicitDialogOpen}
        setOpen={setSolicitDialogOpen}
        howToSupport={initiativePresentationInfo?.howToSupport || {}}
        solicitOpinionPath={`/posi/${action.id}/impact/upload`}
        pathUnderSupport={`/posi/${action.id}`}
        editInitiativePath={`/initiatives/${myInitiative.id}/edit`}
      />
      <Toolbar>
        <IconButtonWithLabel href={`/posi/${action.id}/action/edit`}>
          <Edit />
          <Typography>{callToActionTranslations("edit")}</Typography>
        </IconButtonWithLabel>
        <CenterBottomFab
          color="secondary"
          aria-label="add"
          sx={{ width: 70, height: 70 }}
          onClick={() => {
            setSolicitDialogOpen(true);
          }}
        >
          <Handshake fontSize="large" />
          <Typography fontSize={12}>
            {solicitTranslations("support")}
          </Typography>
        </CenterBottomFab>
        <Box sx={{ flexGrow: 1 }} />
        <ShareActionArea
          shareProps={{
            path: solicitOpinionPath,
            title: solicitTranslations("requests.opinion", {
              summary: presentationInfo?.summary,
            }),
          }}
        >
          <IconButtonWithLabel>
            <Hearing fontSize="large" />
            <Typography fontSize={12}>
              {solicitTranslations("testimonial")}
            </Typography>
          </IconButtonWithLabel>
        </ShareActionArea>
        <ShareActionArea
          shareProps={{
            path: `/posi/${action.id}`,
            title: solicitTranslations("requests.look"),
          }}
        >
          <IconButtonWithLabel>
            <Share fontSize="large" />
            <Typography fontSize={12}>
              {callToActionTranslations("share")}
            </Typography>
          </IconButtonWithLabel>
        </ShareActionArea>
      </Toolbar>
    </AppBar>
  );
};

const Index = asOneWePage(() => {
  const [posiData, loading, error] = useCurrentPosi();
  const [socialProofs] = useCurrentSocialProofs();
  const [myInitiative] = useMyInitiative();
  const [initiative] = useInitiative(posiData?.makerId);

  const Loading = () => {
    return (
      <Box>
        <Typography>Impacts: Loading...</Typography>
        <CircularProgress />
      </Box>
    );
  };

  const t = useTranslations("actions");

  return posiData ? (
    <Box>
      {error && (
        <Typography color={"red"}>Error: {JSON.stringify(error)}</Typography>
      )}
      {loading && <Loading />}
      {!loading && !error && posiData == undefined && (
        <Typography>{t("empty")}</Typography>
      )}
      {posiData && (
        /** Padding for bottom bar. */ <Box pb={15}>
          <AboutContent {...posiData} />
          {socialProofs && (
            <Stack spacing={1} m={1.5}>
              <Typography variant="h3">{t("testimonials")}</Typography>
              {socialProofs.length == 0 && (
                <Typography>{t("emptyTestimonials")}</Typography>
              )}
              <Grid container spacing={1}>
                {socialProofs.map((socialProof) => {
                  return (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      key={socialProof.id}
                      p={2}
                    >
                      <SocialProofCard
                        key={socialProof.id}
                        socialProof={socialProof}
                        showAction={false}
                        showInitiative={false}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Stack>
          )}
          {initiative ? (
            myInitiative && myInitiative.id == initiative.id ? (
              <AdminBottomBar action={posiData} myInitiative={myInitiative} />
            ) : (
              <SupportBottomBar
                beneficiary={{ initiative: initiative, action: posiData }}
              />
            )
          ) : (
            <CenterBottomCircularProgress />
          )}
        </Box>
      )}
    </Box>
  ) : (
    <CircularProgress />
  );
});

export default Index;
