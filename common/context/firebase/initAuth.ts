// ./initAuth.js
import { init } from 'next-firebase-auth';
import { creds } from '.';

const initAuth = () => {
  init({
    debug: true,
    authPageURL: '/v1/auth',
    appPageURL: '/',
    loginAPIEndpoint: '/api/logIn',
    logoutAPIEndpoint: '/api/logout',
    onLoginRequestError: (err) => {
      console.error(err)
    },
    onLogoutRequestError: (err) => {
      console.error(err)
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
      console.error(err)
    },
    onTokenRefreshError: (err) => {
      console.error(err)
    },
  })
}

export default initAuth