import { WithTranslationsServerSideProps } from "../../../../../../common/utils/translations";
import { ParsedUrlQuery } from "querystring";
import {
  getAdminFirestore,
  getAuthentication,
} from "../../../../../../common/utils/firebaseAdmin";
import Utils, {
  createStripeAccountLink,
  stripe,
} from "../../../../../../common/context/serverUtils";
import { asOneWePage } from "../../../../../../common/components/onewePage";
import { Button } from "@mui/material";

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
    if (userId !== authentication.uid) {
      return {
        redirect: {
          destination: `/401`, // TODO: redirect to the current page after login
          permanent: false,
        },
      };
    }

    const stripeAccount = await stripe.accounts.retrieve(account);

    if (stripeAccount.details_submitted) {
      const firestore = getAdminFirestore();
      await firestore.runTransaction(async (transaction) => {
        const memberDocToBeUpdated = await transaction.get(
          firestore
            .doc(`members/${userId}`)
            .withConverter(Utils.memberConverter)
        );
        const accountsData = memberDocToBeUpdated.data()!.stripe!.accounts!;
        accountsData[account].status = "active";
        transaction.update(
          memberDocToBeUpdated.ref,
          `stripe.accounts.${account}`,
          accountsData[account]
        );
        accountsData[account].initiatives.forEach((iPath) => {
          const initiativeDocRef = firestore
            .doc(iPath)
            .withConverter(Utils.initiativeConverter);
          transaction.set(
            initiativeDocRef,
            {
              connectedAccount: {
                status: "active",
              },
            },
            { merge: true }
          );
        });
      });
      return {
        props: {
          successOnboardingLink: `/members/${userId}/accounts/${account}`,
        },
      };
    }

    return {
      props: {
        continueOnboardingLink: (await createStripeAccountLink(account, userId))
          .url,
      },
    };
  }
);

const ReturnPage = asOneWePage(
  ({
    continueOnboardingLink,
    successOnboardingLink,
  }: {
    continueOnboardingLink?: string;
    successOnboardingLink?: string;
  }) => {
    return successOnboardingLink ? (
      <div>
        <p>You have successfully onboarded your account</p>
        <Button href={successOnboardingLink} variant="contained">
          Visit Account
        </Button>
      </div>
    ) : (
      <div>
        <p>
          You are seeing this because you have not yet finished the onboarding.
          Process. Please click this button to continue.
        </p>
        <Button href={continueOnboardingLink} variant="contained">
          Continue Onboarding
        </Button>
      </div>
    );
  }
);

export default ReturnPage;
