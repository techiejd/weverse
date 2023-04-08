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
    console.log(
      "phoneNumber: ",
      phoneNumberIsReady,
      phoneNumberFormattedForGoogle
    );
    console.log("yo");

    if (
      appState?.auth &&
      authDialogState.recaptchaDialogOpen &&
      recaptchaContainerReady
    ) {
      const triggerSignInProcess = async () => {
        console.log("here: ", {
          auth: appState.auth,
          pN: authDialogState.phoneNumber,
          open: authDialogState.recaptchaDialogOpen,
          recaptchaContainerReady,
        });
        console.log("Window: ", window);
        console.log(recaptchaContainer);
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

          console.log("Is the error happening before this?");
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

  console.log("here too: ", {
    auth: appState?.auth,
    pN: authDialogState.phoneNumber,
    open: authDialogState.recaptchaDialogOpen,
    recaptchaContainerReady,
  });
  console.log(open);

  return (
    <Dialog open={authDialogState.recaptchaDialogOpen} fullWidth>
      <DialogTitle>
        Lamentamos tener que preguntar, pero ¿eres un robot?
      </DialogTitle>
      <center>
        <Box
          ref={(r) => {
            recaptchaContainer.current = r as HTMLElement;
            console.log("current: ", recaptchaContainer.current);
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
