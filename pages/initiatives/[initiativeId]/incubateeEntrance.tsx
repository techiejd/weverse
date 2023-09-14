// Anyone who arrives here can apply to be an incubatee of the initiative.

import { useTranslations } from "next-intl";
import { useCurrentInitiative } from "../../../modules/initiatives/context";
import {
  useCurrentIncubatees,
  useMyInitiative,
} from "../../../common/context/weverseUtils";
import { Stack, Avatar, Typography, Button, Grid, Link } from "@mui/material";
import LogInPrompt from "../../../common/components/logInPrompt";
import { sectionStyles } from "../../../common/components/theme";
import { CachePaths } from "../../../common/utils/staticPaths";
import { asOneWePage } from "../../../common/components/onewePage";
import { WithTranslationsStaticProps } from "../../../common/utils/translations";
import InitiativeCard from "../../../modules/initiatives/InitiativeCard";
import { useEffect, useState } from "react";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();

const IncubateeEntrance = asOneWePage(() => {
  const [initiative] = useCurrentInitiative();
  const [myInitiative] = useMyInitiative();
  const [theirIncubatees] = useCurrentIncubatees();
  const [acceptedIncubatees, setAcceptedIncubatees] = useState(
    theirIncubatees?.filter((incubatee) => incubatee?.acceptedInvite)
  );
  const t = useTranslations("initiatives.incubateeEntrance");

  useEffect(() => {
    setAcceptedIncubatees(
      theirIncubatees?.filter((incubatee) => incubatee?.acceptedInvite)
    );
  }, [theirIncubatees]);

  return (
    <Stack>
      <Stack
        spacing={2}
        sx={{ justifyContent: "center", alignItems: "center" }}
        p={2}
      >
        {initiative?.pic && (
          <Avatar src={initiative.pic} sx={{ width: 112, height: 112 }} />
        )}
        {t.rich("title", {
          initiativeName: initiative?.name,
          initiativeNameTag: (initiativeName) => (
            <Typography variant="h2">
              <Link
                href={`/initiatives/${initiative?.id}`}
                sx={{ color: "black" }}
              >{`${initiativeName}`}</Link>
            </Typography>
          ),
          prompt: (p) => (
            <Typography variant="h2" textAlign="center">
              {p}
            </Typography>
          ),
        })}

        {myInitiative && (
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
            <Typography>{t("whyEnter")}</Typography>
            <Button variant="contained" sx={{ width: "fit-content" }}>
              {t("callToAction")}
            </Button>
          </Stack>
        )}
        {!myInitiative && <LogInPrompt title={t("logInPrompt")} />}
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
          {t("acceptedIncubateeInitiatives")}
        </Typography>
        <Grid key="actionsGridUploadSocialProofPrompt" container spacing={1}>
          {acceptedIncubatees &&
            acceptedIncubatees.map((incubatee, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={idx}>
                <InitiativeCard initiativeId={incubatee?.id!} />
              </Grid>
            ))}
        </Grid>
      </Stack>
    </Stack>
  );
});

export default IncubateeEntrance;
