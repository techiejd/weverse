import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAppState } from "../common/context/appState";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import {
  Box,
  Dialog,
  DialogTitle,
  Tabs,
  Tab,
  DialogContent,
  Fab,
  Icon,
  Typography,
  DialogActions,
  Button,
  Stack,
} from "@mui/material";

import AuthCode from "react-auth-code-input";

import { MuiTelInput, MuiTelInputInfo } from "mui-tel-input";
import { Login as LoginIcon } from "@mui/icons-material";

type PhoneNumber = {
  countryCallingCode?: string | null;
  nationalNumber?: string | null;
};

const PhoneInput = ({
  setPhoneNumber,
  error,
}: {
  setPhoneNumber: Dispatch<SetStateAction<PhoneNumber>>;
  error: boolean;
}) => {
  const [phoneNumberIn, setPhoneNumberIn] = useState("");

  const onPhoneNumberChange = (value: string, info: MuiTelInputInfo) => {
    if (info.nationalNumber == null || info.nationalNumber.length <= 10) {
      setPhoneNumber({
        countryCallingCode: info.countryCallingCode,
        nationalNumber: info.nationalNumber,
      });
      setPhoneNumberIn(value);
    }
  };
  return (
    <MuiTelInput
      defaultCountry="CO"
      continents={["NA", "SA"]}
      value={phoneNumberIn}
      error={error}
      onChange={onPhoneNumberChange}
    />
  );
};

const VerifyCodeDialog = ({
  open,
  setOpen,
  handleVerification,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleVerification: (otp: string) => Promise<string>;
}) => {
  const [authCodeInput, setAuthCodeInput] = useState<string>("");
  const [verifyButtonDisabled, setVerifyButtonDisabled] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setVerifyButtonDisabled(authCodeInput.length == 6 ? false : true);
  }, [authCodeInput, setVerifyButtonDisabled]);
  return (
    <Dialog open={open} fullWidth>
      <DialogTitle textAlign={"justify"} fontSize={18}>
        Ingrese el código de verificación que debería haber recibido.
      </DialogTitle>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <AuthCode
          onChange={(res: string) => setAuthCodeInput(res)}
          allowedCharacters="numeric"
          inputClassName="authCodeInput"
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography color={"red"}>{error}</Typography>
      </Box>
      <DialogActions>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setOpen(false)}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          endIcon={<LoginIcon />}
          onClick={() => {
            console.log(authCodeInput);
            const verify = async () => {
              const err = await handleVerification(authCodeInput);
              if (err != "") {
                console.log("We were right all along");
                console.log(err);
                setError(err);
              }
            };
            verify();
          }}
          disabled={verifyButtonDisabled}
        >
          Listo
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AuthDialog = () => {
  const [otp, setotp] = useState("");
  const [show, setshow] = useState(false);
  const appState = useAppState();
  const [phoneNumber, setPhoneNumber] = useState<PhoneNumber>({
    countryCallingCode: null,
    nationalNumber: null,
  });
  const [phoneNumberError, setPhoneNumberError] = useState(false);

  const handleOtp = async (otp: string) => {
    console.log("tok");
    if (confirmationResult == undefined) "Try restarting";
    return confirmationResult
      .confirm(otp)
      .then((result) => {
        console.log("homie");
        console.log(result);
        /**Stick it into db and return ""*/
        return "";
      })
      .catch((err) => {
        console.log("in here yo");
        console.log(String(err));
        console.log(JSON.stringify(err));
        return "Wrong code!";
      });
  };

  const [confirmationResult, setConfirmationResult] = useState<
    ConfirmationResult | undefined
  >(undefined);

  const [tabIdx, setTabIdx] = React.useState<0 | 1>(0);

  const [verifyCodeDialogOpen, setVerifyCodeDialogOpen] = useState(true);

  const prompts = { 0: "Iniciar sesión", 1: "Registrarme" };

  const onSubmit = () => {
    if (
      !phoneNumber.countryCallingCode ||
      !phoneNumber.nationalNumber == null ||
      phoneNumber.nationalNumber?.length != 10
    ) {
      setPhoneNumberError(true);
      return;
    }
    console.log("bruh");
    if (appState) {
      console.log("Ayo");
      const triggerVerifications = async () => {
        const verifier = new RecaptchaVerifier(
          "recaptcha-container",
          {},
          appState.auth
        );
        console.log(phoneNumber);
        const confirmationResult = await signInWithPhoneNumber(
          appState.auth,
          `+${phoneNumber.countryCallingCode}${phoneNumber.nationalNumber}`,
          verifier
        );

        setConfirmationResult(confirmationResult);
        setVerifyCodeDialogOpen(true);
      };
      triggerVerifications();
    }
  };

  return (
    <Dialog open={true} fullScreen>
      <VerifyCodeDialog
        open={verifyCodeDialogOpen && confirmationResult != undefined}
        setOpen={setVerifyCodeDialogOpen}
        handleVerification={handleOtp}
      />
      <DialogTitle>¡A autenticarnos!</DialogTitle>
      <DialogContent>
        <Box>
          <Tabs value={tabIdx} onChange={(e, newVal) => setTabIdx(newVal)}>
            <Tab label={prompts[0]} />
            <Tab label={prompts[1]} />
          </Tabs>
        </Box>
        <Stack
          sx={{ width: "100%", justifyContent: "center", mt: 2 }}
          spacing={2}
        >
          <Typography variant="h2">{prompts[tabIdx]}</Typography>
          <PhoneInput
            error={phoneNumberError}
            setPhoneNumber={setPhoneNumber}
          />
          <div id="recaptcha-container" />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="secondary">
          Cancelar
        </Button>
        <Button variant="contained" endIcon={<LoginIcon />} onClick={onSubmit}>
          {prompts[tabIdx]}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Login = () => {
  // Inputs
  const [mynumber, setnumber] = useState("");
  return (
    <div style={{ marginTop: "200px" }}>
      <AuthDialog />
    </div>
  );
};

export default Login;
