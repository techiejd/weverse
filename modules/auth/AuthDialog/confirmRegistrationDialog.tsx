import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Stack,
  DialogActions,
  Button,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import Login from "@mui/icons-material/Login";
import { AuthDialogState } from "./context";
import { useTranslations } from "next-intl";

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
