import type { NextApiRequest, NextApiResponse } from 'next'
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { DbBase, SponsorshipLevel, member, sponsorship, sponsorshipLevel } from '../../../functions/shared/src';
import Stripe from "stripe";
import {FirestoreDataConverter, WithFieldValue,
  DocumentData,
  QueryDocumentSnapshot, Timestamp} from "firebase-admin/firestore";
import {z} from "zod";

const isDevEnvironment = process && process.env.NODE_ENV === "development";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

import { getFirestore } from 'firebase-admin/firestore';

const sponsorshipLevelsToPlanIds : Record<SponsorshipLevel, string> = isDevEnvironment ? {
  [sponsorshipLevel.Enum.admirer]: "prod_O76xw2wlNkijb1",
  [sponsorshipLevel.Enum.fan]: "prod_O7oOWYdMThvn5M",
  [sponsorshipLevel.Enum.lover]: "prod_O76xw2wlNkijb1",
  [sponsorshipLevel.Enum.custom]: "prod_O76xw2wlNkijb1",
} : {
  [sponsorshipLevel.Enum.admirer]: "prod_O76kVZNQtlcRdx",
  [sponsorshipLevel.Enum.fan]: "prod_O76vBHvvBiDLi2",
  [sponsorshipLevel.Enum.lover]: "prod_O76wNilkqKlYsK",
  [sponsorshipLevel.Enum.custom]: "prod_O76x3IxBN4ROwm",
};

const firestore = (() => {
  if (isDevEnvironment) {
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
  }
  if (!getApps().length) {
    const fs = getFirestore(initializeApp({credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!  as string))}));
    fs.settings({ignoreUndefinedProperties: true});
  return fs;
  }
  return getFirestore(getApps()[0]);
})();

namespace Utils {
  //TODO(techiejd): This is a hack to get around sharing the same schema between nextjs and firebase functions.
  const makeDataConverter =
  <T extends z.ZodType<DbBase>>(zAny: T) :
   FirestoreDataConverter<z.infer<typeof zAny>> => ({
      toFirestore: (data: WithFieldValue<z.infer<typeof zAny>>): DocumentData => {
        const {createdAt, ...others} = data;
        return {...others, createdAt: createdAt ? createdAt : Timestamp.now()};
      },
      fromFirestore: (snapshot: QueryDocumentSnapshot): z.infer<typeof zAny> => {
        const data = snapshot.data();
        // anything with serverTimestamp does not exist atm if pending writes.
        return zAny.parse({
          ...data,
          id: snapshot.id,
          createdAt: data.createdAt ? data.createdAt.toDate() : undefined,
        });
      },
    });

  export const memberConverter = makeDataConverter(member);
  export const sponsorshipConverter = makeDataConverter(sponsorship);
}

const badRequest = (res: NextApiResponse) => res.status(400).json({ message: 'Bad Request' });

