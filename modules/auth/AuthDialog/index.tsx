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
  writeBatch,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Login from "@mui/icons-material/Login";
import OtpDialog from "./otpDialog";
import PhoneInput from "./phoneInput";
import RecaptchaDialog from "./recaptchaDialog";
import ConfirmRegistrationDialog from "./confirmRegistrationDialog";
import { AuthAction, AuthDialogState, encodePhoneNumber } from "./context";
import { useAppState } from "../../../common/context/appState";
import {
  useIncubateeConverter,
  useInitiativeConverter,
  useMemberConverter,
} from "../../../common/utils/firebase";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

const usePrompts = () => {
  const t = useTranslations("auth");
  const commonTranslations = useTranslations("common");
  return {
    [AuthAction.logIn]: commonTranslations("callToAction.login"),
    [AuthAction.register]: t("register"),
  };
};

const TabControl = ({
  authDialogState,
  setAuthDialogState,
}: {
  authDialogState: AuthDialogState;
  setAuthDialogState: Dispatch<SetStateAction<AuthDialogState>>;
}) => {
  const { loading } = useAppState().authState;
  const prompts = usePrompts();
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

const CheckingUserStatusExplanation = ({
  authAction,
}: {
  authAction: AuthAction;
}) => {
  const t = useTranslations("auth");
  return (
    <Box>
      <Typography>
        {t("pleaseWaitWhileWeCheckUserStatus", { authAction: authAction })}
      </Typography>
      <CircularProgress />
    </Box>
  );
};

const UserRegisteredError = ({ authAction }: { authAction: AuthAction }) => {
  const t = useTranslations("auth");
  return (
    <Typography color={"red"}>
      {t("userRegisteredError", { authAction: authAction })}
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
  const authTranslations = useTranslations("auth");
  const inputTranslations = useTranslations("input");
  const appState = useAppState();
  const { loading: userLoading } = appState.authState;
  const memberConverter = useMemberConverter();
  const initiativeConverter = useInitiativeConverter();
  const incubateeConverter = useIncubateeConverter();
  const [updateProfile, _, updateProfileError] = useUpdateProfile(
    appState.auth
  );
  const [authDialogState, setAuthDialogState] = useState<AuthDialogState>({
    name: "",
    phoneNumber: {},
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
  const { invitedInitiative, inviter } = router.query;
  const initiativesCollection = collection(
    appState.firestore,
    "initiatives"
  ).withConverter(initiativeConverter);
  const invitedInitiativeDocRef = invitedInitiative
    ? doc(initiativesCollection, invitedInitiative as string)
    : null;
  const incubateeDocRef =
    inviter && invitedInitiative
      ? doc(
          appState.firestore,
          "initiatives",
          inviter as string,
          "incubatees",
          invitedInitiative as string
        ).withConverter(incubateeConverter)
      : null;

  // First we need to initiative sure that the invitedInitiative query param is valid.
  // The invitedInitiative is a initiative whose ownerId is "invited".
  useEffect(() => {
    if (invitedInitiative) {
      const initiativeDoc = doc(
        appState.firestore,
        "initiatives",
        invitedInitiative as string
      ).withConverter(initiativeConverter);
      getDoc(initiativeDoc).then((initiativeDocSnap) => {
        if (!initiativeDocSnap.exists()) {
          alert(
            authTranslations(
              "invitedInitiative.invalidInvitationLinkAskForAnother"
            )
          );
          router.push("/");
        }
        const initiativeData = initiativeDocSnap.data();
        if (initiativeData!.ownerId != "invited") {
          alert("invitedInitiative.usedInvitationLink");
          router.push("/");
        }
      });
    }
  }, [
    invitedInitiative,
    router,
    appState.firestore,
    authTranslations,
    initiativeConverter,
  ]);

  const handleOtp = async (otp: string) => {
    if (authDialogState.recaptchaConfirmationResult == undefined)
      return authTranslations("handleOtp.restartPrompt");
    return authDialogState.recaptchaConfirmationResult
      .confirm(otp)
      .then(async (userCred) => {
        let error = "";
        if (authDialogState.authAction == AuthAction.register) {
          const createUserAndInitiative = async () => {
            const updateSuccessful = updateProfile({
              displayName: authDialogState.name,
            });
            const initiativeDocRef = await (async () => {
              if (invitedInitiativeDocRef && incubateeDocRef) {
                const batch = writeBatch(appState.firestore);
                batch.update(invitedInitiativeDocRef, {
                  ownerId: userCred.user.uid,
                });
                batch.update(incubateeDocRef, {
                  acceptedInvite: true,
                });
                await batch.commit();
                return invitedInitiativeDocRef;
              }
              // So we assume all users are also initiatives. They can edit this later.
              return addDoc(initiativesCollection, {
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
              {
                initiativeId: initiativeDocRef.id,
                name: authDialogState.name,
                phoneNumber: {
                  countryCallingCode:
                    authDialogState.phoneNumber.countryCallingCode!,
                  nationalNumber: authDialogState.phoneNumber.nationalNumber!,
                },
              }
            );

            const [finishedUpdateSuccessful] = await Promise.all([
              updateSuccessful,
              memberDocPromise,
            ]);

            if (!finishedUpdateSuccessful)
              error = updateProfileError?.message
                ? updateProfileError?.message
                : "";
          };
          await createUserAndInitiative();
        } else {
          if (invitedInitiative) {
            return authTranslations("handleOtp.invitedInitiativeNotPossible");
          }
        }

        setAuthDialogState((aDS) => ({ ...aDS, otpDialogOpen: false }));
        setOpen(false);
        return error;
      })
      .catch((err) => {
        return authTranslations("handleOtp.invalidOtp");
      });
  };

  const checkIfUserRegistered = async () => {
    setAuthDialogState((aDS) => ({
      ...aDS,
      checkingUserRegistered: true,
    }));

    const registeredMembersWithPN = await getDocs(
      query(
        collection(appState.firestore, "members"),
        where(
          "phoneNumber.countryCallingCode",
          "==",
          authDialogState.phoneNumber.countryCallingCode
        ),
        where(
          "phoneNumber.nationalNumber",
          "==",
          authDialogState.phoneNumber.nationalNumber
        )
      )
    );

    setAuthDialogState((aDS) => ({
      ...aDS,
      checkingUserRegistered: false,
    }));

    return !registeredMembersWithPN.empty;
  };

  const onSubmit = async () => {
    const phoneNumber = authDialogState.phoneNumber;
    if (
      !phoneNumber.countryCallingCode ||
      !phoneNumber.nationalNumber == null ||
      phoneNumber.nationalNumber!.length < 4 // https://www.quora.com/What-is-maximum-and-minimum-length-of-any-mobile-number-across-the-world
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

  const prompts = usePrompts();

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
                helperText={authTranslations("nameHelperText")}
                label={authTranslations("namePlaceholder")}
                key={"register-name"}
              />,
            ]}
            <PhoneInput
              authDialogState={authDialogState}
              setAuthDialogState={setAuthDialogState}
            />
            {authDialogState.checkingUserRegistered && (
              <CheckingUserStatusExplanation
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
            {inputTranslations("cancel")}
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
  const t = useTranslations("auth");
  const commonTranslations = useTranslations("common");
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
      {authAction == AuthAction.logIn
        ? commonTranslations("callToAction.login")
        : t("register")}
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
