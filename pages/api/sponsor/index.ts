import type { NextApiRequest, NextApiResponse } from "next";
import {
  SponsorshipLevel,
  sponsorship,
  sponsorshipLevel,
} from "../../../functions/shared/src";
import Stripe from "stripe";
import { z } from "zod";
import { pathAndType2FromCollectionId } from "../../../common/context/weverseUtils";
import { splitPath } from "../../../common/utils/firebase";
import Utils, { badRequest, stripe } from "../../../common/context/serverUtils";
import {
  getAdminFirestore,
  isDevEnvironment,
} from "../../../common/utils/firebaseAdmin";

const sponsorshipLevelsToPlanIds: Record<SponsorshipLevel, string> =
  isDevEnvironment
    ? {
        [sponsorshipLevel.Enum.admirer]: "prod_O76xw2wlNkijb1",
        [sponsorshipLevel.Enum.fan]: "prod_O7oOWYdMThvn5M",
        [sponsorshipLevel.Enum.lover]: "prod_O76xw2wlNkijb1",
        [sponsorshipLevel.Enum.custom]: "prod_O76xw2wlNkijb1",
      }
    : {
        [sponsorshipLevel.Enum.admirer]: "prod_O76kVZNQtlcRdx",
        [sponsorshipLevel.Enum.fan]: "prod_O76vBHvvBiDLi2",
        [sponsorshipLevel.Enum.lover]: "prod_O76wNilkqKlYsK",
        [sponsorshipLevel.Enum.custom]: "prod_O76x3IxBN4ROwm",
      };

const firestore = getAdminFirestore();

