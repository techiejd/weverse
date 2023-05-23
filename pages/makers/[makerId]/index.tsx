import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Rating,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { AppState, useAppState } from "../../../common/context/appState";
import {
  Edit,
  Support as SupportIcon,
  Share,
  Add,
  CheckBoxOutlineBlank,
  CheckBox,
} from "@mui/icons-material";
import SupportBottomBar from "../../../common/components/supportBottomBar";
import {
  useCurrentActions,
  useCurrentImpacts,
  useCurrentMaker,
} from "../../../modules/makers/context";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import moment from "moment";
import ImpactCard from "../../../modules/posi/action/card";
import Media from "../../../modules/posi/media";
import {
  useAction,
  useMaker,
  useMyMaker,
} from "../../../common/context/weverseUtils";
import SolicitDialog from "../../../common/components/solicitHelpDialog";
import {
  Maker,
  SocialProof,
  organizationLabels,
} from "../../../functions/shared/src";
import { Content } from "../../../modules/posi/content";
import RatingsStack from "../../../common/components/ratings";
import ShareActionArea from "../../../common/components/shareActionArea";
import IconButtonWithLabel from "../../../common/components/iconButtonWithLabel";
import CenterBottomCircularProgress from "../../../common/components/centerBottomCircularProgress";
import CenterBottomFab from "../../../common/components/centerBottomFab";
import { pickBy } from "lodash";
import { calculateVipState } from "../../../common/utils/vip";
import { useRouter } from "next/router";
import SocialProofCard from "../../../modules/posi/socialProofCard";

const MakerProfile = ({ appState }: { appState: AppState }) => {
  const [maker, makerLoading, makerError] = useCurrentMaker(appState);
  return maker ? (
    <Stack
      spacing={2}
      sx={{ justifyContent: "center", alignItems: "center", pb: 2 }}
    >
      <Typography variant="h1">{maker.name}</Typography>
      <RatingsStack ratings={maker.ratings} />
      <Avatar src={maker.pic} sx={{ width: 225, height: 225 }} />
      <Typography>
        {maker.type == "individual"
          ? "Individuo"
          : maker.organizationType
          ? organizationLabels[maker.organizationType]
          : "Error"}
      </Typography>
      <Stack sx={{ width: "100%" }}>
        <Typography variant="h2">Acerca de:</Typography>
        <Typography>
          {maker.about ? maker.about : "No hay sección 'acerca de'."}
        </Typography>
      </Stack>
    </Stack>
  ) : (
    <CircularProgress />
  );
};

const MakerContent = ({ appState }: { appState: AppState }) => {
  const [actions, actionsLoading, actionsError] = useCurrentActions(appState);
  const [socialProofs, socialProofsLoading, socialProofsError] =
    useCurrentImpacts(appState);
  const [actionsContent, setActionsContent] = useState<Content[]>([]);
  const [socialProofsContent, setSocialProofsContent] = useState<Content[]>([]);
  const [content, setContent] = useState<Content[]>([]);

  useEffect(() => {
    if (actions && actions.length > 0) {
      setActionsContent(
        actions.map((action) => ({
          type: "action",
          data: action,
          createdAt: action.createdAt ? action.createdAt : moment().toDate(),
        }))
      );
    }
  }, [actions, setActionsContent]);
  useEffect(() => {
    if (socialProofs && socialProofs.length > 0) {
      setSocialProofsContent(
        socialProofs.map((socialProof) => ({
          type: "impact",
          data: socialProof,
          createdAt: socialProof.createdAt
            ? socialProof.createdAt
            : moment().toDate(),
        }))
      );
    }
  }, [socialProofs, setSocialProofsContent]);

  useEffect(() => {
    setContent(
      [...actionsContent, ...socialProofsContent].sort(
        (a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()
      )
    );
  }, [actionsContent, socialProofsContent, setContent]);

  return (
    <Grid container spacing={1}>
      {content.map((c, idx) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          key={c.data.id ? c.data.id : idx}
        >
          {c.type == "action" ? (
            <ImpactCard posiData={c.data} />
          ) : (
            <SocialProofCard socialProof={c.data} showMaker={false} />
          )}
        </Grid>
      ))}
    </Grid>
  );
};

