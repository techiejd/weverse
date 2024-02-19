import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
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
import { useRouter } from "next/router";

// Should be able to see the connected account to this initiative.
// Should be able to connect an account if not connected already.
// Should be able to disconnect an account if connected already.
// If the initiative is an incubator, it will see its incubatees' account.
// If the initative is an incubator, it should be able to create a new account for an incubatee.

interface Slugs extends ParsedUrlQuery {
  userId?: string;
  initiativeId?: string;
}

type ConnectedAccount = { url: string; title: string } | undefined;
type AccountProps = {
  connectedAccount?: ConnectedAccount;
  continueOnboarding?: {
    title: string;
    link: string;
  };
  possibleAccounts?: Record<string, { title: string; initiatives: string[] }>;
  possibleTitle: string;
  initiativePath: string;
};

export const getServerSideProps = WithTranslationsServerSideProps(
  async (ctx) => {
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
    const initiative = (
      await firestore
        .doc(`members/${userId}/initiatives/${initiativeId}`)
        .withConverter(Utils.initiativeConverter)
        .get()
    ).data();
    if (!initiative) {
      throw new Error(`Initiative not found: ${initiativeId}`);
    }
    const initiativeInfo = {
      possibleTitle: initiative.name,
      initiativePath: initiative.path,
    };
    if (initiative?.connectedAccount) {
      const connectedAccount = initiative.connectedAccount;
      if (connectedAccount.status == "onboarding") {
        // Return props to continue onboarding & to edit account title.
        return {
          props: {
            continueOnboarding: {
              title: initiative.connectedAccount.title,
              link: (
                await createStripeAccountLink(
                  connectedAccount.stripeAccountId,
                  userId
                )
              ).url,
            },
          },
        };
      }
      return {
        props: {
          ...initiativeInfo,
          connectedAccount: {
            url: `/members/${userId}/accounts/${connectedAccount.stripeAccountId}`,
            title: connectedAccount.title,
          },
        },
      };
    }
    const memberDoc = await firestore
      .doc(`members/${userId}`)
      .withConverter(Utils.memberConverter)
      .get();
    const accounts = memberDoc.data()?.stripe?.accounts;

    if (accounts) {
      return {
        props: {
          ...initiativeInfo,
          possibleAccounts: accounts,
        },
      };
    }

    return {
      props: initiativeInfo,
    };
  }
);

const StripeConnect = asOneWePage(
  ({
    connectedAccount,
    possibleAccounts,
    continueOnboarding,
    possibleTitle,
    initiativePath,
  }: AccountProps) => {
    const router = useRouter();
    const [selectedAccount, setSelectedAccount] = useState<null | string>(null);
    const [checkedNew, setCheckedNew] = useState(false);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedAccount((event.target as HTMLInputElement).value);
    };
    const [titleForNewAccount, setTitleForNewAccount] = useState(possibleTitle);
    console.log(titleForNewAccount);
    const [loading, setLoading] = useState(false);
    const [redirecting, setRedirecting] = useState(false);

    const createNewAccount = async () => {
      setLoading(true);
      if (!titleForNewAccount || !router.isReady) {
        throw new Error(
          `Error in creating a new account. Missing data: ${{
            titleForNewAccount,
            routerIsReady: router.isReady,
          }}`
        );
      }
      // Create a new account
      const newAccountResponse = await fetch("/api/account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: titleForNewAccount,
          initiativePath,
        }),
      });
      if (newAccountResponse.ok) {
        const newAccountLink = await newAccountResponse.json();
        router.push(newAccountLink.link);
        setRedirecting(true);
      } else {
        alert(
          `Error creating new account ${newAccountResponse.status}: ${newAccountResponse.statusText}`
        );
      }
      setLoading(false);
    };

    const connectAccount = () => {
      alert("Connect account not implemented at the moment");
    };

    const options: { value: string; label: string }[] = possibleAccounts
      ? Object.entries(possibleAccounts).map(([account, value]) => ({
          value: account,
          label: value.title,
        }))
      : [];

    return redirecting ? (
      <Stack sx={{ alignItems: "center", m: 2 }}>
        <Typography variant="h2">
          Redirecting to our partner: Stripe.
        </Typography>
        <Typography variant="h3">Please wait...</Typography>
        <CircularProgress />
      </Stack>
    ) : (
      <Stack sx={{ alignItems: "center", m: 2 }}>
        {connectedAccount && (
          <Stack>
            <Typography variant="h2">
              Connected account: {connectedAccount.title}
            </Typography>
            <Button href={connectedAccount.url}>Visit account</Button>
            <Button href={"/401"}>Disconnect account</Button>
          </Stack>
        )}
        {continueOnboarding && (
          <Stack>
            <Typography variant="h2">
              Continue onboarding: {continueOnboarding.title}
            </Typography>
            <Button href={continueOnboarding.link}>Finish onboarding</Button>
          </Stack>
        )}
        {!connectedAccount && !continueOnboarding && (
          <Stack>
            <Typography variant="h2">Connect to an account</Typography>
            <FormControl>
              <RadioGroup value={selectedAccount} onChange={handleChange}>
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
            {loading || !router.isReady ? (
              <CircularProgress />
            ) : (
              <Button
                onClick={() =>
                  checkedNew ? createNewAccount() : connectAccount()
                }
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
