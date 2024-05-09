import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";

export const isDevEnvironment =
  process && process.env.NODE_ENV === "development";

export const getAdminApp = () => {
  const ADMIN_APP_NAME = "firebase-onewe-admin-app";
  const adminApp =
    getApps().find((it) => it.name === ADMIN_APP_NAME) ||
    initializeApp(
      {
        credential: cert(
          JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT! as string)
        ),
      },
      ADMIN_APP_NAME
    );
  return adminApp;
};

export const getAdminAuth = () => {
  if (isDevEnvironment) {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
  }
  const adminApp = getAdminApp();
  return getAuth(adminApp);
};

export const getAdminFirestore = () => {
  if (isDevEnvironment) {
    process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
  }
  return getFirestore(getAdminApp());
};

export type AuthenticationProp = {
  authenticated: boolean;
  uid: string;
};

export async function verifyCookie(cookie: string) {
  const auth = getAdminAuth();

  var uid = "";
  var bAuth = false;
  await auth
    .verifyIdToken(cookie, true /** checkRevoked */)
    .then((decodedClaims) => {
      bAuth = true;
      uid = decodedClaims.uid;
    })
    .catch((error) => {
      console.error("Error verifying session cookie:", error);
      // Session cookie is unavailable or invalid. Force user to login.
      bAuth = false;
    });

  return {
    authenticated: bAuth,
    uid: uid,
  };
}

type ParseCookiesParameters = Parameters<typeof parseCookies>;

export async function getAuthentication(...args: ParseCookiesParameters) {
  const cookies = parseCookies(args[0]);
  return cookies.token
    ? await verifyCookie(cookies.token)
    : { authenticated: false, uid: "" };
}

export const sessionExpiresIn = 5 * 60 * 1000;
export const cookieOptions = {
  maxAge: sessionExpiresIn,
  httpOnly: true,
  secure: true,
  path: "/",
};
