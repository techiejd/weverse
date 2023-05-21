import { CircularProgress, Stack, Typography } from "@mui/material";
import { AppState, useAppState } from "../../common/context/appState";
import { useRouter } from "next/router";
import {
  useActions,
  useMyMaker,
  useSocialProofs,
} from "../../common/context/weverseUtils";
import LogInPrompt from "../../common/components/logInPrompt";
import { calculateVipState } from "../../common/utils/vip";

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
    console.log({
      myMaker,
      entryGiven: vipState.entryGiven,
      total:
        myMaker && vipState.entryGiven != undefined && !vipState.entryGiven,
    });
    if (myMaker && vipState.entryGiven != undefined && !vipState.entryGiven) {
      console.log("here yol");
      router.push(`/makers/${myMaker.id}?vipDialogOpen=true`);
    }
    return myMaker ? (
      <Stack>
        <Typography variant="h1">
          ¡Bienvenidos a la sala VIP de OneWe!
        </Typography>
        <Typography>
          Join the whatsapp group and or broadcast. Do it now. Coolio.
        </Typography>
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
