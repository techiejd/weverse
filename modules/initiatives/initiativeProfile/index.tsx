import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
  Stack,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useState, useEffect, Fragment } from "react";
import RatingsStack from "../../../common/components/ratings";
import {
  useInitiativeTypeLabel,
  useIsMine,
} from "../../../common/context/weverseUtils";
import { useCurrentInitiative, useCurrentSponsorships } from "../context";
import Sponsorships from "../sponsor/list";
import AboutSection from "./aboutSection";
import IncubatorSection from "./incubatorSection";

const ContinueToPublishAnActionDialog = ({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) => {
  const t = useTranslations("initiatives.flow");
  const inputTranslations = useTranslations("input");
  const [initiative] = useCurrentInitiative();
  return (
    <Dialog
      open={open}
      onClose={() => {
        close();
      }}
    >
      <DialogTitle>{t("title")}</DialogTitle>
      <DialogContent>
        <Typography>{t("action.prompt")}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            close();
          }}
        >
          {inputTranslations("cancel")}
        </Button>
        <Button
          variant="contained"
          href={`/${initiative?.path}/actions/upload`}
        >
          {t("action.yes")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const InitiativeProfile = () => {
  const [initiative] = useCurrentInitiative();
  const initiativeTypeLabel = useInitiativeTypeLabel(initiative);
  const isMyInitiative = useIsMine();
  const router = useRouter();
  const { flow } = router.query;
  const [
    continueToPublishAnActionDialogOpen,
    setContinueToPublishAnActionDialogOpen,
  ] = useState(false);
  useEffect(() => {
    if (flow) {
      setContinueToPublishAnActionDialogOpen(true);
    }
  }, [flow, setContinueToPublishAnActionDialogOpen]);

  return initiative ? (
    <Fragment>
      {isMyInitiative && (
        <ContinueToPublishAnActionDialog
          open={continueToPublishAnActionDialogOpen}
          close={() => setContinueToPublishAnActionDialogOpen(false)}
        />
      )}
      <Stack
        spacing={2}
        sx={{ justifyContent: "center", alignItems: "center", pb: 2 }}
      >
        <Typography variant="h1">{initiative.name}</Typography>
        <RatingsStack ratings={initiative.ratings} />
        <Avatar src={initiative.pic} sx={{ width: 225, height: 225 }} />
        <Typography>{initiativeTypeLabel}</Typography>
        <AboutSection initiative={initiative} />
        <Stack sx={{ width: "100%" }}>
          {initiative.type == "organization" &&
            initiative.organizationType == "incubator" && <IncubatorSection />}
          <Sponsorships
            showAmount={isMyInitiative}
            useCurrentSponsorships={useCurrentSponsorships}
          />
        </Stack>
      </Stack>
    </Fragment>
  ) : (
    <CircularProgress />
  );
};

export default InitiativeProfile;
