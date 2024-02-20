import { WithTranslationsServerSideProps } from "../../../../../common/utils/translations";
import { ParsedUrlQuery } from "querystring";
import {
  getAdminFirestore,
  getAuthentication,
} from "../../../../../common/utils/firebaseAdmin";
import Utils, { stripe } from "../../../../../common/context/serverUtils";
import { asOneWePage } from "../../../../../common/components/onewePage";
import { Button, Stack, Typography } from "@mui/material";

interface Slugs extends ParsedUrlQuery {
  userId?: string;
  account?: string;
}

export const getServerSideProps = WithTranslationsServerSideProps(
  async (ctx) => {
    const { userId, account } = ctx.params as Slugs;
    const authentication = await getAuthentication(ctx);
    if (!userId || !account) {
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

    const firestore = getAdminFirestore();
    const accountPromise = firestore
      .doc(`members/${userId}`)
      .withConverter(Utils.memberConverter)
      .get()
      .then((doc) => {
        const member = doc.data();
        return member!.stripe!.accounts![account]!;
      });

    let isIncubateeTryingToSeeTheirAccount = false;
    if (userId !== authentication.uid) {
      isIncubateeTryingToSeeTheirAccount = await accountPromise.then((a) =>
        a.initiatives[0].includes(authentication.uid)
      );
      if (!isIncubateeTryingToSeeTheirAccount) {
        return {
          redirect: {
            destination: `/401`, // TODO: redirect to the current page after login
            permanent: false,
          },
        };
      }
    }

    const accessStripeAccountLinkPromise = stripe.accounts
      .createLoginLink(account)
      .then((link) => link.url);

    const stripeBalancesPromise = await stripe.balance
      .retrieve({
        stripeAccount: account,
      })
      .then((balanceResponse) => {
        const balances = balanceResponse.available.reduce(
          (prevValue, currValue) => {
            prevValue[currValue.currency] = {
              available: currValue.amount,
            };
            return prevValue;
          },
          {} as Record<string, { available?: number; pending?: number }>
        );
        balanceResponse.pending.forEach((pending) => {
          balances[pending.currency].pending = pending.amount;
        });
        return Array.from(Object.entries(balances)).map(
          ([currency, balance]) => ({
            currency,
            ...balance,
          })
        );
      });

    const titlePromise = accountPromise.then((a) => a.title);

    const [accessStripeAccountLink, balances, title] = await Promise.all([
      accessStripeAccountLinkPromise,
      stripeBalancesPromise,
      titlePromise,
    ]);

    return {
      props: {
        ...(isIncubateeTryingToSeeTheirAccount
          ? {}
          : { accessStripeAccountLink }),
        balances,
        title,
      },
    };
  }
);

const ReturnPage = asOneWePage(
  ({
    balances,
    accessStripeAccountLink,
    title,
  }: {
    balances: {
      currency: string;
      available?: number;
      pending?: number;
    }[];
    accessStripeAccountLink?: string;
    title: string;
  }) => {
    return (
      <Stack sx={{ m: 2 }} spacing={2}>
        <Typography variant="h1">Account: {title}</Typography>
        <Typography variant="h2">Balances</Typography>
        {balances.map((balance) => (
          <Typography key={balance.currency}>
            {balance.currency}: Available: {balance.available}, Pending:{" "}
            {balance.pending}
          </Typography>
        ))}
        {accessStripeAccountLink && (
          <Button
            href={accessStripeAccountLink}
            variant="contained"
            sx={{ width: "fit-content" }}
          >
            Access account from Stripe
          </Button>
        )}
        <Button
          onClick={() => {
            alert("Not yet implemented");
          }}
          variant="contained"
          sx={{ width: "fit-content" }}
        >
          Payout
        </Button>
      </Stack>
    );
  }
);

export default ReturnPage;
