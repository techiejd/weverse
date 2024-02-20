import {
  Stack,
  Typography,
  CircularProgress,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { ParsedUrlQuery } from "querystring";
import { WithTranslationsServerSideProps } from "../../../../../common/utils/translations";
import { asOneWePage } from "../../../../../common/components/onewePage";
import {
  getAdminFirestore,
  getAuthentication,
} from "../../../../../common/utils/firebaseAdmin";
import Utils, {
  createStripeAccountLink,
} from "../../../../../common/context/serverUtils";
import { useAlertOrRedirectToOnboardingStripeAccount } from "../../../../../modules/initiatives/context";
import { Initiative } from "../../../../../functions/shared/src";
import { useAppState } from "../../../../../common/context/appState";
import { deleteField, doc, updateDoc, writeBatch } from "firebase/firestore";
import {
  useInitiativeConverter,
  useMemberConverter,
} from "../../../../../common/utils/firebase";
import { useRouter } from "next/router";
import { GetServerSidePropsResult } from "next";

// Should be able to see the connected account to this initiative.
// Should be able to connect an account if not connected already.
// Should be able to disconnect an account if connected already.
// If the initiative is an incubator, it will see its incubatees' account.
// If the initative is an incubator, it should be able to create a new account for an incubatee.

interface Slugs extends ParsedUrlQuery {
  userId?: string;
  initiativeId?: string;
}

/** Tread lightly in this file; it's diffiuclt since there's 128 different combinations = 2^7.
 * isNotAnIncubatee (hasConnectedAccount (onboarded xor not onboarded) xor doesNotHaveConnectedAccount) 4
 * xor isAnIncubatee (hasConnectedAccount ((ownedByIncubator and done)1 xor
 * (ownedByIncubator and notDone (notAgreedUpon or notOnboarded)2)4
 *  xor notOwnedByIncubator (onboarded xor not onboarded)4)16
 * xor doesNotHaveConnectedAccount)32
 */

export const getServerSideProps = WithTranslationsServerSideProps(
  async (ctx): Promise<GetServerSidePropsResult<AccountProps>> => {
    const { userId, initiativeId } = ctx.params as Slugs;
    const authentication = await getAuthentication(ctx);
    if (!userId || !initiativeId) {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    }
    if (!authentication.authenticated) {
      return {
        redirect: {
          destination: `/members/logIn`, // TODO(techiejd): ?redirect=/members/${userId}/initiatives/${initiativeId}/accountredirect to the current page after login
          permanent: false,
        },
      };
    }
    // Change this to allow for incubators to see their incubatees' accounts.
    if (userId !== authentication.uid) {
      return {
        redirect: {
          destination: `/401`, // TODO: redirect to the current page after login
          permanent: false,
        },
      };
    }

    // Check if this initiative is already connected to an account.
    // If already connected and onboarded add a button to disconnect the account or visit the account.
    // If already connected but not onboarded, add a button to continue onboarding.
    // If not already connected, give them the option to connect an account.

    const firestore = getAdminFirestore();
    const maybeInitiative = (
      await firestore
        .doc(`members/${userId}/initiatives/${initiativeId}`)
        .withConverter(Utils.initiativeConverter)
        .get()
    ).data();
    if (!maybeInitiative) {
      throw new Error(`Initiative not found: ${initiativeId}`);
    }
    const initiative = maybeInitiative as Initiative;
    const accountIsOwnedByIncubator = !!initiative.incubator?.connectedAccount;
    const incubatorWaitingOnIncubatee =
      initiative.incubator?.connectedAccount == "pendingIncubateeApproval";
    const incubateeWaitingOnIncubator =
      initiative.incubator?.connectedAccount == "incubateeRequested";
    if (incubateeWaitingOnIncubator) {
      return {
        props: {
          needsAction: {
            fromIncubator: {
              action: "acceptRequest",
              forInitiative: initiative.path!,
            },
          },
        },
      };
    }
    const connectedAccount = initiative.connectedAccount;
    if (connectedAccount && !accountIsOwnedByIncubator) {
      if (connectedAccount.status == "active") {
        const properlyConnectedAccountProps = {
          props: {
            properlyConnectedAccount: {
              url: `/members/${userId}/accounts/${connectedAccount.stripeAccountId}`,
              title: connectedAccount.title,
            },
          },
        };
        return properlyConnectedAccountProps;
      }
      // Return props to continue onboarding & to edit account title.
      return {
        props: {
          needsAction: {
            fromInitiative: {
              continueOnboarding: {
                title: connectedAccount.title,
                link: (
                  await createStripeAccountLink(
                    connectedAccount.stripeAccountId,
                    userId
                  )
                ).url,
              },
            },
          },
        },
      };
    }
    if (connectedAccount) {
      if (
        connectedAccount.status == "onboarding" &&
        !incubatorWaitingOnIncubatee
      ) {
        return {
          props: {
            needsAction: {
              fromIncubator: {
                action: "finishOnboarding",
                continueOnboarding: {
                  title: connectedAccount.title,
                },
                forInitiative: initiative.path!,
              },
            },
          },
        };
      }
      if (initiative.incubator?.connectedAccount == "allAccepted") {
        return {
          props: {
            properlyConnectedAccount: {
              url: `/members/${userId}/accounts/${connectedAccount.stripeAccountId}`,
              title: connectedAccount.title,
            },
          },
        };
      }
    }
    if (initiative.incubator?.connectedAccount == "incubateeRequested") {
      return {
        props: {
          needsAction: {
            fromIncubator: {
              forInitiative: initiative.path!,
              action: "acceptRequest",
            },
          },
        },
      };
    }

    const memberDoc = await firestore
      .doc(`members/${userId}`)
      .withConverter(Utils.memberConverter)
      .get();
    const accounts = memberDoc.data()?.stripe?.accounts;
    const possibleOwnAccounts = accounts
      ? await Object.keys(accounts).reduce(async (accPromise, key) => {
          const account = accounts[key];
          const acc = await accPromise;
          if (
            account.initiatives.length != 1 ||
            (await (async () => {
              const initiativeDoc = await firestore
                .doc(account.initiatives[0])
                .withConverter(Utils.initiativeConverter)
                .get();
              const initiative = initiativeDoc.data();
              return (
                !initiative?.incubator || !initiative.incubator.connectedAccount
              );
            })())
          ) {
            acc[key] = account;
          }
          return acc;
        }, Promise.resolve({} as typeof accounts))
      : undefined;

    return {
      props: {
        needsAction: {
          fromInitiative: {
            chooseAccounts: {
              possibleNewAccount: {
                possibleTitle: initiative.name,
                initiativePath: initiative.path!,
              },
              ...(possibleOwnAccounts ? { possibleOwnAccounts } : {}),
              ...(initiative.incubator
                ? {
                    possibleIncubatorRelationship: {
                      ...(incubatorWaitingOnIncubatee
                        ? {
                            requestingIncubatorAccountInfo: {
                              owningMemberPath:
                                initiative.incubator.path.split(
                                  "/initiatives/"
                                )[0],
                              accountNumber:
                                initiative.connectedAccount?.stripeAccountId!,
                            },
                          }
                        : {}),
                    },
                  }
                : {}),
            },
          },
        },
      },
    };
  }
);

type AccountProps =
  | {
      properlyConnectedAccount?: { url: string; title: string };
      needsAction?: undefined;
    }
  | {
      properlyConnectedAccount?: undefined;
      needsAction?:
        | {
            fromIncubator?: undefined;
            fromInitiative?:
              | {
                  continueOnboarding?: undefined;
                  chooseAccounts?: {
                    possibleNewAccount: {
                      possibleTitle: string;
                      initiativePath: string;
                    };
                    possibleOwnAccounts?: Record<
                      string,
                      { title: string; initiatives: string[] }
                    >;
                    possibleIncubatorRelationship?: {
                      requestingIncubatorAccountInfo?: {
                        owningMemberPath: string;
                        accountNumber: string;
                      };
                    };
                  };
                }
              | {
                  chooseAccounts?: undefined;
                  continueOnboarding?: {
                    title: string;
                    link: string;
                  };
                };
          }
        | {
            fromInitiative?: undefined;
            fromIncubator?: {
              forInitiative: string;
            } & (
              | {
                  action: "acceptRequest";
                }
              | {
                  action: "finishOnboarding";
                  continueOnboarding: { title: string };
                }
            );
          };
    };

const StripeConnect = asOneWePage(
  ({ properlyConnectedAccount, needsAction }: AccountProps) => {
    console.log({ properlyConnectedAccount, needsAction });
    const appState = useAppState();
    const [selectedAccount, setSelectedAccount] = useState<null | string>(null);
    const [checkedNew, setCheckedNew] = useState(false);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedAccount((event.target as HTMLInputElement).value);
    };
    const [titleForNewAccount, setTitleForNewAccount] = useState(
      needsAction?.fromInitiative?.chooseAccounts?.possibleNewAccount
        ?.possibleTitle
    );
    const [loading, setLoading] = useState(false);
    const [redirecting, setRedirecting] = useState(false);
    const alertOrRedirectToOnboardingStripeAccount =
      useAlertOrRedirectToOnboardingStripeAccount();
    const router = useRouter();
    const initiativeConverter = useInitiativeConverter();
    const memberConverter = useMemberConverter();

    const createNewAccount = async () => {
      setLoading(true);
      if (
        needsAction?.fromInitiative?.chooseAccounts
          ?.possibleIncubatorRelationship?.requestingIncubatorAccountInfo
      ) {
        // Remove this relationship.
        const batch = writeBatch(appState.firestore);
        batch.update(
          doc(
            appState.firestore,
            needsAction.fromInitiative?.chooseAccounts?.possibleNewAccount
              .initiativePath!
          ).withConverter(initiativeConverter),
          {
            "incubator.connectedAccount": deleteField(),
          }
        );
        batch.set(
          doc(
            appState.firestore,
            needsAction.fromInitiative?.chooseAccounts
              ?.possibleIncubatorRelationship?.requestingIncubatorAccountInfo
              .owningMemberPath
          ).withConverter(memberConverter),
          {
            stripe: {
              accounts: {
                [needsAction.fromInitiative?.chooseAccounts
                  ?.possibleIncubatorRelationship
                  ?.requestingIncubatorAccountInfo.accountNumber]: {
                  initiatives: [],
                },
              },
            },
          },
          { merge: true }
        );
        await batch.commit();
      }
      if (!titleForNewAccount) {
        throw new Error(
          `Error in creating a new account. Missing data: ${{
            titleForNewAccount,
          }}`
        );
      }
      await alertOrRedirectToOnboardingStripeAccount(
        titleForNewAccount,
        needsAction?.fromInitiative?.chooseAccounts?.possibleNewAccount
          ?.initiativePath!
      );
      setRedirecting(true);
      setLoading(false);
    };

    const connectAccount = () => {
      alert("Connect account not implemented at the moment");
    };

    const options: { value: string; label: string }[] = needsAction
      ?.fromInitiative?.chooseAccounts?.possibleOwnAccounts
      ? Object.entries(
          needsAction?.fromInitiative?.chooseAccounts?.possibleOwnAccounts
        ).map(([account, value]) => ({
          value: account,
          label: value.title,
        }))
      : [];
    console.log({
      options,
      possibleOwnAccounts:
        needsAction?.fromInitiative?.chooseAccounts?.possibleOwnAccounts,
    });

    if (redirecting) {
      return (
        <Stack sx={{ alignItems: "center", m: 2 }}>
          <Typography variant="h2">
            Redirecting to our partner: Stripe.
          </Typography>
          <Typography variant="h3">Please wait...</Typography>
          <CircularProgress />
        </Stack>
      );
    }

    return (
      <Stack sx={{ alignItems: "center", m: 2 }}>
        {properlyConnectedAccount && (
          <Stack>
            <Typography variant="h2">
              Connected account: {properlyConnectedAccount.title}
            </Typography>
            <Button href={properlyConnectedAccount.url}>Visit account</Button>
            <Button href={"/401"}>Disconnect account</Button>
          </Stack>
        )}
        {needsAction?.fromInitiative?.continueOnboarding && (
          <Stack>
            <Typography variant="h2">
              Continue onboarding:{" "}
              {needsAction?.fromInitiative?.continueOnboarding.title}
            </Typography>
            <Button href={needsAction?.fromInitiative?.continueOnboarding.link}>
              Finish onboarding
            </Button>
          </Stack>
        )}
        {needsAction?.fromIncubator?.action && (
          <Stack>
            {needsAction?.fromIncubator?.action == "finishOnboarding" && (
              <Typography variant="h2">
                Incubator still has to finish onboarding:{" "}
                {needsAction?.fromIncubator?.continueOnboarding.title}
              </Typography>
            )}
            {needsAction?.fromIncubator?.action == "acceptRequest" && (
              <Typography variant="h2">
                Waiting for your incubator to connect an account.
              </Typography>
            )}
            <Button href={`/${needsAction?.fromIncubator?.forInitiative}`}>
              Go back to your initiative page
            </Button>
          </Stack>
        )}
        {needsAction?.fromInitiative?.chooseAccounts && (
          <Stack>
            <Typography variant="h2">Connect to an account</Typography>
            <FormControl>
              <RadioGroup value={selectedAccount} onChange={handleChange}>
                {needsAction?.fromInitiative?.chooseAccounts
                  .possibleIncubatorRelationship &&
                  !needsAction?.fromInitiative?.chooseAccounts
                    .possibleIncubatorRelationship
                    .requestingIncubatorAccountInfo && (
                    <FormControlLabel
                      value={"askIncubator"}
                      control={<Radio />}
                      label={
                        "You as an incubatee can ask your incubator for an account."
                      }
                    />
                  )}
                {needsAction?.fromInitiative?.chooseAccounts
                  ?.possibleIncubatorRelationship
                  ?.requestingIncubatorAccountInfo && (
                  <FormControlLabel
                    value={"acceptIncubator"}
                    control={<Radio />}
                    label={
                      "Your incubator has asked you to accept their connected account."
                    }
                  />
                )}
                <FormControlLabel
                  control={
                    <Radio
                      checked={checkedNew}
                      onClick={() => setCheckedNew(!checkedNew)}
                      value="new"
                      color="primary"
                      disabled={loading}
                    />
                  }
                  label={
                    checkedNew ? (
                      <TextField
                        disabled={!checkedNew || loading}
                        label="Please give a title for the new account"
                        value={titleForNewAccount}
                        onChange={(e) => setTitleForNewAccount(e.target.value)}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      />
                    ) : (
                      "New account"
                    )
                  }
                />
                {options.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button
                onClick={() => {
                  switch (selectedAccount) {
                    case "askIncubator":
                      setLoading(true);
                      updateDoc(
                        doc(
                          appState.firestore,
                          needsAction.fromInitiative?.chooseAccounts
                            ?.possibleNewAccount.initiativePath!
                        ).withConverter(initiativeConverter),
                        {
                          "incubator.connectedAccount": "incubateeRequested",
                        }
                      ).then(() => {
                        router.reload();
                      });
                      break;
                    case "acceptIncubator":
                      setLoading(true);
                      updateDoc(
                        doc(
                          appState.firestore,
                          needsAction.fromInitiative?.chooseAccounts
                            ?.possibleNewAccount.initiativePath!
                        ).withConverter(initiativeConverter),
                        {
                          "incubator.connectedAccount": "allAccepted",
                        }
                      ).then(() => {
                        router.reload();
                      });
                      router.reload();
                      break;
                    case "new":
                      createNewAccount();
                      break;
                    case null:
                      alert("Please select an account to connect to.");
                      break;
                    default:
                      connectAccount();
                      break;
                  }
                }}
              >
                {checkedNew ? "Create and connect account" : "Connect account"}
              </Button>
            )}
          </Stack>
        )}
      </Stack>
    );
  }
);

export default StripeConnect;