const VipDialog = ({
  open,
  setOpen,
  setSolicitDialogOpen,
  myMaker,
  appState,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setSolicitDialogOpen: Dispatch<SetStateAction<boolean>>;
  myMaker: Maker;
  appState: AppState;
}) => {
  const [actions, actionsLoading, actionsError] = useCurrentActions(appState);
  const [socialProofs, socialProofsLoading, socialProofsError] =
    useCurrentImpacts(appState);
  const vipState = calculateVipState(myMaker, socialProofs, actions);
  return (
    <Dialog open={open}>
      <DialogTitle>
        Para ingresar a la sala VIP y entrar a ganar $100USD en la rifa, realiza
        cada una de las siguientes tareas:
      </DialogTitle>
      <DialogContent>
        <Typography>Haz clic en la tarea para comenzar el proceso:</Typography>
        <List>
          <ListItemButton href="/posi/upload" disabled={vipState.oneActionDone}>
            <ListItemIcon>
              {vipState.oneActionDone ? <CheckBox /> : <CheckBoxOutlineBlank />}
            </ListItemIcon>
            <ListItemText
              primary="Agregar una acción."
              secondary="Mostramos cambios en el mundo agregando acciones."
            />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              setOpen(false);
              setSolicitDialogOpen(true);
            }}
            disabled={vipState.enoughSocialProof}
          >
            <ListItemIcon>
              {vipState.enoughSocialProof ? (
                <CheckBox />
              ) : (
                <CheckBoxOutlineBlank />
              )}
            </ListItemIcon>
            <ListItemText
              primary="Escuchar a 3 personas impactadas solicitandoles el testimonio y/o opinión."
              secondary={`Involucramos a la comunidad en la discusión. ${vipState.numSocialProofsDoneForVIP}/3 Testimonios recibido.`}
            />
          </ListItemButton>
          <ListItemButton
            href={`/makers/${myMaker.id}/edit`}
            disabled={vipState.allFieldsFinished}
          >
            <ListItemIcon>
              {vipState.allFieldsFinished ? (
                <CheckBox />
              ) : (
                <CheckBoxOutlineBlank />
              )}
            </ListItemIcon>
            <ListItemText
              primary="Configurar tu perfil de Maker."
              secondary={
                vipState.allFieldsFinished
                  ? "Ya has terminado."
                  : `Hacen falta los siguientes campos: ${vipState.unfinishedFields!.join(
                      ", "
                    )}.`
              }
            />
          </ListItemButton>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} autoFocus>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const BottomBar = ({ appState }: { appState: AppState }) => {
  const [maker, makerLoading, makerError] = useCurrentMaker(appState);
  const [myMaker, myMakerLoading, myMakerError] = useMyMaker(appState);
  const [solicitDialogOpen, setSolicitDialogOpen] = useState(false);
  const router = useRouter();
  const { vipDialogOpen: queryVipDialogOpen } = router.query;
  const [vipDialogOpen, setVipDialogOpen] = useState(
    Boolean(queryVipDialogOpen)
  );
  const [socialProofs, socialProofsLoading, socialProofsError] =
    useCurrentImpacts(appState);
  const [actions, actionsLoading, actionsError] = useCurrentActions(appState);
  const vipState = calculateVipState(myMaker, socialProofs, actions);
  const vipButtonBehavior = vipState.entryGiven
    ? { href: "/makers/vip" }
    : { onClick: () => setVipDialogOpen(true) };

  return maker == undefined ? (
    <CenterBottomCircularProgress />
  ) : myMaker && myMaker.id == maker.id ? (
    <AppBar
      position="fixed"
      color="primary"
      sx={{ top: "auto", bottom: 16, borderRadius: 8, boxShadow: 8 }}
    >
      <SolicitDialog
        open={solicitDialogOpen}
        setOpen={setSolicitDialogOpen}
        howToSupport={maker.howToSupport ? maker.howToSupport : {}}
        solicitOpinionPath={`/makers/${maker.id}/impact/upload`}
        pathUnderSupport={`/makers/${maker.id}`}
        editMakerPath={`/makers/${maker.id}/edit`}
      />
      <VipDialog
        open={vipDialogOpen}
        setOpen={setVipDialogOpen}
        setSolicitDialogOpen={setSolicitDialogOpen}
        myMaker={myMaker}
        appState={appState}
      />
      <Toolbar>
        <IconButtonWithLabel href={`/makers/${maker.id}/edit`}>
          <Edit />
          <Typography>Editar</Typography>
        </IconButtonWithLabel>
        <IconButtonWithLabel onClick={() => setSolicitDialogOpen(true)}>
          <SupportIcon />
          <Typography>Apoyo</Typography>
        </IconButtonWithLabel>
        <CenterBottomFab
          color="secondary"
          aria-label="add"
          {...vipButtonBehavior}
        >
          <Typography fontSize={25}>👑</Typography>
          <Typography fontSize={12}>VIP</Typography>
        </CenterBottomFab>
        <Box sx={{ flexGrow: 1 }} />
        <ShareActionArea
          shareProps={{
            title: "Por favor, eche un vistazo a mi página de Maker.",
            text: "Por favor, eche un vistazo a mi página de Maker.",
            path: `makers/${maker.id}`,
          }}
        >
          <IconButtonWithLabel>
            <Share />
            <Typography>Compartir</Typography>
          </IconButtonWithLabel>
        </ShareActionArea>
        <IconButtonWithLabel href={`/posi/upload`}>
          <Add />
          <Typography>Acción</Typography>
        </IconButtonWithLabel>
      </Toolbar>
    </AppBar>
  ) : (
    <SupportBottomBar beneficiary={{ maker }} />
  );
};

const MakerPage = () => {
  const appState = useAppState();
  return appState ? (
    <Box mb={12}>
      <Stack p={2} divider={<Divider />}>
        <MakerProfile appState={appState} />
        <MakerContent appState={appState} />
      </Stack>
      <BottomBar appState={appState} />
    </Box>
  ) : (
    <CircularProgress />
  );
};

export default MakerPage;
