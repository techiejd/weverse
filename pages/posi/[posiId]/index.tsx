import {
  AppBar,
  Box,
  CircularProgress,
  Grid,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Edit, Handshake, Hearing, Share } from "@mui/icons-material";
import { useState } from "react";
import ShareActionArea from "../../../common/components/shareActionArea";
import SolicitDialog from "../../../common/components/solicitHelpDialog";
import { useMaker, useMyMaker } from "../../../common/context/weverseUtils";
import AboutContent from "../../../modules/posi/action/about";
import {
  useCurrentPosi,
  useCurrentSocialProofs,
} from "../../../modules/posi/context";
import SupportBottomBar from "../../../common/components/supportBottomBar";
import SocialProofCard from "../../../modules/posi/socialProofCard";
import CenterBottomCircularProgress from "../../../common/components/centerBottomCircularProgress";
import { Maker, PosiFormData } from "../../../functions/shared/src";
import CenterBottomFab from "../../../common/components/centerBottomFab";
import IconButtonWithLabel from "../../../common/components/iconButtonWithLabel";
import { WithTranslationsStaticProps } from "../../../common/utils/translations";
import { CachePaths } from "../../../common/utils/staticPaths";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();
const AdminBottomBar = ({
  action,
  myMaker,
}: {
  action: PosiFormData;
  myMaker: Maker;
}) => {
  const [solicitDialogOpen, setSolicitDialogOpen] = useState(false);
  const solicitOpinionPath = `/posi/${action.id}/impact/upload`;
  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{ top: "auto", bottom: 16, borderRadius: 8, boxShadow: 8 }}
    >
      <SolicitDialog
        open={solicitDialogOpen}
        setOpen={setSolicitDialogOpen}
        howToSupport={myMaker.howToSupport ? myMaker.howToSupport : {}}
        solicitOpinionPath={`/posi/${action.id}/impact/upload`}
        pathUnderSupport={`/posi/${action.id}`}
        editMakerPath={`/makers/${myMaker.id}/edit`}
      />
      <Toolbar>
        <IconButtonWithLabel href={`/posi/${action.id}/action/edit`}>
          <Edit />
          <Typography>Editar</Typography>
        </IconButtonWithLabel>
        <CenterBottomFab
          color="secondary"
          aria-label="add"
          sx={{ width: 70, height: 70 }}
        >
          <Handshake fontSize="large" />
          <Typography fontSize={12}>Apoyo</Typography>
        </CenterBottomFab>
        <Box sx={{ flexGrow: 1 }} />
        <ShareActionArea
          shareProps={{
            path: solicitOpinionPath,
            title: `Por favor dame tu opinion sobre mi acción social: ${action.summary}`,
            text: `Por favor dame tu opinion sobre mi acción social: ${action.summary}`,
          }}
        >
          <IconButtonWithLabel>
            <Hearing fontSize="large" />
            <Typography fontSize={12}>Escuchar</Typography>
          </IconButtonWithLabel>
        </ShareActionArea>
        <ShareActionArea
          shareProps={{
            path: `/posi/${action.id}`,
            text: "Mira mi acción social.",
            title: "Mira mi acción social.",
          }}
        >
          <IconButtonWithLabel>
            <Share fontSize="large" />
            <Typography fontSize={12}>Compartir</Typography>
          </IconButtonWithLabel>
        </ShareActionArea>
      </Toolbar>
    </AppBar>
  );
};

const Index = () => {
  const [posiData, loading, error] = useCurrentPosi();
  const [socialProofs, socialProofsLoading, socialProofsError] =
    useCurrentSocialProofs();
  const [myMaker, myMakerLoading, myMakerError] = useMyMaker();
  const [maker, makerLoading, makerError] = useMaker(posiData?.makerId);

  const Loading = () => {
    return (
      <Box>
        <Typography>Impacts: Loading...</Typography>
        <CircularProgress />
      </Box>
    );
  };

  return posiData ? (
    <Box>
      {error && (
        <Typography color={"red"}>Error: {JSON.stringify(error)}</Typography>
      )}
      {loading && <Loading />}
      {!loading && !error && posiData == undefined && (
        <Typography>No hay ninguna Action aquí.</Typography>
      )}
      {posiData && (
        /** Padding for bottom bar. */ <Box pb={15}>
          <AboutContent {...posiData} />
          {socialProofs && (
            <Stack spacing={1} m={1.5}>
              <Typography variant="h3">Testimonios</Typography>
              {socialProofs.length == 0 && (
                <Typography>No hay testimonios.</Typography>
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
                        showMaker={false}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Stack>
          )}
          {maker ? (
            myMaker && myMaker.id == maker.id ? (
              <AdminBottomBar action={posiData} myMaker={myMaker} />
            ) : (
              <SupportBottomBar beneficiary={{ maker, action: posiData }} />
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
};

export default Index;
