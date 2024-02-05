import type { NextApiRequest, NextApiResponse } from "next";
import { DbBase, member, sponsorship } from "../../../functions/shared/src";
import Stripe from "stripe";
import {
  FirestoreDataConverter,
  WithFieldValue,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  FieldValue,
} from "firebase-admin/firestore";
import { z } from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

import { getAdminFirestore } from "../../../common/utils/firebaseAdmin";

const firestore = getAdminFirestore();

namespace Utils {
  //TODO(techiejd): This is a hack to get around sharing the same schema between nextjs and firebase functions.
  //TODO(techiejd): WET -> Dry
  const makeDataConverter = <T extends z.ZodType<DbBase>>(
    zAny: T
  ): FirestoreDataConverter<z.infer<typeof zAny>> => ({
    toFirestore: (data: WithFieldValue<z.infer<typeof zAny>>): DocumentData => {
      const { createdAt, ...others } = data;
      return { ...others, createdAt: createdAt ? createdAt : Timestamp.now() };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot): z.infer<typeof zAny> => {
      const data = snapshot.data();
      // anything with serverTimestamp does not exist atm if pending writes.
      return zAny.parse({
        ...data,
        path: snapshot.ref.path,
      });
    },
  });

  export const memberConverter = makeDataConverter(member);
  export const sponsorshipConverter = makeDataConverter(sponsorship);
}

const badRequest = (res: NextApiResponse) =>
  res.status(400).json({ message: "Bad Request" });

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
