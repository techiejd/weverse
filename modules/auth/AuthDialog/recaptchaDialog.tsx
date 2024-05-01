import {
  Dialog,
  DialogTitle,
  Box,
  DialogContentText,
  CircularProgress,
} from "@mui/material";
import { Dispatch, SetStateAction, useRef, useState, useEffect } from "react";

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { AuthDialogState, encodePhoneNumber } from "./context";
import { useAppState } from "../../../common/context/appState";
import { useTranslations } from "next-intl";
import mixpanel from "mixpanel-browser";

const RecaptchaDialog = ({
  authDialogState,
  setAuthDialogState,
}: {
  authDialogState: AuthDialogState;
  setAuthDialogState: Dispatch<SetStateAction<AuthDialogState>>;
}) => {
  const t = useTranslations("auth.recaptchaDialog");
  const appState = useAppState();
  const recaptchaContainer = useRef<HTMLElement | null>(null);
  const [recaptchaContainerReady, setRecaptchaContainerReady] = useState(false);

  useEffect(() => {
    if (!authDialogState.recaptchaDialogOpen) {
      setRecaptchaContainerReady(false);
    }
  }, [authDialogState.recaptchaDialogOpen]);
  useEffect(() => {
    mixpanel.track("Authentication", {
      action: "View",
      dialog: "Recaptcha",
    });
  }, []);

  useEffect(() => {
    const phoneNumberIsReady =
      authDialogState.phoneNumber.countryCallingCode &&
      authDialogState.phoneNumber.nationalNumber;
    if (!phoneNumberIsReady) return;
    const phoneNumberFormattedForGoogle = encodePhoneNumber(
      authDialogState.phoneNumber
    );

    if (
      appState?.authState &&
      authDialogState.recaptchaDialogOpen &&
      recaptchaContainerReady
    ) {
      const triggerSignInProcess = async () => {
        if (recaptchaContainer.current != null) {
          const verifier = new RecaptchaVerifier(
            recaptchaContainer.current,
            { size: "invisible" },
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
          mixpanel.track("Authentication", {
            action: "Submit",
            dialog: "Recaptcha",
          });

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
    appState?.authState,
    authDialogState.phoneNumber,
    authDialogState.recaptchaDialogOpen,
    setAuthDialogState,
    recaptchaContainerReady,
    appState.auth,
  ]);

  return (
    <Dialog open={authDialogState.recaptchaDialogOpen} fullWidth>
      <DialogTitle>{t("title")}</DialogTitle>
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
      <CircularProgress />
      <DialogContentText>
        {t.rich("inCaseCantGoOnContactCommunity", {
          email: (chunks) => <a href="mailto:community@onewe.co">{chunks}</a>,
        })}
      </DialogContentText>
    </Dialog>
  );
};

export default RecaptchaDialog;
