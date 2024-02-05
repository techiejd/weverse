import { serialize } from "cookie";
import {
  cookieOptions,
  getAdminAuth,
  sessionExpiresIn,
} from "../../../common/utils/firebaseAdmin";
import { NextApiRequest, NextApiResponse } from "next";

export default async function logIn(req: NextApiRequest, res: NextApiResponse) {
  const auth = getAdminAuth();

  if (req.method === "POST") {
    var idToken = req.body.token;

    const cookie = await auth.verifyIdToken(idToken).then((decodedIdToken) => {
      // Only process if the user just signed in in the last 5 minutes.
      if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
        // Create session cookie and set it.
        return auth.createSessionCookie(idToken, {
          expiresIn: sessionExpiresIn,
        });
      }
      // A user that was not recently signed in is trying to set a session cookie.
      // To guard against ID token theft, require re-authentication.
      res.status(401).send("Recent sign in required!");
    });

    if (cookie) {
      res.setHeader("Set-Cookie", serialize("user", cookie, cookieOptions));
      res.status(200).end(JSON.stringify({ response: "Succesfull logged in" }));
    } else {
      res.status(401).send("Invalid authentication");
    }
  }
}
