import type { NextApiRequest, NextApiResponse } from "next";
import { FieldValue } from "firebase-admin/firestore";
import Utils, { stripe } from "../../../common/context/serverUtils";

import { getAdminFirestore } from "../../../common/utils/firebaseAdmin";

const firestore = getAdminFirestore();

const Cancel = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }
  const body = JSON.parse(req.body);

  const { stripeSubscription, stripeSubscriptionItem, initiative, member } =
    body;

  const initiativeSponsorshipDoc = firestore
    .doc(`initiatives/${initiative}/sponsorships/${member}`)
    .withConverter(Utils.sponsorshipConverter);
  const memberSponsorshipDoc = firestore
    .doc(`members/${member}/sponsorships/${initiative}`)
    .withConverter(Utils.sponsorshipConverter);
  const memberDoc = firestore
    .doc(`members/${member}`)
    .withConverter(Utils.memberConverter);

  const batch = firestore.batch();
  await stripe.subscriptionItems
    .del(stripeSubscriptionItem)
    .catch(async (err) => {
      if (
        !err.message.includes(
          "A subscription must have at least one active plan. To cancel a subscription, please use the cancel API endpoint on /v1/subscriptions."
        )
      ) {
        throw new Error(err);
      }
      await stripe.subscriptions.cancel(stripeSubscription);
      batch.update(memberDoc, {
        "stripe.subscription": FieldValue.delete(),
        "stripe.billingCycleAnchor": FieldValue.delete(),
        "stripe.status": "canceled",
      });
    });

  batch.delete(initiativeSponsorshipDoc);
  batch.delete(memberSponsorshipDoc);
  await batch.commit();

  res.status(200);
};

export default Cancel;
