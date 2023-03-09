import React, { useEffect, useState } from "react";
import {
  withAuthUser,
  withAuthUserTokenSSR,
  useAuthUser,
} from "next-firebase-auth";
import { PhoneAuthProvider } from "firebase/auth";
import firebase from "firebase/compat/app";
import StyledFirebaseAuth from "../../common/context/firebase/StyledFirebaseAuth";
import { useRouter } from "next/router";
import { z } from "zod";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

const firebaseAuthConfig = {
  // Auth providers
  // https://github.com/firebase/firebaseui-web#configure-oauth-providers
  signInOptions: [PhoneAuthProvider.PROVIDER_ID],
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

const authQuery = z.object({
  destination: z.string().optional(),
});

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

const SignIn = () => {
  return (
    <div style={styles.content}>
      <h3>Sign in</h3>
      <div style={styles.textContainer}>
        <p></p>
      </div>
      <div>
        <FirebaseAuth />
      </div>
    </div>
  );
};

const GoOn = () => {
  return (
    <Box>
      <Typography>You're logged in.</Typography>
      <Link href="/">
        <Typography
          sx={{
            mr: 1,
            color: "secondary.main",
          }}
        >
          Go Home
        </Typography>
      </Link>
    </Box>
  );
};

const Auth = () => {
  const authUser = useAuthUser();
  const router = useRouter();
  useEffect(() => {
    const destination = authQuery.parse(router.query).destination;
    if (authUser.id != null && destination) {
      router.push(destination);
    }
  }, [authUser, router]);

  return <Box>{authUser.id ? <GoOn /> : <SignIn />}</Box>;
};

export const getServerSideProps = withAuthUserTokenSSR({})();

export default withAuthUser()(Auth);
