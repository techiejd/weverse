import type { NextApiRequest, NextApiResponse } from 'next'
import { initializeApp, getApps } from 'firebase-admin/app';
import { DbBase, SponsorshipLevel, member, sponsorship, sponsorshipLevel } from '../../functions/shared/src';
import Stripe from "stripe";
import {FirestoreDataConverter, WithFieldValue,
  DocumentData,
  QueryDocumentSnapshot, Timestamp} from "firebase-admin/firestore";
import {z} from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

import { Step } from '../../modules/makers/sponsor/utils';
import { getFirestore } from 'firebase-admin/firestore';

// TODO(techiejd): Have some kind of dev mode read these instead.
const testProduct = "prod_O76xw2wlNkijb1";
const testFan = "prod_O7oOWYdMThvn5M";

const sponsorshipLevelsToPlanIds : Record<SponsorshipLevel, string> = {
  [sponsorshipLevel.Enum.admirer]: "prod_O76kVZNQtlcRdx",
  [sponsorshipLevel.Enum.fan]: "prod_O76vBHvvBiDLi2",
  [sponsorshipLevel.Enum.lover]: "prod_O76wNilkqKlYsK",
  [sponsorshipLevel.Enum.custom]: "prod_O76x3IxBN4ROwm",
};

const firestore = (() => {
  if (!getApps().length) {
    const fs = getFirestore(initializeApp());
    fs.settings({ignoreUndefinedProperties: true});
  return fs;
  }
  return getFirestore(getApps()[0]);
})();

namespace Utils {
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

const Sponsor = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
    const { step: stepIn } = req.query;
    const body = JSON.parse(req.body);
    if (stepIn == undefined) {
      res.status(400).json({ message: 'Bad Request' });
    }

    const {member, maker,
      total, sponsorshipLevel, customAmount, tipAmount, denyFee, prevSponsorshipPrice,
      firstName, lastName, email, phoneNumber, postalCode, countryCode, country, 
      sponsorshipPrice : sponsorshipPriceIn, subscription: subscriptionIn, customer: customerIn} = body;

    switch(Step.toStep(stepIn?.toString() ?? "")) {
      case Step.chooseSponsorship:
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
          sponsorshipPrice: sponsorshipPrice.id,
          total,
          sponsorshipLevel,
          customAmount,
          tipAmount,
          denyFee,
        }
        batch.set(firestore.doc(`makers/${maker}/sponsorships/${member}`).withConverter(Utils.sponsorshipConverter), sponsorshipData);
        batch.set(firestore.doc(`members/${member}/sponsorships/${maker}`).withConverter(Utils.sponsorshipConverter), sponsorshipData);

        await Promise.all([archiveLastSponsorshipPricePromise, batch.commit()]);


        res.status(200).json({ sponsorshipPrice: sponsorshipPrice.id });


        break;
      case Step.customerDetails:
        const stripeCustomer = {
          name: `${firstName} ${lastName}`,
          email,
          phone: phoneNumber,
          address: {
            postal_code: postalCode,
            country: countryCode,
          },
        };
        const oneWeCustomer = {
          firstName,
          lastName,
          email,
          phone: phoneNumber,
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
            items: [{price: sponsorshipPriceIn}], // you can't update a default_incomplete subscription's price, so we choose to assume the price is stale and, thusly, to create a new subscription.
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
            state: "incomplete",
          },
        }));
        const [customer, subscription] = await Promise.all([customerPromise, subscriptionPromise, firestorePromise]);
        res.status(200).json({ customer: customer.id, subscription: subscription.id, clientSecret: ((subscription.latest_invoice as Stripe.Invoice).payment_intent as Stripe.PaymentIntent).client_secret });
        break;
      default:
        res.status(400).json({ message: 'Bad Request' });
    }
}

export default Sponsor;