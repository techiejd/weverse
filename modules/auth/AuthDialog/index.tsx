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
import { useAuthState, useUpdateProfile } from "react-firebase-hooks/auth";
import { collection, addDoc, setDoc, doc, getDoc } from "firebase/firestore";
import { Login } from "@mui/icons-material";
import OtpDialog from "./otpDialog";
import PhoneInput from "./phoneInput";
import RecaptchaDialog from "./recaptchaDialog";
import ConfirmRegistrationDialog from "./confirmRegistrationDialog";
import {
  AuthAction,
  AuthDialogState,
  encodePhoneNumber,
  maker,
  prompts,
} from "./context";
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

const CheckingUserRegisteredExplanation = ({
  authAction,
}: {
  authAction: AuthAction;
}) => {
  return (
    <Box>
      <Typography>
        Un momento mientras verificamos que{" "}
        {authAction == AuthAction.logIn ? "ya" : "no"} estes registrado.
      </Typography>
      <CircularProgress />
    </Box>
  );
};

const UserRegisteredError = ({ authAction }: { authAction: AuthAction }) => {
  return (
    <Typography color={"red"}>
      Hola, {authAction == AuthAction.logIn ? "no" : "ya"} estas registrado.
    </Typography>
  );
};

const AuthDialogContent = ({
  appState,
  setOpen,
  initialAuthAction,
}: {
  appState: AppState;
  setOpen: Dispatch<SetStateAction<boolean>>;
  initialAuthAction: AuthAction;
}) => {
  const [user, userLoading, authError] = useAuthState(appState.auth);
  const [updateProfile, updating, updateProfileError] = useUpdateProfile(
    appState.auth
  );
  const [authDialogState, setAuthDialogState] = useState<AuthDialogState>({
    name: "",
    phoneNumber: { countryCallingCode: null, nationalNumber: null },
    phoneNumberInputError: false,
    authAction: initialAuthAction,
    otpDialogOpen: false,
    recaptchaDialogOpen: false,
    confirmRegistrationDialogOpen: false,
    maker: {}, // Right now we are only onboarding makers
    checkingUserRegistered: false,
    userRegisteredError: false,
  });

  useEffect(() => {
    console.log("AYo change in : user", user);
  }, [user]);
  useEffect(() => {
    console.log("AYo change in : loading", userLoading);
  }, [userLoading]);
  useEffect(() => {
    console.log("AYo change in : error", authError);
  }, [authError]);

  useEffect(() => {
    if (authDialogState.recaptchaConfirmationResult)
      setAuthDialogState((aDS) => ({ ...aDS, otpDialogOpen: true }));
  }, [authDialogState.recaptchaConfirmationResult, setAuthDialogState]);

  useEffect(() => {
    setAuthDialogState((aDS) =>
      aDS.userRegisteredError ? { ...aDS, userRegisteredError: false } : aDS
    );
  }, [authDialogState.authAction, setAuthDialogState]);

  const handleOtp = async (otp: string) => {
    console.log("tok");
    console.log(otp);
    if (authDialogState.recaptchaConfirmationResult == undefined)
      return "Try restarting";
    return authDialogState.recaptchaConfirmationResult
      .confirm(otp)
      .then(async (userCred) => {
        let error = "";
        console.log("homie");
        console.log(userCred);
        /**Stick it into db and return ""*/
        if (authDialogState.authAction == AuthAction.register) {
          const createUserAndMaker = async () => {
            const updateSuccessful = updateProfile({
              displayName: authDialogState.name,
              photoURL:
                authDialogState.maker?.type == "individual"
                  ? authDialogState.maker?.pic
                  : undefined,
            });
            console.log("breakpoint: ", userCred);

            const makerDocRef = await (async () => {
              if (!authDialogState.maker) return undefined;
              const makerEncoded = maker.parse({
                ...authDialogState.maker,
                ownerId: userCred.user.uid,
                name:
                  authDialogState.maker?.type == "individual"
                    ? authDialogState.name
                    : authDialogState.maker?.name,
              });
              return await addDoc(
                collection(appState.firestore, "makers"),
                makerEncoded
              );
            })();

            const userDocPromise = setDoc(
              doc(appState.firestore, "users", userCred.user.uid),
              makerDocRef ? { maker: makerDocRef.id } : {}
            );

            const registeredPhoneNumberPromise = setDoc(
              doc(
                appState.firestore,
                "registeredPhoneNumbers",
                encodePhoneNumber(authDialogState.phoneNumber)
              ),
              { ownerId: userCred.user.uid }
            );

            const [finishedUpdateSuccessful, userDoc, registeredPhoneNumber] =
              await Promise.all([
                updateSuccessful,
                userDocPromise,
                registeredPhoneNumberPromise,
              ]);

            if (!finishedUpdateSuccessful)
              error = updateProfileError?.message
                ? updateProfileError?.message
                : "";
          };
          await createUserAndMaker();
        }
        setAuthDialogState((aDS) => ({ ...aDS, otpDialogOpen: false }));
        setOpen(false);
        return error;
      })
      .catch((err) => {
        console.log("in here yo");
        console.log(String(err));
        console.log(JSON.stringify(err));
        return "Wrong code!";
      });
  };

  const checkIfUserRegistered = async () => {
    setAuthDialogState((aDS) => ({
      ...aDS,
      checkingUserRegistered: true,
    }));

    const registeredPNRef = doc(
      appState.firestore,
      "registeredPhoneNumbers",
      encodePhoneNumber(authDialogState.phoneNumber)
    );
    const registeredPNDoc = await getDoc(registeredPNRef);

    setAuthDialogState((aDS) => ({
      ...aDS,
      checkingUserRegistered: false,
    }));

    return registeredPNDoc.exists();
  };

  const onSubmit = async () => {
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

    const userIsRegistered = await checkIfUserRegistered();
    switch (authDialogState.authAction) {
      case AuthAction.logIn: {
        if (!userIsRegistered) {
          setAuthDialogState((aDS) => ({
            ...aDS,
            userRegisteredError: true,
          }));
          return;
        }
        break;
      }
      case AuthAction.register: {
        if (userIsRegistered) {
          setAuthDialogState((aDS) => ({
            ...aDS,
            userRegisteredError: true,
          }));
          return;
        }
        break;
      }
    }

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
    setAuthDialogState((aDS) => ({
      ...aDS,
      confirmRegistrationDialogOpen: false,
      recaptchaDialogOpen: true,
    }));
  };

  return (
    <Box>
      <OtpDialog
        authDialogState={authDialogState}
        setAuthDialogState={setAuthDialogState}
        handleVerification={handleOtp}
      />
      <RecaptchaDialog
        authDialogState={authDialogState}
        setAuthDialogState={setAuthDialogState}
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
            {authDialogState.checkingUserRegistered && (
              <CheckingUserRegisteredExplanation
                authAction={authDialogState.authAction}
              />
            )}
            {authDialogState.userRegisteredError && (
              <UserRegisteredError authAction={authDialogState.authAction} />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={authDialogState.checkingUserRegistered}
            variant="outlined"
            color="secondary"
            onClick={(e) => {
              setOpen(false);
            }}
          >
            Cancelar
          </Button>
          <Button
            disabled={userLoading || authDialogState.checkingUserRegistered}
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

export const AuthDialogButton = ({
  setAuthDialogOpen,
  authAction = AuthAction.logIn,
  buttonVariant = "outlined",
}: {
  setAuthDialogOpen: Dispatch<SetStateAction<boolean>>;
  authAction?: AuthAction;
  buttonVariant?: "text" | "outlined" | "contained";
}) => {
  const appState = useAppState();

  const AuthDialogButtonInner = ({ appState }: { appState: AppState }) => {
    const [user, loading, error] = useAuthState(appState.auth);
    return loading ? (
      <CircularProgress />
    ) : (
      <Button
        size="small"
        variant={buttonVariant}
        disabled={user != null || user != undefined}
        onClick={(e) => {
          setAuthDialogOpen(true);
        }}
      >
        {authAction == AuthAction.logIn ? "Iniciar Sesión" : "Registrarme"}
      </Button>
    );
  };
  return appState == undefined ? (
    <CircularProgress />
  ) : (
    <AuthDialogButtonInner appState={appState} />
  );
};

const AuthDialog = ({
  open,
  setOpen,
  initialAuthAction = AuthAction.logIn,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  initialAuthAction?: AuthAction;
}) => {
  const appState = useAppState();

  return (
    <Dialog open={open} fullScreen>
      {appState ? (
        <AuthDialogContent
          setOpen={setOpen}
          appState={appState}
          initialAuthAction={initialAuthAction}
        />
      ) : (
        <CircularProgress />
      )}
    </Dialog>
  );
};

export default AuthDialog;
