import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Stack,
  DialogActions,
  Button,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect } from "react";
import Login from "@mui/icons-material/Login";
import { AuthDialogState } from "./context";
import { useTranslations } from "next-intl";
import mixpanel from "mixpanel-browser";

const ConfirmRegistrationDialog = ({
  authDialogState,
  setAuthDialogState,
  confirm,
}: {
  authDialogState: AuthDialogState;
  setAuthDialogState: Dispatch<SetStateAction<AuthDialogState>>;
  confirm: () => void;
}) => {
  const inputTranslations = useTranslations("input");
  const authTranslations = useTranslations("auth");
  const t = useTranslations("auth.confirmRegistrationDialog");
  useEffect(() => {
    mixpanel.track("Authentication", {
      action: "View",
      dialog: "Confirm Registration",
    });
  }, []);
  return (
    <Dialog open={authDialogState.confirmRegistrationDialogOpen}>
      <DialogTitle>{t("review")}</DialogTitle>
      <DialogContent>
        <Typography>
          <b>{t("name")}</b> {authDialogState.name}
        </Typography>
        <Stack>
          <Typography>
            <b>{inputTranslations("phoneNumber")}</b>{" "}
            {`+${authDialogState.phoneNumber.countryCallingCode} ${authDialogState.phoneNumber.nationalNumber}`}
          </Typography>
          <Typography>
            {authTranslations("validationProcess", {
              action: authDialogState.authAction,
            })}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="secondary"
          onClick={(e) => {
            mixpanel.track("Authentication", {
              action: "Cancel",
              dialog: "Confirm Registration",
            });
            setAuthDialogState((aDS) => ({
              ...aDS,
              confirmRegistrationDialogOpen: false,
            }));
          }}
        >
          {inputTranslations("cancel")}
        </Button>
        <Button
          variant="contained"
          endIcon={<Login />}
          onClick={(e) => {
            mixpanel.track("Authentication", {
              action: "Submit",
              dialog: "Confirm Registration",
            });
            confirm();
          }}
        >
          {inputTranslations("ok")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmRegistrationDialog;
