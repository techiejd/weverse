import Share from "@mui/icons-material/Share";
import Close from "@mui/icons-material/Close";
import ContentCopy from "@mui/icons-material/ContentCopy";
import Check from "@mui/icons-material/Check";
import {
  CircularProgress,
  Stack,
  IconButton,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Grid,
} from "@mui/material";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { useState, Fragment } from "react";
import ShareActionArea from "../../../common/components/shareActionArea";
import { useAppState } from "../../../common/context/appState";
import {
  useCurrentIncubatees,
  useCurrentNeedsValidation,
  useIsMine,
} from "../../../common/context/weverseUtils";
import { usePosiFormDataConverter } from "../../../common/utils/firebase";
import { useLocalizedPresentationInfo } from "../../../common/utils/translations";
import { Incubatee, PosiFormData } from "../../../functions/shared/src";
import ImpactCard from "../../posi/action/card";
import InitiativeCard from "../InitiativeCard";
import { useCurrentInitiative } from "../context";
import { useCopyToClipboard, buildShareLinks } from "../inviteAnInitiative";

const IncubatorSection = () => {
  const incubatorTranslations = useTranslations("initiatives.incubator");
  const appState = useAppState();
  const [incubatees] = useCurrentIncubatees();
  const acceptedIncubatees = incubatees?.filter(
    (incubatee) => incubatee.initiativePath
  );
  const notAcceptedIncubatees = incubatees?.filter(
    (incubatee) => !incubatee.initiativePath
  );
  const [needsValidation] = useCurrentNeedsValidation();
  const [initiative] = useCurrentInitiative();

  const isMyInitiative = useIsMine();
  const [loading, setLoading] = useState(false);
  const [value, copy] = useCopyToClipboard();

  const InvitedIncubateePortal = ({ incubatee }: { incubatee: Incubatee }) => {
    const { path, href } = initiative
      ? buildShareLinks(incubatee.path!)
      : { path: "", href: "" };
    const longInitiativeTypesTranslations = useTranslations(
      "initiatives.types.long"
    );
    return loading ? (
      <CircularProgress />
    ) : (
      <Stack
        direction="row"
        key={incubatee.initiativePath}
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{ border: "1px solid", borderColor: "grey.300" }}
      >
        <IconButton
          onClick={async () => {
            // Here we delete the incubatee relationship with the incubator
            if (!initiative || !incubatee) return;
            setLoading(true);
            const incubateeRef = doc(appState.firestore, incubatee.path!);
            await deleteDoc(incubateeRef);
            setLoading(false);
          }}
        >
          <Close />
        </IconButton>
        <Stack spacing={2}>
          <Typography>{incubatee.initializeWith?.name}</Typography>
          <Typography>
            {longInitiativeTypesTranslations(incubatee.initializeWith?.type)}
          </Typography>
        </Stack>
        <Stack spacing={2}>
          <IconButton onClick={() => copy(href)}>
            {value && value.includes(href) ? <Check /> : <ContentCopy />}
          </IconButton>
          <ShareActionArea
            shareProps={{
              title: incubatorTranslations("joinPrompt", {
                initiativeName: initiative?.name,
              }),
              path: path,
            }}
          >
            <IconButton>
              <Share />
            </IconButton>
          </ShareActionArea>
        </Stack>
      </Stack>
    );
  };

  const ValidateActionPortal = ({ action }: { action: PosiFormData }) => {
    const [validating, setValidating] = useState(false);
    const posiFormDataConverter = usePosiFormDataConverter();
    return (
      <Card>
        <CardHeader title={incubatorTranslations("isThisActionValid")} />
        <CardContent>
          <ImpactCard posiData={action} />
        </CardContent>
        <CardActions>
          {validating ? (
            <CircularProgress />
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                setValidating(true);
                updateDoc(
                  doc(appState.firestore, action.path!).withConverter(
                    posiFormDataConverter
                  ),
                  {
                    "validation.validated": true,
                  }
                );
              }}
            >
              {incubatorTranslations("actionIsValid")}
            </Button>
          )}
        </CardActions>
      </Card>
    );
  };

  const presentationInfo = useLocalizedPresentationInfo(initiative);

  return (
    <Fragment>
      <Typography variant="h2" sx={{ fontSize: "bold" }}>
        {incubatorTranslations("title")}
      </Typography>
      <Typography variant="h3">
        {incubatorTranslations("validationProcess.title")}
      </Typography>
      <Typography sx={{ whiteSpace: "pre-wrap" }}>
        {presentationInfo?.validationProcess ||
          incubatorTranslations("validationProcess.none")}
      </Typography>
      {isMyInitiative && (
        <Fragment>
          <Typography variant="h3">
            {incubatorTranslations("pendingValidation.title")}
          </Typography>
          {needsValidation && needsValidation.length > 0 ? (
            <Grid container spacing={1}>
              {needsValidation.map((action) => (
                <Grid item sm={12} md={6} lg={4} xl={3} key={action.path}>
                  <ValidateActionPortal key={action.path} action={action} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>
              {incubatorTranslations("pendingValidation.none")}
            </Typography>
          )}
        </Fragment>
      )}
      <Typography variant="h3">
        {incubatorTranslations("incubatees.title")}
      </Typography>
      <Stack spacing={2}>
        {acceptedIncubatees && acceptedIncubatees.length > 0 ? (
          acceptedIncubatees.map((incubatee) => (
            <InitiativeCard
              initiativePath={incubatee.initiativePath!}
              key={incubatee.initiativePath!}
            />
          ))
        ) : (
          <Typography>{incubatorTranslations("incubatees.none")}</Typography>
        )}
      </Stack>
      {isMyInitiative && (
        <Fragment>
          <Typography variant="h3">
            {incubatorTranslations("invited.title")}
          </Typography>
          <Stack spacing={2}>
            {notAcceptedIncubatees && notAcceptedIncubatees.length > 0 ? (
              notAcceptedIncubatees.map((incubatee) => (
                <InvitedIncubateePortal
                  key={incubatee.path!}
                  incubatee={incubatee}
                />
              ))
            ) : (
              <Typography>{incubatorTranslations("invited.none")}</Typography>
            )}
          </Stack>
        </Fragment>
      )}
    </Fragment>
  );
};

export default IncubatorSection;