const Sponsor = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }
  const { step, sponsorState } = req.query;
  const body = JSON.parse(req.body);

  if (step == undefined) {
    badRequest(res);
  }

  const partialSponsorship = sponsorship.partial();

  const {
    member,
    initiative,
    total,
    sponsorshipLevel,
    customAmount,
    tipAmount,
    denyFee,
    memberPublishable,
    prevSponsorshipPrice,
    currency,
    firstName,
    lastName,
    email,
    phone,
    postalCode,
    countryCode,
    country,
    sponsorshipPrice: sponsorshipPriceIn,
    subscription: subscriptionIn,
    customer: customerIn,
  } = body;

  const initiativeSponsorshipDoc = firestore
    .doc(`${initiative}/sponsorships/${splitPath(member).id}`)
    .withConverter(Utils.sponsorshipConverter);
  const memberFromSponsorshipDoc = firestore
    .doc(
      `${member}/from/${pathAndType2FromCollectionId(
        initiative,
        "sponsorship"
      )}`
    )
    .withConverter(Utils.fromConverter);
  const mirroredSponsorshipUpdate = (
    data: z.infer<typeof partialSponsorship>
  ) => {
    const batch = firestore.batch();
    batch.update(initiativeSponsorshipDoc, data);
    // TODO(techiejd): Refactor update vs set + merge logic into some other function
    batch.set(
      memberFromSponsorshipDoc,
      { type: "sponsorship", data },
      { merge: true }
    );
    return batch.commit();
  };

  const setUpSubscriptionPrice = async (res: NextApiResponse) => {
    const sponsorshipPlanId =
      sponsorshipLevelsToPlanIds[sponsorshipLevel as SponsorshipLevel];
    const totalNoDecimal = Number(total) * 100;

    const archiveLastSponsorshipPricePromise = !prevSponsorshipPrice
      ? Promise.resolve()
      : stripe.prices.update(prevSponsorshipPrice, {
          active: false,
        });

    const sponsorshipPrice = await stripe.prices.create({
      metadata: {
        initiative,
        member,
        tipAmount,
        denyFee,
      },
      unit_amount: totalNoDecimal,
      currency: currency,
      recurring: { interval: "month" },
      product: sponsorshipPlanId,
    });

    const batch = firestore.batch();
    const sponsorshipData = {
      stripeSubscriptionItem: "incomplete",
      stripePrice: sponsorshipPrice.id,
      total: Number(total),
      sponsorshipLevel,
      customAmount: Number(customAmount),
      tipAmount: Number(tipAmount),
      denyFee: !!denyFee,
      //TODO(techiejd): Flesh out publishing name support.
      memberPublishable: !!memberPublishable,
      initiative,
      member,
      currency,
    };
    batch.set(initiativeSponsorshipDoc, sponsorshipData);
    batch.set(memberFromSponsorshipDoc, {
      type: "sponsorship",
      data: sponsorshipData,
    });

    await Promise.all([archiveLastSponsorshipPricePromise, batch.commit()]);

    res.status(200).json({ sponsorshipPrice: sponsorshipPrice.id });
  };

  const initializeSponsorship = async (res: NextApiResponse) => {
    switch (step) {
      case "chooseSponsorship":
        await setUpSubscriptionPrice(res);
        break;
      case "customerDetails":
        const stripeCustomer = {
          name: `${firstName} ${lastName}`,
          email,
          phone,
          address: {
            postal_code: postalCode,
            country: countryCode,
          },
        };
        const oneWeCustomer = {
          firstName,
          lastName,
          email,
          phone,
          address: {
            postalCode,
            country,
            countryCode,
          },
          currency,
        };
        let customerPromise: Promise<Stripe.Customer>;
        const isAnUpdate = customerIn && subscriptionIn;

        if (isAnUpdate) {
          const ditch = (subscription: any) => {
            /** do nothing since it's initialized as default_incomplete. */
          };
          ditch(subscriptionIn);
          customerPromise = stripe.customers.update(customerIn, stripeCustomer);
        } else {
          customerPromise = stripe.customers.create(stripeCustomer);
        }
        const subscriptionPromise = customerPromise.then((customer) => {
          return stripe.subscriptions.create({
            metadata: {
              member,
              initiative,
              tipAmount,
              denyFee,
            },
            customer: customer.id,
            items: [
              {
                price: sponsorshipPriceIn,
                metadata: { initiative, member, tipAmount, denyFee },
              },
            ], // you can't update a default_incomplete subscription's price, so we choose to assume the price is stale and, thusly, to create a new subscription.
            payment_behavior: "default_incomplete", // since it's default incomplete, we can just ditch it.
            payment_settings: {
              save_default_payment_method: "on_subscription",
            },
            expand: ["latest_invoice.payment_intent"],
          });
        });
        const firestorePromise = subscriptionPromise.then((subscription) =>
          firestore
            .doc(`${member}`)
            .withConverter(Utils.memberConverter)
            .update({
              customer: oneWeCustomer,
              stripe: {
                customer: subscription.customer as string,
                subscription: subscription.id,
                status: "incomplete",
                billingCycleAnchor: new Date(
                  subscription.billing_cycle_anchor * 1000
                ),
              },
            })
        );
        const updateSubscriptionItemPromise = subscriptionPromise.then(
          (subscription) => {
            const subscriptionItem = subscription.items.data[0];
            return mirroredSponsorshipUpdate({
              stripeSubscriptionItem: subscriptionItem.id,
            });
          }
        );
        const [customer, subscription] = await Promise.all([
          customerPromise,
          subscriptionPromise,
          firestorePromise,
          updateSubscriptionItemPromise,
        ]);
        res.status(200).json({
          customer: customer.id,
          subscription: subscription.id,
          clientSecret: (
            (subscription.latest_invoice as Stripe.Invoice)
              .payment_intent as Stripe.PaymentIntent
          ).client_secret,
        });
        break;
      default:
        badRequest(res);
    }
  };

  const updateSponsorship = async (res: NextApiResponse) => {
    switch (step) {
      case "chooseSponsorship":
        await setUpSubscriptionPrice(res);
        break;
      case "confirm":
        const subscriptionItem = await stripe.subscriptionItems.create({
          metadata: {
            initiative,
            member,
          },
          subscription: subscriptionIn,
          price: sponsorshipPriceIn,
        });

        await mirroredSponsorshipUpdate({
          stripeSubscriptionItem: subscriptionItem.id,
          paymentsStarted: new Date(subscriptionItem.created * 1000),
        });

        res.status(200).json({});
        break;
      default:
        badRequest(res);
    }
  };

  switch (sponsorState) {
    case "initialize":
      await initializeSponsorship(res);
      break;
    case "repeat":
      await updateSponsorship(res);
      break;
    default:
      badRequest(res);
  }
};

export default Sponsor;
