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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { useState, Fragment } from "react";
import ShareActionArea from "../../../common/components/shareActionArea";
import { useAppState } from "../../../common/context/appState";
import {
  useCurrentIncubatees,
  useCurrentNeedsValidation,
  useInitiative,
  useIsMine,
} from "../../../common/context/weverseUtils";
import { usePosiFormDataConverter } from "../../../common/utils/firebase";
import { useLocalizedPresentationInfo } from "../../../common/utils/translations";
import {
  Incubatee,
  Initiative,
  PosiFormData,
} from "../../../functions/shared/src";
import ImpactCard from "../../posi/action/card";
import InitiativeCard from "../InitiativeCard";
import {
  extractAccountLink,
  useAlertOrRedirectToOnboardingStripeAccount,
  useCurrentInitiative,
} from "../context";
import { useCopyToClipboard, buildShareLinks } from "../inviteAnInitiative";
import { useRouter } from "next/router";

const InvitedIncubateePortal = ({
  incubatee,
  initiative,
}: {
  incubatee: Incubatee;
  initiative?: Initiative;
}) => {
  const appState = useAppState();
  const [loading, setLoading] = useState(false);
  const [value, copy] = useCopyToClipboard();
  const { path, href } = initiative
    ? buildShareLinks(incubatee.path!)
    : { path: "", href: "" };
  const longInitiativeTypesTranslations = useTranslations(
    "initiatives.types.long"
  );
  const incubatorTranslations = useTranslations("initiatives.incubator");
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
  const appState = useAppState();
  const incubatorTranslations = useTranslations("initiatives.incubator");
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

const ConnectAccountDialog = ({
  open,
  close,
  initiativeName,
  initiativePath,
  skipExplanation,
}: {
  open: boolean;
  close: () => void;
  initiativeName: string;
  initiativePath: string;
  skipExplanation: boolean;
}) => {
  const alertOrRedirectToOnboardingStripeAccount =
    useAlertOrRedirectToOnboardingStripeAccount();
  const [incubator, incubatorLoading] = useCurrentInitiative();
  const [title, setTitle] = useState(initiativeName);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [understood, setUnderstood] = useState(skipExplanation || false);
  const internalClose = () => {
    if (loading || redirecting) {
      alert("Please wait for the process to finish.");
    }
    setUnderstood(false);
    if (title == "") setTitle(initiativeName);
    close();
  };
  const explainIncubateeMustAcceptConnectedAccountComponents = (
    <Fragment>
      <DialogTitle>
        Your incubatee must accept this connected account in order for them to
        receive payments.
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          They can accept through their initiative edit page, clicking{" "}
          {'"connect account"'} followed by selecting{" "}
          {'"accept incubator\'s connect account"'} and lastly clicking{" "}
          {'"connect account"'}.
        </DialogContentText>
        <DialogContentText>
          You will be redirected to our partner Stripe to connect an account.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={internalClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => {
            setUnderstood(true);
          }}
        >
          Understood
        </Button>
      </DialogActions>
    </Fragment>
  );
  const askingForTitleComponents = (
    <Fragment>
      <DialogTitle>Give the account a title.</DialogTitle>
      <DialogContent>
        <TextField
          label="Please give a title for the new account"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={title == "" ? true : false}
          helperText={title == "" ? "The account must have a title." : ""}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={internalClose}>
          Cancel
        </Button>
        <Button
          disabled={loading || title == "" || redirecting || incubatorLoading}
          variant="contained"
          onClick={() => {
            setLoading(true);
            alertOrRedirectToOnboardingStripeAccount(
              title,
              initiativePath,
              incubator?.path!
            );
            setLoading(false);
            setRedirecting(true);
          }}
        >
          Connect account
        </Button>
      </DialogActions>
    </Fragment>
  );
  const redirectingComponents = (
    <Fragment>
      <DialogTitle>Please wait</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please wait while redirect you to our Stripe partner.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <CircularProgress />
      </DialogActions>
    </Fragment>
  );
  return (
    <Dialog open={open} onClose={internalClose}>
      {!understood && explainIncubateeMustAcceptConnectedAccountComponents}
      {understood && !redirecting && askingForTitleComponents}
      {understood && redirecting && redirectingComponents}
    </Dialog>
  );
};

const RedirectingDialog = ({ open }: { open: boolean }) => {
  return (
    <Dialog open={open}>
      <DialogTitle>Please wait</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please wait while we redirect you to our Stripe partner.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <CircularProgress />
      </DialogActions>
    </Dialog>
  );
};

const IncubateeManipulationPortal = ({
  incubatee,
}: {
  incubatee: Incubatee;
}) => {
  const [incubateeInitiative, loading] = useInitiative(
    incubatee.initiativePath
  );
  const connectedAccount = incubateeInitiative?.connectedAccount;
  const incubatorRelationshipWithConnectedAccount =
    incubateeInitiative?.incubator?.connectedAccount;
  const [connectAccountDialogOpen, setConnectAccountDialogOpen] =
    useState(false);
  // TODO(techiejd): Move the continue onboarding link logic to the backend.
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();
  // TODO(techiejd): Figure out how to pass either initiative or
  // initiative path to InitiativeCard.
  return (
    <Fragment>
      {incubateeInitiative && (
        <ConnectAccountDialog
          open={connectAccountDialogOpen}
          close={() => setConnectAccountDialogOpen(false)}
          initiativeName={incubateeInitiative.name}
          initiativePath={incubatee.initiativePath!}
          skipExplanation={
            incubatorRelationshipWithConnectedAccount == "incubateeRequested"
          }
        />
      )}
      <RedirectingDialog open={redirecting} />
      <Stack spacing={2} sx={{ borderColor: "primary.main", border: 1, p: 2 }}>
        <InitiativeCard initiativePath={incubatee.initiativePath!} />
        {loading && <CircularProgress />}
        {connectedAccount?.status == "active" &&
          !incubatorRelationshipWithConnectedAccount && (
            <Button
              variant="contained"
              href={extractAccountLink(connectedAccount)}
            >
              View account
            </Button>
          )}
        {connectedAccount?.status == "onboarding" &&
          (incubatorRelationshipWithConnectedAccount ? (
            <Button
              variant="contained"
              onClick={async () => {
                setRedirecting(true);
                // TODO(techiejd): Move the continue onboarding link logic to the backend.
                const continueOnboardingLinkResponse = await fetch(
                  "/api/continueOnboardingLink",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      stripeAccountId: connectedAccount.stripeAccountId,
                    }),
                  }
                );
                if (continueOnboardingLinkResponse.ok) {
                  const continueOnboardingLink =
                    await continueOnboardingLinkResponse.json();
                  router.push(continueOnboardingLink.link);
                } else {
                  alert(
                    `Error getting continue onboarding link ${continueOnboardingLinkResponse.status}: ${continueOnboardingLinkResponse.statusText}`
                  );
                }
              }}
            >
              Finish onboarding through our partner Stripe.
            </Button>
          ) : (
            <Typography color="red">
              Incubatee must finish onboarding through Stripe.
            </Typography>
          ))}
        {incubatorRelationshipWithConnectedAccount == "incubateeRequested" &&
          !connectedAccount && (
            <Button
              variant="contained"
              onClick={() => setConnectAccountDialogOpen(true)}
            >
              Connect account through our partner Stripe.
            </Button>
          )}
        {incubatorRelationshipWithConnectedAccount ==
          "pendingIncubateeApproval" && (
          <Typography color="red">
            Waiting for incubatee to approve connected account.
          </Typography>
        )}
        {!incubatorRelationshipWithConnectedAccount && !connectedAccount && (
          <Button
            variant="contained"
            onClick={() => setConnectAccountDialogOpen(true)}
          >
            Preemptively connect an account.
          </Button>
        )}
      </Stack>
    </Fragment>
  );
};

const IncubatorSection = () => {
  const incubatorTranslations = useTranslations("initiatives.incubator");
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
          acceptedIncubatees.map((incubatee) =>
            isMyInitiative ? (
              <IncubateeManipulationPortal
                incubatee={incubatee}
                key={incubatee.initiativePath}
              />
            ) : (
              <InitiativeCard
                initiativePath={incubatee.initiativePath!}
                key={incubatee.initiativePath}
              />
            )
          )
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
                  initiative={initiative}
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
