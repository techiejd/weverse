import { GetServerSidePropsContext } from 'next';
import { init } from 'next-firebase-auth';
import { ParsedUrlQuery } from 'querystring';
import { creds } from '.';

const initAuth = () => {
  init({
    authPageURL: ({ctx}: {
      ctx: GetServerSidePropsContext<ParsedUrlQuery>
    }) => {
      return ctx.resolvedUrl ? `/v1/auth?destination=${ctx.resolvedUrl}` : `/v1/auth`;
    },
    appPageURL: "/v1/weRace/vote",
    loginAPIEndpoint: '/api/logIn',
    logoutAPIEndpoint: '/api/logout',
    onLoginRequestError: (err) => {
      console.error("onLoginRequestError:", err)
    },
    onLogoutRequestError: (err) => {
      console.error("onLogoutRequestError:", err)
    },
    // Use application default credentials (takes precedence over firebaseAdminInitConfig if set)
    useFirebaseAdminDefaultCredential: true,
    firebaseClientInitConfig: creds,
    cookies: {
      name: 'WeVerse', // required
      // Keys are required unless you set `signed` to `false`.
      // The keys cannot be accessible on the client side.
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: '/',
      sameSite: 'strict',
      secure: true, // set this to false in local (non-HTTPS) development
      signed: true,
    },
    onVerifyTokenError: (err) => {
      console.error("onVerifyTokenError: ", err);
    },
    onTokenRefreshError: (err) => {
      console.error("onTokenRefreshError: ", err)
    },
  })
}

export default initAuth