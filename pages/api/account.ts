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
} from "../../common/utils/firebaseAdmin";
import { Accounts } from "../../functions/shared/src";
import { deleteField } from "firebase/firestore";

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
    const { title, initiativePath, incubator } = req.body;
    if (!title || !initiativePath) {
      return badRequest(res, 400, "Missing required fields");
    }

    // Get Firestore instance
    const firestore = getAdminFirestore();

    // Check if user is authorized
    const unauthorized = await (async () => {
      if (initiativePath.includes(user.uid)) return false;
      if (incubator) {
        if (!incubator.includes(user.uid)) return true;
        const initiativeDoc = await firestore
          .doc(initiativePath)
          .withConverter(Utils.initiativeConverter)
          .get();
        const initiative = initiativeDoc.data();
        if (initiative?.incubator?.path == incubator) return false;
      }
      return true;
    })();
    if (unauthorized) {
      return badRequest(res, 403, "Unauthorized");
    }

    // Create Stripe account
    const stripeAccount = await stripe.accounts.create({
      type: "express",
    });

    // Create Stripe account link
    const stripeAccountLinkPromise = createStripeAccountLink(
      stripeAccount.id,
      user.uid
    );

    // Save account under the member
    const updateMemberAccountPromise = firestore.runTransaction(
      async (transaction) => {
        return transaction
          .get(firestore.doc(memberPath).withConverter(Utils.memberConverter))
          .then((doc) => {
            if (!doc.exists) {
              throw new Error("Document does not exist");
            }

            // We're using transaction so member data doesn't change under us.
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

    // Save account under initiative
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

    // Save update incubator under initiative's account information.
    const updateIncubatorPromise = firestore.runTransaction(
      async (transaction) => {
        if (!incubator) return Promise.resolve();
        const initiativeDoc = await transaction.get(
          firestore.doc(initiativePath)
        );
        const initiative = initiativeDoc.data();
        if (!initiative)
          throw new Error(`Initiative ${initiativePath} does not exist`);
        return transaction.set(
          initiativeDoc.ref,
          {
            incubator: {
              connectedAccount:
                initiative.incubator.connectedAccount == "incubateeRequested"
                  ? "allAccepted"
                  : "pendingIncubateeApproval",
            },
          },
          { merge: true }
        );
      }
    );

    // Wait for all promises to resolve
    const [stripeAccountLink] = await Promise.all([
      stripeAccountLinkPromise,
      updateMemberAccountPromise,
      updateInitiativeAccountPromise,
      updateIncubatorPromise,
    ]);

    // Return the account link
    return res.status(200).json({ link: stripeAccountLink.url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
