import { Avatar, Button, Grid, Link, Stack, Typography } from "@mui/material";
import { Maker, PosiFormData } from "../../../functions/shared/src";
import ImpactCard from "../../../modules/posi/action/card";
import { AppState } from "../../context/appState";
import { useActions } from "../../context/weverseUtils";
import LogInPrompt from "../logInPrompt";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";

const UploadSocialProofPrompt = ({
  forMaker,
  forAction,
  appState,
}: {
  forMaker: Maker;
  forAction?: PosiFormData;
  appState: AppState;
}) => {
  const [user, userLoading, userError] = useAuthState(appState.auth);
  const [makerActions, makerActionsLoading, makerActionsError] = useActions(
    appState,
    forAction ? undefined : forMaker.id
  );
  const [actions, setActions] = useState<PosiFormData[]>(
    forAction ? [forAction] : []
  );

  useEffect(() => {
    if (makerActions) setActions(makerActions);
  }, [makerActions, setActions]);

  return (
    <Stack>
      <Stack
        spacing={2}
        sx={{ justifyContent: "center", alignItems: "center" }}
        p={2}
      >
        {forMaker.pic && (
          <Avatar src={forMaker.pic} sx={{ width: 112, height: 112 }} />
        )}
        <Typography variant="h2" fontWeight="bold">
          <Link
            href={`/makers/${forMaker.id}`}
            sx={{ color: "black" }}
          >{`${forMaker.name}`}</Link>
        </Typography>
        <Typography variant="h2" fontWeight="bold" textAlign="center">
          {`quiere saber ¿cómo ${
            forAction ? `hizo esta acción` : `hicieron sus acciones`
          } un cambio en tu vida?`}
        </Typography>
        {user && (
          <Stack
            spacing={2}
            sx={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f5f8ff",
              borderRadius: 2,
              border: 1,
              borderColor: "#d9e1ec",
              p: 2,
            }}
          >
            <Typography>Comparte tu testimonio sobre esta acción</Typography>
            <Button
              variant="contained"
              sx={{ width: "fit-content" }}
              href={
                forAction
                  ? `/posi/${forAction.id}/impact/upload/form`
                  : `/makers/${forMaker.id}/impact/upload/form`
              }
            >
              Listo para hacer el testimonio
            </Button>
          </Stack>
        )}
        {!user && (
          <LogInPrompt title="Para compartir tu testimonio, hay que ingresar al sistema." />
        )}
      </Stack>
      <Stack
        spacing={2}
        sx={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f3f3f3",
          p: 2,
        }}
      >
        <Typography
          variant="h2"
          fontWeight="bold"
          key={"actionInQuestionTitle"}
        >
          {forAction ? `Acción en cuestión:` : `Sus acciones:`}
        </Typography>
        <Grid key="actionsGridUploadSocialProofPrompt" container spacing={1}>
          {actions.map((a, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={a.id}>
              <ImpactCard posiData={a} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
};

export default UploadSocialProofPrompt;
