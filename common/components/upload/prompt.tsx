import { Avatar, Button, Grid, Link, Stack, Typography } from "@mui/material";
import ImpactCard from "../../../modules/posi/action/card";
import LogInPrompt from "../logInPrompt";
import { useAppState } from "../../context/appState";
import { useTranslations } from "next-intl";
import { sectionStyles } from "../theme";
import { useCurrentPosi } from "../../../modules/posi/context";
import {
  useCurrentActions,
  useCurrentInitiative,
} from "../../../modules/initiatives/context";

const UploadSocialProofPrompt = () => {
  const [forInitiative] = useCurrentInitiative();
  const [actions] = useCurrentActions();
  const [forAction] = useCurrentPosi();
  const { user } = useAppState().authState;

  const promptTranslations = useTranslations("testimonials.prompt");

  return (
    <Stack>
      <Stack
        spacing={2}
        sx={{ justifyContent: "center", alignItems: "center" }}
        p={2}
      >
        {forInitiative?.pic && (
          <Avatar src={forInitiative.pic} sx={{ width: 112, height: 112 }} />
        )}
        {promptTranslations.rich("title", {
          initiativeName: forInitiative?.name,
          initiativeNameTag: (initiativeName) => (
            <Typography variant="h2">
              <Link
                href={`/${forInitiative?.path}`}
                sx={{ color: "black" }}
              >{`${initiativeName}`}</Link>
            </Typography>
          ),
          prompt: (p) => (
            <Typography variant="h2" textAlign="center">
              {p}
            </Typography>
          ),
          forAction: !!forAction,
        })}

        {user && (
          <Stack
            spacing={2}
            sx={[
              sectionStyles,
              {
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Typography>{promptTranslations("share")}</Typography>
            <Button
              variant="contained"
              sx={{ width: "fit-content" }}
              href={
                forAction
                  ? `/${forAction.path}/impact/upload/form`
                  : `/${forInitiative?.path}/impact/upload/form`
              }
            >
              {promptTranslations("callToAction")}
            </Button>
          </Stack>
        )}
        {!user && <LogInPrompt title={promptTranslations("logInPrompt")} />}
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
        <Typography variant="h2" key={"for"}>
          {promptTranslations("for", { forAction: !!forAction })}
        </Typography>
        <Grid key="actionsGridUploadSocialProofPrompt" container spacing={1}>
          {(forAction ? [forAction] : actions)?.map((a, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={a.path}>
              <ImpactCard posiData={a} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
};

export default UploadSocialProofPrompt;
