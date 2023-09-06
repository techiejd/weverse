import { Avatar, Button, Grid, Link, Stack, Typography } from "@mui/material";
import { Maker, PosiFormData } from "../../../functions/shared/src";
import ImpactCard from "../../../modules/posi/action/card";

import { useActions } from "../../context/weverseUtils";
import LogInPrompt from "../logInPrompt";
import { useEffect, useState } from "react";
import { useAppState } from "../../context/appState";
import { useTranslations } from "next-intl";
import { sectionStyles } from "../theme";

const UploadSocialProofPrompt = ({
  forMaker,
  forAction,
}: {
  forMaker: Maker;
  forAction?: PosiFormData;
}) => {
  const { user } = useAppState().authState;
  const [makerActions, makerActionsLoading, makerActionsError] = useActions(
    forAction ? undefined : forMaker.id
  );
  const [actions, setActions] = useState<PosiFormData[]>(
    forAction ? [forAction] : []
  );

  useEffect(() => {
    if (makerActions) setActions(makerActions);
  }, [makerActions, setActions]);

  const promptTranslations = useTranslations("testimonials.prompt");

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
        {promptTranslations.rich("title", {
          makerName: forMaker.name,
          makerNameTag: (makerName) => (
            <Typography variant="h2">
              <Link
                href={`/initiatives/${forMaker.id}`}
                sx={{ color: "black" }}
              >{`${makerName}`}</Link>
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
                  : `/initiatives/${forMaker.id}/impact/upload/form`
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
