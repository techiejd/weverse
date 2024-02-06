import { WithTranslationsServerSideProps } from "../../../../../common/utils/translations";
import { ParsedUrlQuery } from "querystring";
import { getAuthentication } from "../../../../../common/utils/firebaseAdmin";
import { createStripeAccountLink } from "../../../../../common/context/serverUtils";
import { asOneWePage } from "../../../../../common/components/onewePage";
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

    return {
      props: {
        continueOnboardingLink: await createStripeAccountLink(account, userId),
      },
    };
  }
);

const RefreshPage = asOneWePage(
  ({ continueOnboardingLink }: { continueOnboardingLink: string }) => {
    return (
      <div>
        <p>
          You are seeing this page because you either refreshed or revisited the
          onboarding page, or took too long while doing the onboarding process
        </p>
        <Button href={continueOnboardingLink} variant="contained">
          Continue Onboarding
        </Button>
      </div>
    );
  }
);

export default RefreshPage;
