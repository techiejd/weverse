import { Dialog, DialogTitle, Box } from "@mui/material";
import { Dispatch, SetStateAction, useRef, useState, useEffect } from "react";

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { AuthDialogState, encodePhoneNumber } from "./context";
import { useAppState } from "../../../common/context/appState";

const RecaptchaDialog = ({
  authDialogState,
  setAuthDialogState,
}: {
  authDialogState: AuthDialogState;
  setAuthDialogState: Dispatch<SetStateAction<AuthDialogState>>;
}) => {
  const appState = useAppState();
  const recaptchaContainer = useRef<HTMLElement | null>(null);
  const [recaptchaContainerReady, setRecaptchaContainerReady] = useState(false);

  useEffect(() => {
    if (!authDialogState.recaptchaDialogOpen) {
      setRecaptchaContainerReady(false);
    }
  }, [authDialogState.recaptchaDialogOpen]);

  useEffect(() => {
    const phoneNumberIsReady =
      authDialogState.phoneNumber.countryCallingCode &&
      authDialogState.phoneNumber.nationalNumber;
    if (!phoneNumberIsReady) return;
    const phoneNumberFormattedForGoogle = encodePhoneNumber(
      authDialogState.phoneNumber
    );

    if (
      appState?.auth &&
      authDialogState.recaptchaDialogOpen &&
      recaptchaContainerReady
    ) {
      const triggerSignInProcess = async () => {
        if (recaptchaContainer.current != null) {
          const verifier = new RecaptchaVerifier(
            recaptchaContainer.current,
            {},
            appState.auth
          );
          const confirmationResult = await signInWithPhoneNumber(
            appState.auth,
            phoneNumberFormattedForGoogle,
            verifier
          );
          const resetRecaptchaDialogState = () => {
            verifier.clear();
          };
          resetRecaptchaDialogState();

          setAuthDialogState((aDS) => ({
            ...aDS,
            recaptchaConfirmationResult: confirmationResult,
            recaptchaDialogOpen: false,
          }));
        }
      };
      triggerSignInProcess();
    }
  }, [
    appState?.auth,
    authDialogState.phoneNumber,
    authDialogState.recaptchaDialogOpen,
    setAuthDialogState,
    recaptchaContainerReady,
  ]);

  return (
    <Dialog open={authDialogState.recaptchaDialogOpen} fullWidth>
      <DialogTitle>
        Lamentamos tener que preguntar, pero ¿eres un robot?
      </DialogTitle>
      <center>
        <Box
          ref={(r) => {
            recaptchaContainer.current = r as HTMLElement;
            setRecaptchaContainerReady(true);
          }}
          m={0}
          p={1}
        ></Box>
      </center>
    </Dialog>
  );
};

export default RecaptchaDialog;
