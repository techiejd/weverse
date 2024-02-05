import { parseCookies } from "nookies";
import { WithTranslationsServerSideProps } from "../../../../../common/utils/translations";
import { asOneWePage } from "../../../../../common/components/onewePage";
import { verifyCookie } from "../../../../../common/utils/firebaseAdmin";

export const getServerSideProps = WithTranslationsServerSideProps(
  async (ctx) => {
    const cookies = parseCookies(ctx);

    return {
      props: {
        authentication: cookies.user
          ? await verifyCookie(cookies.user)
          : { authenticated: false, uid: "" },
      },
    };
  }
);

const StripeConnect = asOneWePage((props) => {
  return <div>{JSON.stringify(props)}</div>;
});

export default StripeConnect;
