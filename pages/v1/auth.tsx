/*import { Box } from "@mui/material";
import { PhoneAuthProvider } from "firebase/auth";
import { auth } from "firebaseui";
import { useAuthUser, withAuthUserTokenSSR } from "next-firebase-auth";
import { app } from "../../common/context/firebase";
import StyledFirebaseAuth from "../../common/context/firebase/StyledFirebaseAuth";

const uiConfig: auth.Config = {
  signInOptions: [PhoneAuthProvider.PROVIDER_ID],
  signInFlow: "popup",
  signInSuccessUrl: "/",
  credentialHelper: "none",
  callbacks: {
    // https://github.com/firebase/firebaseui-web#signinsuccesswithauthresultauthresult-redirecturl
    signInSuccessWithAuthResult: () =>
      // Don't automatically redirect. We handle redirects using
      // `next-firebase-auth`.
      false,
  },
};

const Auth = () => {
  return (
    <Box>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={app.auth()} />
    </Box>
  );
};

export const getServerSideProps = withAuthUserTokenSSR()(
  async ({ AuthUser, ...props }) => {
    const token = await AuthUser.getIdToken();
    console.log(token);
    console.log(AuthUser);
    return {
      props: {},
    };
  }
);

export default Auth;
*/

import React, { useEffect, useState } from "react";
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from "next-firebase-auth";
import { PhoneAuthProvider } from "firebase/auth";
import firebase from "firebase/compat/app";
import StyledFirebaseAuth from "../../common/context/firebase/StyledFirebaseAuth";

const firebaseAuthConfig = {
  signInFlow: "popup",
  // Auth providers
  // https://github.com/firebase/firebaseui-web#configure-oauth-providers
  signInOptions: [
    {
      provider: PhoneAuthProvider.PROVIDER_ID,
      requireDisplayName: true,
    },
  ],
  signInSuccessUrl: "/",
  credentialHelper: "none",
  callbacks: {
    // https://github.com/firebase/firebaseui-web#signinsuccesswithauthresultauthresult-redirecturl
    signInSuccessWithAuthResult: () =>
      // Don't automatically redirect. We handle redirects using
      // `next-firebase-auth`.
      false,
  },
};

const FirebaseAuth = () => {
  // Do not SSR FirebaseUI, because it is not supported.
  // https://github.com/firebase/firebaseui-web/issues/213
  const [renderAuth, setRenderAuth] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setRenderAuth(true);
    }
  }, []);
  return (
    <div>
      {renderAuth ? (
        <StyledFirebaseAuth
          uiConfig={firebaseAuthConfig}
          firebaseAuth={firebase.auth()}
        />
      ) : null}
    </div>
  );
};

const styles = {
  content: {
    padding: `8px 32px`,
  },
  textContainer: {
    display: "flex",
    justifyContent: "center",
    margin: 16,
  },
};

const Auth = () => {
  return (
    <div style={styles.content}>
      <h3>Sign in</h3>
      <div style={styles.textContainer}>
        <p>
          This auth page is <b>not</b> static. It will server-side redirect to
          the app if the user is already authenticated.
        </p>
      </div>
      <div>
        <FirebaseAuth />
      </div>
    </div>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})();

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Auth);
