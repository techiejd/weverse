import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Box,
  Dialog,
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
import { useUpdateProfile } from "react-firebase-hooks/auth";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { Login } from "@mui/icons-material";
import OtpDialog from "./otpDialog";
import PhoneInput from "./phoneInput";
import RecaptchaDialog from "./recaptchaDialog";
import ConfirmRegistrationDialog from "./confirmRegistrationDialog";
import {
  AuthAction,
  AuthDialogState,
  encodePhoneNumber,
  prompts,
} from "./context";
import { useAppState } from "../../../common/context/appState";
import { maker } from "../../../functions/shared/src";
import {
  incubateeConverter,
  makerConverter,
  memberConverter,
} from "../../../common/utils/firebase";
import { useRouter } from "next/router";

const TabControl = ({
  authDialogState,
  setAuthDialogState,
}: {
  authDialogState: AuthDialogState;
  setAuthDialogState: Dispatch<SetStateAction<AuthDialogState>>;
}) => {
  const { user, loading } = useAppState().authState;
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
  setOpen,
  initialAuthAction,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  initialAuthAction: AuthAction;
}) => {
  const appState = useAppState();
  const { user, loading: userLoading } = appState.authState;
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
    checkingUserRegistered: false,
    userRegisteredError: false,
  });

  useEffect(() => {
    if (authDialogState.recaptchaConfirmationResult)
      setAuthDialogState((aDS) => ({ ...aDS, otpDialogOpen: true }));
  }, [authDialogState.recaptchaConfirmationResult, setAuthDialogState]);

  useEffect(() => {
    setAuthDialogState((aDS) =>
      aDS.userRegisteredError ? { ...aDS, userRegisteredError: false } : aDS
    );
  }, [authDialogState.authAction, setAuthDialogState]);

  //TODO(techiejd): Look into reducing the logic for authentication.
  const router = useRouter();
  const { invitedAsMaker, inviter } = router.query;
  const makersCollection = collection(
    appState.firestore,
    "makers"
  ).withConverter(makerConverter);
  const invitedMakerDocRef = invitedAsMaker
    ? doc(makersCollection, invitedAsMaker as string)
    : null;
  const incubateeDocRef =
    inviter && invitedAsMaker
      ? doc(
          appState.firestore,
          "makers",
          inviter as string,
          "incubatees",
          invitedAsMaker as string
        ).withConverter(incubateeConverter)
      : null;

  // First we need to maker sure that the invitedAsMaker query param is valid.
  // The invitedAsMaker is a maker whose ownerId is "invited".
  useEffect(() => {
    if (invitedAsMaker) {
      const makerDoc = doc(
        appState.firestore,
        "makers",
        invitedAsMaker as string
      ).withConverter(makerConverter);
      getDoc(makerDoc).then((makerDocSnap) => {
        if (!makerDocSnap.exists()) {
          alert(
            "Este vinculo no es valido. Hay que pedir otro de la incubadora."
          );
          router.push("/");
        }
        const makerData = makerDocSnap.data();
        if (makerData!.ownerId != "invited") {
          alert("Este vinculo ya se usó. Hay que pedir otro de la incubadora.");
          router.push("/");
        }
      });
    }
  }, [invitedAsMaker, router, appState.firestore]);

  const handleOtp = async (otp: string) => {
    if (authDialogState.recaptchaConfirmationResult == undefined)
      return "Try restarting";
    return authDialogState.recaptchaConfirmationResult
      .confirm(otp)
      .then(async (userCred) => {
        let error = "";
        if (authDialogState.authAction == AuthAction.register) {
          const createUserAndMaker = async () => {
            const updateSuccessful = updateProfile({
              displayName: authDialogState.name,
            });
            const makerDocRef = await (async () => {
              if (invitedMakerDocRef && incubateeDocRef) {
                const batch = writeBatch(appState.firestore);
                batch.update(invitedMakerDocRef, {
                  ownerId: userCred.user.uid,
                });
                batch.update(incubateeDocRef, {
                  acceptedInvite: true,
                });
                await batch.commit();
                return invitedMakerDocRef;
              }
              // So we assume all users are also makers. They can edit this later.
              return addDoc(makersCollection, {
                ownerId: userCred.user.uid,
                name: authDialogState.name,
                type: "individual",
              });
            })();

            // TODO(techiejd): Look into merging registerdPhoneNumbers and members.
            const memberDocPromise = setDoc(
              doc(
                appState.firestore,
                "members",
                userCred.user.uid
              ).withConverter(memberConverter),
              { makerId: makerDocRef.id }
            );

            const registeredPhoneNumberPromise = setDoc(
              doc(
                appState.firestore,
                "registeredPhoneNumbers",
                encodePhoneNumber(authDialogState.phoneNumber)
              ),
              { ownerId: userCred.user.uid }
            );

            const [finishedUpdateSuccessful] = await Promise.all([
              updateSuccessful,
              memberDocPromise,
              registeredPhoneNumberPromise,
            ]);

            if (!finishedUpdateSuccessful)
              error = updateProfileError?.message
                ? updateProfileError?.message
                : "";
          };
          await createUserAndMaker();
        } else {
          if (invitedAsMaker) {
            return "You can't login with an invite link.";
          }
        }

        setAuthDialogState((aDS) => ({ ...aDS, otpDialogOpen: false }));
        setOpen(false);
        return error;
      })
      .catch((err) => {
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
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <DialogContent>
          <TabControl
            authDialogState={authDialogState}
            setAuthDialogState={setAuthDialogState}
          />
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
                helperText="¿Con qué nombre te identificas? Ej: Fula, Fulano, Fulano Detal, etc. Este nombre lo usará la comunidad OneWe para conocerte y conocer tu iniciativa."
                label="¿Cómo te llamas?"
                key={"register-name"}
              />,
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
  const { user, loading } = useAppState().authState;
  return loading ? (
    <CircularProgress />
  ) : (
    <Button
      size="small"
      variant={buttonVariant}
      disabled={!!user}
      onClick={(e) => {
        setAuthDialogOpen(true);
      }}
    >
      {authAction == AuthAction.logIn ? "Iniciar Sesión" : "Registrarme"}
    </Button>
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
  return (
    <Dialog open={open} fullScreen>
      <AuthDialogContent
        setOpen={setOpen}
        initialAuthAction={initialAuthAction}
      />
    </Dialog>
  );
};

export default AuthDialog;
