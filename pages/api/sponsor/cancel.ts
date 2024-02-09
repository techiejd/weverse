import type { NextApiRequest, NextApiResponse } from "next";
import { FieldValue } from "firebase-admin/firestore";
import Utils, { stripe } from "../../../common/context/serverUtils";

import { getAdminFirestore } from "../../../common/utils/firebaseAdmin";
import { pathAndType2FromCollectionId } from "../../../common/context/weverseUtils";

const firestore = getAdminFirestore();

const Cancel = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }
  const body = JSON.parse(req.body);

  const { stripeSubscription, stripeSubscriptionItem, initiative, member } =
    body;

  const initiativeSponsorshipDoc = (async () => {
    const initiativeSponsorshipCollection = await firestore
      .collection(`${initiative}/sponsorships`)
      .where("member", "==", member)
      .get();
    if (initiativeSponsorshipCollection.empty) {
      throw new Error("No sponsorship found");
    }
    if (initiativeSponsorshipCollection.size > 1) {
      throw new Error("Multiple sponsorships found");
    }
    return initiativeSponsorshipCollection.docs[0].ref;
  })();
  const memberSponsorshipDoc = (() => {
    const fromCollectionId = pathAndType2FromCollectionId(
      initiative,
      "sponsorship"
    );
    return firestore
      .doc(`${member}/from/${fromCollectionId}`)
      .withConverter(Utils.fromConverter);
  })();
  const memberDoc = firestore
    .doc(`${member}`)
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
      // All subscription items but this one have been deleted and
      // thus it is necessary to delete the subscription in order
      // to delete the subscription item.
      await stripe.subscriptions.cancel(stripeSubscription);
      batch.update(memberDoc, {
        // TODO(techiejd): This might be a problem if the user has multiple sponsorships.
        "stripe.subscription": FieldValue.delete(),
        "stripe.billingCycleAnchor": FieldValue.delete(),
        "stripe.status": "canceled",
      });
    });

  batch.delete(await initiativeSponsorshipDoc);
  batch.delete(memberSponsorshipDoc);
  await batch.commit();

  res.status(200);
};

export default Cancel;
