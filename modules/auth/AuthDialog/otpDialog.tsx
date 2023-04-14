import { Login } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  Box,
  CircularProgress,
  Typography,
  DialogActions,
  Button,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import AuthCode from "react-auth-code-input";
import { AuthDialogState } from "./context";

const OtpDialog = ({
  authDialogState,
  setAuthDialogState,
  handleVerification,
}: {
  authDialogState: AuthDialogState;
  setAuthDialogState: Dispatch<SetStateAction<AuthDialogState>>;
  handleVerification: (otp: string) => Promise<string>;
}) => {
  const [authCodeInput, setAuthCodeInput] = useState<string>("");
  const [verifyButtonDisabled, setVerifyButtonDisabled] = useState(true);
  const [error, setError] = useState("");
  const [waitingVerificationResult, setWaitingVerificationResult] =
    useState(false);

  useEffect(() => {
    setVerifyButtonDisabled(authCodeInput.length == 6 ? false : true);
  }, [authCodeInput, setVerifyButtonDisabled]);
  return (
    <Dialog open={authDialogState.otpDialogOpen} fullWidth>
      <DialogTitle textAlign={"justify"} fontSize={18}>
        Ingresa el código de verificación que recibiste.
      </DialogTitle>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {waitingVerificationResult ? (
          <CircularProgress />
        ) : (
          <AuthCode
            onChange={(res: string) => setAuthCodeInput(res)}
            allowedCharacters="numeric"
            inputClassName="authCodeInput"
          />
        )}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography color={"red"}>{error}</Typography>
      </Box>
      <DialogActions>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() =>
            setAuthDialogState((aDS) => ({ ...aDS, otpDialogOpen: false }))
          }
          disabled={waitingVerificationResult}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          endIcon={<Login />}
          onClick={() => {
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
          Listo
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OtpDialog;
