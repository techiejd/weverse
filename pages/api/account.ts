import { NextApiRequest, NextApiResponse } from "next";
import Utils, {
  badRequest,
  createStripeAccountLink,
  publicBaseUrl,
  stripe,
} from "../../common/context/serverUtils";
import {
  getAdminFirestore,
  getAuthentication,
  isDevEnvironment,
} from "../../common/utils/firebaseAdmin";
import { Accounts } from "../../functions/shared/src";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("check 0");
    if (req.method !== "POST") {
      return badRequest(res, 405, "Method Not Allowed");
    }
    console.log("check 1");

    // Check call came from same origin
    const origin = req.headers.origin;
    console.log(`origin: ${origin}, publicBaseUrl: ${publicBaseUrl}`);
    console.log({
      isDevEnvironment,
      NEXT_PUBLIC_BASE_URL_DEV: process.env.NEXT_PUBLIC_BASE_URL_DEV!,
      NEXT_PUBLIC_BASE_URL_REAL: process.env.NEXT_PUBLIC_BASE_URL_REAL!,
    });
    if (origin !== publicBaseUrl) {
      return badRequest(res, 403, "Forbidden");
    }
    console.log("check 2");

    // Check if user is signed in
    const user = await getAuthentication({ req });

    if (!user.authenticated) {
      return badRequest(res, 401, "User not authenticated");
    }
    console.log("check 3");

    // Validate request body
    const { title, initiativePath } = req.body;
    console.log(`initiativePath: ${initiativePath}, user.uid: ${user.uid}`);
    console.log(`check 3.1: ${title}, ${initiativePath}`);
    if (!title || !initiativePath) {
      return badRequest(res, 400, "Missing required fields");
    }
    console.log("check 4");

    if (!initiativePath.includes(user.uid)) {
      return badRequest(res, 403, "Unauthorized");
    }
    console.log("check 5");

    // Get Firestore instance
    const firestore = getAdminFirestore();

    // Create Stripe account
    const stripeAccount = await stripe.accounts.create({
      type: "express",
    });
    console.log(`check 6: ${JSON.stringify(stripeAccount)}`);

    // Create Stripe account link
    const stripeAccountLinkPromise = createStripeAccountLink(
      stripeAccount.id,
      user.uid
    );

    // Save account under the member using Firestore
    const updateMemberAccountPromise = firestore.runTransaction(
      async (transaction) => {
        return transaction
          .get(
            firestore
              .doc(`members/${user.uid}`)
              .withConverter(Utils.memberConverter)
          )
          .then((doc) => {
            if (!doc.exists) {
              throw new Error("Document does not exist");
            }

            const member = doc.data();
            const accounts: Accounts = member?.stripe?.accounts
              ? member.stripe.accounts
              : {};
            accounts[stripeAccount.id] = {
              title,
              initiatives: [initiativePath],
              status: "onboarding",
            };
            return transaction.set(
              doc.ref,
              {
                stripe: {
                  accounts,
                },
              },
              { merge: true }
            );
          });
      }
    );

    // Wait for both promises to resolve
    const [stripeAccountLink, _] = await Promise.all([
      stripeAccountLinkPromise,
      updateMemberAccountPromise,
    ]);

    // Return the account link
    return res.status(200).json({ link: stripeAccountLink.url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
