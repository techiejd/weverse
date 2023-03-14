import { GetServerSidePropsContext } from 'next';
import { init } from 'next-firebase-auth';
import { ParsedUrlQuery } from 'querystring';
import { logger } from './logger';
import { creds } from './firebase';

const initAuth = () => {
  init({
    authPageURL: ({ctx}: {
      ctx: GetServerSidePropsContext<ParsedUrlQuery>
    }) => {
      return ctx.resolvedUrl ? `/v1/auth?destination=${ctx.resolvedUrl}` : `/v1/auth`;
    },
    appPageURL: "/",
    loginAPIEndpoint: '/api/auth/logIn',
    logoutAPIEndpoint: '/api/auth/logOut',
    onLoginRequestError: (err) => {
      logger.error(`onLoginRequestError: ${err}`)
    },
    onLogoutRequestError: (err) => {
      logger.error(`onLogoutRequestError: ${err}`)
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
      logger.error(`onVerifyTokenError: ${err}`);
    },
    onTokenRefreshError: (err) => {
      logger.error(`onTokenRefreshError: ${err}`)
    },
  })
}

export default initAuth