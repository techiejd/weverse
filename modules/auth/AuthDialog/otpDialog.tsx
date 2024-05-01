import Login from "@mui/icons-material/Login";
import {
  Dialog,
  DialogTitle,
  Box,
  CircularProgress,
  Typography,
  DialogActions,
  Button,
  Stack,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import AuthCode from "react-auth-code-input";
import { AuthDialogState } from "./context";
import { useTranslations } from "next-intl";
import mixpanel from "mixpanel-browser";

const OtpDialog = ({
  authDialogState,
  setAuthDialogState,
  handleVerification,
}: {
  authDialogState: AuthDialogState;
  setAuthDialogState: Dispatch<SetStateAction<AuthDialogState>>;
  handleVerification: (otp: string) => Promise<string>;
}) => {
  const otpDialogTranslations = useTranslations("auth.otpDialog");
  const inputTranslations = useTranslations("input");
  const [authCodeInput, setAuthCodeInput] = useState<string>("");
  const [verifyButtonDisabled, setVerifyButtonDisabled] = useState(true);
  const [error, setError] = useState("");
  const [waitingVerificationResult, setWaitingVerificationResult] =
    useState(false);

  useEffect(() => {
    mixpanel.track("Authentication", {
      action: "View",
      dialog: "OTP",
    });
  }, []);

  useEffect(() => {
    setVerifyButtonDisabled(authCodeInput.length == 6 ? false : true);
  }, [authCodeInput, setVerifyButtonDisabled]);
  return (
    <Dialog open={authDialogState.otpDialogOpen} fullWidth>
      <DialogTitle>
        {otpDialogTranslations("prompt")}
        <Typography color={"gray"} fontSize={12}>
          ({otpDialogTranslations("checkSpam")})
        </Typography>
      </DialogTitle>
      <Stack sx={{ justifyContent: "center", alignItems: "center" }}>
        {waitingVerificationResult ? (
          <CircularProgress />
        ) : (
          <AuthCode
            onChange={(res: string) => setAuthCodeInput(res)}
            allowedCharacters="numeric"
            inputClassName="authCodeInput"
          />
        )}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography color={"red"}>{error}</Typography>
        </Box>
      </Stack>
      <DialogActions>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            mixpanel.track("Authentication", {
              action: "Cancel",
              dialog: "OTP",
            });
            setAuthDialogState((aDS) => ({ ...aDS, otpDialogOpen: false }));
          }}
          disabled={waitingVerificationResult}
        >
          {inputTranslations("cancel")}
        </Button>
        <Button
          variant="contained"
          endIcon={<Login />}
          onClick={() => {
            mixpanel.track("Authentication", {
              action: "Submit",
              dialog: "OTP",
            });
            const verify = async () => {
              setWaitingVerificationResult(true);
              const err = await handleVerification(authCodeInput);
              setWaitingVerificationResult(false);
              if (err != "") {
                setError(err);
              }
            };
            verify();
          }}
          disabled={verifyButtonDisabled || waitingVerificationResult}
        >
          {inputTranslations("ok")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OtpDialog;
