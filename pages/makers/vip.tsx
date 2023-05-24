import {
  Button,
  CircularProgress,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { AppState, useAppState } from "../../common/context/appState";
import { useRouter } from "next/router";
import {
  useActions,
  useMyMaker,
  useSocialProofs,
} from "../../common/context/weverseUtils";
import LogInPrompt from "../../common/components/logInPrompt";
import { calculateVipState } from "../../common/utils/vip";
import { useEffect } from "react";

const Vip = () => {
  const VipPage = ({ appState }: { appState: AppState }) => {
    const router = useRouter();
    const [myMaker, myMakerLoading, myMakerError] = useMyMaker(appState);
    const [socialProofs, socialProofsLoading, socialProofsError] =
      useSocialProofs(appState, myMaker?.id, "maker");
    const [actions, actionsLoading, actionsError] = useActions(
      appState,
      myMaker?.id
    );
    const vipState = calculateVipState(myMaker, socialProofs, actions);

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
          ¡Bienvenidos a la sala VIP de OneWe!
        </Typography>
        <Typography variant="h2" textAlign="center">
          Para recibir los premios (el dinero y entrar a la rifa) y ser parte
          del VIP Makers, ingrese al grupo VIP WhatsApp:
        </Typography>
        <Button
          href="https://chat.whatsapp.com/Bi3PenMNgDZJJNdX6rw5HA"
          variant="contained"
        >
          Ingresar
        </Button>
      </Stack>
    ) : (
      <LogInPrompt
        title={"Para ingresar a la sala VIP, debes ingresar al sistem."}
      />
    );
  };
  const appState = useAppState();
  return appState ? <VipPage appState={appState} /> : <CircularProgress />;
};

export default Vip;
