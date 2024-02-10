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
    if (req.method !== "POST") {
      return badRequest(res, 405, "Method Not Allowed");
    }

    // Check call came from same origin
    const origin = req.headers.origin;
    if (origin !== publicBaseUrl) {
      return badRequest(res, 403, "Forbidden");
    }

    // Check if user is signed in
    const user = await getAuthentication({ req });

    if (!user.authenticated) {
      return badRequest(res, 401, "User not authenticated");
    }
    const memberPath = `members/${user.uid}`;

    // Validate request body
    const { title, initiativePath } = req.body;
    if (!title || !initiativePath) {
      return badRequest(res, 400, "Missing required fields");
    }

    if (!initiativePath.includes(user.uid)) {
      return badRequest(res, 403, "Unauthorized");
    }

    // Get Firestore instance
    const firestore = getAdminFirestore();

    // Create Stripe account
    const stripeAccount = await stripe.accounts.create({
      type: "express",
    });

    // Create Stripe account link
    const stripeAccountLinkPromise = createStripeAccountLink(
      stripeAccount.id,
      user.uid
    );

    // Save account under the member using Firestore
    const updateMemberAccountPromise = firestore.runTransaction(
      async (transaction) => {
        return transaction
          .get(firestore.doc(memberPath).withConverter(Utils.memberConverter))
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

    // Save account under initiative using Firestore
    const updateInitiativeAccountPromise = firestore
      .doc(initiativePath)
      .update({
        connectedAccount: {
          ownerMemberPath: memberPath,
          stripeAccountId: stripeAccount.id,
          title,
          status: "onboarding",
        },
      });

    // Wait for both promises to resolve
    const [stripeAccountLink] = await Promise.all([
      stripeAccountLinkPromise,
      updateMemberAccountPromise,
      updateInitiativeAccountPromise,
    ]);

    // Return the account link
    return res.status(200).json({ link: stripeAccountLink.url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
