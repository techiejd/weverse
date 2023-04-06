import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  Tabs,
  Tab,
  DialogContent,
  Typography,
  DialogActions,
  Button,
  Stack,
  TextField,
  CircularProgress,
} from "@mui/material";

import { useAuthState } from "react-firebase-hooks/auth";

import { Login } from "@mui/icons-material";
import OtpDialog from "./otpDialog";
import PhoneInput from "./phoneInput";
import RecaptchaDialog from "./recaptchaDialog";
import ConfirmRegistrationDialog from "./confirmRegistrationDialog";
import { AuthAction, AuthDialogState, prompts } from "./context";
import { AppState, useAppState } from "../../../common/context/appState";
import MakerInput from "./makerInput";

const TabControl = ({
  appState,
  authDialogState,
  setAuthDialogState,
}: {
  appState: AppState;
  authDialogState: AuthDialogState;
  setAuthDialogState: Dispatch<SetStateAction<AuthDialogState>>;
}) => {
  const [user, loading, error] = useAuthState(appState.auth);
  return (
    <Tabs
      value={authDialogState.authAction}
      onChange={(e, newVal) =>
        setAuthDialogState((aDS) => ({ ...aDS, authAction: newVal }))
      }
    >
      <Tab disabled={loading} label={prompts[AuthAction.logIn]} />
      <Tab disabled={loading} label={prompts[AuthAction.register]} />
    </Tabs>
  );
};

const AuthDialogContent = ({
  appState,
  setOpen,
}: {
  appState: AppState;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [user, loading, error] = useAuthState(appState.auth);
  const [authDialogState, setAuthDialogState] = useState<AuthDialogState>({
    phoneNumber: { countryCallingCode: null, nationalNumber: null },
    phoneNumberInputError: false,
    authAction: AuthAction.logIn,
    otpDialogOpen: false,
    recaptchaDialogOpen: false,
    confirmRegistrationDialogOpen: false,
  });

  useEffect(() => {
    console.log("AYo change in : user", user);
  }, [user]);
  useEffect(() => {
    console.log("AYo change in : loading", loading);
  }, [loading]);
  useEffect(() => {
    console.log("AYo change in : error", error);
  }, [error]);

  useEffect(() => {
    if (authDialogState.recaptchaConfirmationResult)
      setAuthDialogState((aDS) => ({ ...aDS, otpDialogOpen: true }));
  }, [authDialogState.recaptchaConfirmationResult, setAuthDialogState]);

  const handleOtp = async (otp: string) => {
    console.log("tok");
    if (authDialogState.recaptchaConfirmationResult == undefined)
      return "Try restarting";
    return authDialogState.recaptchaConfirmationResult
      .confirm(otp)
      .then((userCred) => {
        console.log("homie");
        console.log(userCred);
        /**Stick it into db and return ""*/
        setAuthDialogState((aDS) => ({ ...aDS, otpDialogOpen: false }));
        setOpen(false);
        return "";
      })
      .catch((err) => {
        console.log("in here yo");
        console.log(String(err));
        console.log(JSON.stringify(err));
        return "Wrong code!";
      });
  };

  const onSubmit = () => {
    if (!authDialogState) return;
    const phoneNumber = authDialogState.phoneNumber;
    if (
      !phoneNumber.countryCallingCode ||
      !phoneNumber.nationalNumber == null ||
      phoneNumber.nationalNumber?.length != 10
    ) {
      setAuthDialogState((aDS) =>
        aDS
          ? {
              ...aDS,
              phoneNumberInputError: true,
            }
          : aDS
      );
      return;
    }
    setAuthDialogState((aDS) =>
      aDS
        ? {
            ...aDS,
            phoneNumberInputError: false,
          }
        : aDS
    );

    console.log("bruh");
    console.log("Ayo");
    switch (authDialogState.authAction) {
      case AuthAction.logIn: {
        setAuthDialogState((aDS) => ({ ...aDS, recaptchaDialogOpen: true }));
      }
      case AuthAction.register: {
        setAuthDialogState((aDS) => ({
          ...aDS,
          confirmRegistrationDialogOpen: true,
        }));
      }
    }
  };

  const onConfirmRegistration = () => {
    //TODO(techiejd): Add user to registration.
    console.log("AYO user registered: ", authDialogState);
  };

  return (
    <Box>
      <OtpDialog
        authDialogState={authDialogState}
        setAuthDialogState={setAuthDialogState}
        handleVerification={handleOtp}
      />
      <DialogTitle>¡A autenticarnos!</DialogTitle>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <DialogContent>
          <Box>
            {appState && (
              <TabControl
                appState={appState}
                authDialogState={authDialogState}
                setAuthDialogState={setAuthDialogState}
              />
            )}
          </Box>
          <Stack
            sx={{ width: "100%", justifyContent: "center", mt: 2 }}
            spacing={2}
          >
            <Typography variant="h2">
              {prompts[authDialogState.authAction]}
            </Typography>
            {authDialogState.authAction == AuthAction.register && [
              <ConfirmRegistrationDialog
                authDialogState={authDialogState}
                setAuthDialogState={setAuthDialogState}
                confirm={onConfirmRegistration}
                key="register-confirm"
              />,
              <TextField
                value={authDialogState.name}
                onChange={(e) => {
                  setAuthDialogState((aDS) => ({
                    ...aDS,
                    name: e.target.value,
                  }));
                }}
                required
                helperText="¿Con qué nombre te identificas? Ej: Fula, Fulano, Fulano Detal, etc. Este nombre lo va usar la comunidad de impacto social."
                label="¿Cómo te llamas?"
                key={"register-name"}
              />,
              <Box key={"register-maker"}>
                <MakerInput
                  authDialogState={authDialogState}
                  setAuthDialogState={setAuthDialogState}
                />
              </Box>,
            ]}
            <PhoneInput
              authDialogState={authDialogState}
              setAuthDialogState={setAuthDialogState}
            />
            <RecaptchaDialog
              authDialogState={authDialogState}
              setAuthDialogState={setAuthDialogState}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} variant="outlined" color="secondary">
            Cancelar
          </Button>
          <Button
            disabled={loading}
            variant="contained"
            endIcon={<Login />}
            type="submit"
          >
            {prompts[authDialogState.authAction]}
          </Button>
        </DialogActions>
      </form>
    </Box>
  );
};

const AuthDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const appState = useAppState();

  return (
    <Dialog open={open} fullScreen>
      {appState ? (
        <AuthDialogContent setOpen={setOpen} appState={appState} />
      ) : (
        <CircularProgress />
      )}
    </Dialog>
  );
};

export default AuthDialog;
