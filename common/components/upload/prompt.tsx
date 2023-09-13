import { Avatar, Button, Grid, Link, Stack, Typography } from "@mui/material";
import { Initiative, PosiFormData } from "../../../functions/shared/src";
import ImpactCard from "../../../modules/posi/action/card";

import { useActions } from "../../context/weverseUtils";
import LogInPrompt from "../logInPrompt";
import { useEffect, useState } from "react";
import { useAppState } from "../../context/appState";
import { useTranslations } from "next-intl";
import { sectionStyles } from "../theme";

const UploadSocialProofPrompt = ({
  forInitiative,
  forAction,
}: {
  forInitiative: Initiative;
  forAction?: PosiFormData;
}) => {
  const { user } = useAppState().authState;
  const [initiativeActions] = useActions(
    forAction ? undefined : forInitiative.id
  );
  const [actions, setActions] = useState<PosiFormData[]>(
    forAction ? [forAction] : []
  );

  useEffect(() => {
    if (initiativeActions) setActions(initiativeActions);
  }, [initiativeActions, setActions]);

  const promptTranslations = useTranslations("testimonials.prompt");

  return (
    <Stack>
      <Stack
        spacing={2}
        sx={{ justifyContent: "center", alignItems: "center" }}
        p={2}
      >
        {forInitiative.pic && (
          <Avatar src={forInitiative.pic} sx={{ width: 112, height: 112 }} />
        )}
        {promptTranslations.rich("title", {
          initiativeName: forInitiative.name,
          initiativeNameTag: (initiativeName) => (
            <Typography variant="h2">
              <Link
                href={`/initiatives/${forInitiative.id}`}
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
                  ? `/posi/${forAction.id}/impact/upload/form`
                  : `/initiatives/${forInitiative.id}/impact/upload/form`
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