const Sponsor = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  const { step, sponsorState } =  req.query;
  const body = JSON.parse(req.body);

  if (step == undefined) {
    badRequest(res);
  }

  const partialSponsorship = sponsorship.partial();

  const {member, maker,
    total, sponsorshipLevel, customAmount, tipAmount, denyFee, memberPublishable, prevSponsorshipPrice,
    firstName, lastName, email, phone, postalCode, countryCode, country, 
    sponsorshipPrice : sponsorshipPriceIn, subscription: subscriptionIn, customer: customerIn} = body;

  const makerSponsorshipDoc = firestore.doc(`makers/${maker}/sponsorships/${member}`).withConverter(Utils.sponsorshipConverter);
  const memberSponsorshipDoc = firestore.doc(`members/${member}/sponsorships/${maker}`).withConverter(Utils.sponsorshipConverter);
  const mirroredSponsorshipUpdate = (data: z.infer<typeof partialSponsorship>) => {
    const batch = firestore.batch();
    batch.update(makerSponsorshipDoc, data);
    batch.update(memberSponsorshipDoc, data);
    return batch.commit();
  }
  
  const setUpSubscriptionPrice = async (res: NextApiResponse) => {
    const sponsorshipPlanId = sponsorshipLevelsToPlanIds[sponsorshipLevel as SponsorshipLevel];
    const totalNoDecimal = parseInt(total) * 100;

    const archiveLastSponsorshipPricePromise = !prevSponsorshipPrice ? Promise.resolve() : stripe.prices.update(prevSponsorshipPrice, {
      active: false,});

    const sponsorshipPrice = await stripe.prices.create({
      metadata: {
        maker,
        member,
      },
      unit_amount: totalNoDecimal,
      currency: 'cop',
      recurring: {interval: 'month'},
      product: sponsorshipPlanId,
    });

    const batch = firestore.batch();
    const sponsorshipData = {
      stripeSubscriptionItem: "incomplete",
      stripePrice: sponsorshipPrice.id,
      total: parseInt(total),
      sponsorshipLevel,
      customAmount: parseInt(customAmount),
      tipAmount: parseInt(tipAmount),
      denyFee: !!denyFee,
      //TODO(techiejd): Flesh out publishing name support.
      memberPublishable: !!memberPublishable,
      maker,
      member,
    }
    batch.set(makerSponsorshipDoc, sponsorshipData);
    batch.set(memberSponsorshipDoc, sponsorshipData);

    await Promise.all([archiveLastSponsorshipPricePromise, batch.commit()]);
    
    res.status(200).json({ sponsorshipPrice: sponsorshipPrice.id });
  }
  
  const initializeSponsorship = async (res: NextApiResponse) => {
    switch(step) {
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
        };
        let customerPromise : Promise<Stripe.Customer>;
        const isAnUpdate = customerIn && subscriptionIn;

        if (isAnUpdate) {
          const ditch = (subscription: any) => {/** do nothing since it's initialized as default_incomplete. */};
          ditch(subscriptionIn);
          customerPromise = stripe.customers.update(customerIn, stripeCustomer);
          
        } else {
          customerPromise = stripe.customers.create(stripeCustomer);
        }
        const subscriptionPromise = customerPromise.then((customer) => {
          return stripe.subscriptions.create({
            metadata: {
              member,
            },
            customer: customer.id,
            items: [{price: sponsorshipPriceIn, metadata: {maker, member}}], // you can't update a default_incomplete subscription's price, so we choose to assume the price is stale and, thusly, to create a new subscription.
            payment_behavior: 'default_incomplete', // since it's default incomplete, we can just ditch it.
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
          });
        });
        const firestorePromise = subscriptionPromise.then(subscription =>  firestore.doc(`members/${member}`).withConverter(Utils.memberConverter).update({
          customer: oneWeCustomer,
          stripe: {
            customer: subscription.customer as string,
            subscription: subscription.id,
            status: "incomplete",
            billingCycleAnchor: new Date(subscription.billing_cycle_anchor * 1000),
          },
        }));
        const updateSubscriptionItemPromise = subscriptionPromise.then(subscription => {
          const subscriptionItem = subscription.items.data[0];
          return mirroredSponsorshipUpdate({stripeSubscriptionItem: subscriptionItem.id});
        });
        const [customer, subscription] = await Promise.all([customerPromise, subscriptionPromise, firestorePromise, updateSubscriptionItemPromise]);
        res.status(200).json({ customer: customer.id, subscription: subscription.id, clientSecret: ((subscription.latest_invoice as Stripe.Invoice).payment_intent as Stripe.PaymentIntent).client_secret });
        break;
      default:
        badRequest(res);
    }
  }

  const updateSponsorship = async (res: NextApiResponse) => {
    switch(step) {
      case "chooseSponsorship":
        await setUpSubscriptionPrice(res);
        break;
      case "confirm":
        const subscriptionItem = await stripe.subscriptionItems.create({
          metadata: {
            maker,
            member,
          },
          subscription: subscriptionIn,
          price: sponsorshipPriceIn,
        });

        await mirroredSponsorshipUpdate(
          {stripeSubscriptionItem: subscriptionItem.id,
             paymentsStarted: new Date(subscriptionItem.created * 1000)});

        res.status(200).json({});
        break;
      default:
        badRequest(res);
    }
  }

  switch(sponsorState) {
    case "initialize":
      await initializeSponsorship(res);
      break;
    case "repeat":
      await updateSponsorship(res);
      break;
    default:
      badRequest(res);
  }
}

export default Sponsor;