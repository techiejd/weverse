import type { NextApiRequest, NextApiResponse } from "next";
import {
  PaymentPlanOptions,
  SponsorshipLevel,
  sponsorship,
  sponsorshipLevel,
} from "../../../functions/shared/src";
import Stripe from "stripe";
import { pathAndType2FromCollectionId } from "../../../common/context/weverseUtils";
import { splitPath } from "../../../common/utils/firebase";
import Utils, { badRequest, stripe } from "../../../common/context/serverUtils";
import {
  getAdminFirestore,
  isDevEnvironment,
} from "../../../common/utils/firebaseAdmin";
import { z } from "zod";

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

const persistablePaymentInfo = sponsorship.pick({
  paymentPlan: true,
  paymentsStarted: true,
});
type PersistablePaymentInfo = z.infer<typeof persistablePaymentInfo>;

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

  const {
    member,
    initiative,
    paymentPlan: paymentPlanIn,
    denyStripeFee,
    destinationAccount,
    paymentMethod,
    total: totalIn,
    sponsorshipLevel,
    customAmount: customAmountIn,
    tipPercentage: tipPercentageIn,
    oneWeAmount: oneWeAmountIn,
    initiativeAmount: initiativeAmountIn,
    stripeFeeAmount: stripeFeeAmountIn,
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
    subscription: subscriptionIn,
    customer: customerIn,
  } = body;
  const paymentPlan = paymentPlanIn as PaymentPlanOptions;
  const {
    total,
    customAmount,
    tipPercentage,
    oneWeAmount,
    initiativeAmount,
    stripeFeeAmount,
  } = {
    total: Number(totalIn),
    customAmount: Number(customAmountIn),
    tipPercentage: Number(tipPercentageIn),
    oneWeAmount: Number(oneWeAmountIn),
    initiativeAmount: Number(initiativeAmountIn),
    stripeFeeAmount: Number(stripeFeeAmountIn),
  };

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
  const saveSponsorshipWith = (paymentInfo: PersistablePaymentInfo) => {
    const batch = firestore.batch();
    const data = {
      version: "0.0.2" as const,
      sponsorshipLevel,
      initiative,
      member,
      memberPublishable: memberPublishable == "true",
      currency,
      total,
      customAmount,
      tipPercentage,
      oneWeAmount,
      initiativeAmount,
      stripeFeeAmount,
      destinationAccount,
      denyStripeFee: denyStripeFee == "true",
      ...paymentInfo,
    };
    batch.set(initiativeSponsorshipDoc, data, { merge: true });
    // TODO(techiejd): Refactor update vs set + merge logic into some other function
    batch.set(
      memberFromSponsorshipDoc,
      { type: "sponsorship", data },
      { merge: true }
    );
    return batch.commit();
  };

  const sponsorshipPlanId =
    sponsorshipLevelsToPlanIds[sponsorshipLevel as SponsorshipLevel];
  const totalNoDecimal = Math.round(total * 100);
  const applicationFeePercent = Math.round((oneWeAmount * 100) / total);
  const oneWeAmountNoDecimal = Math.round(oneWeAmount * 100);

  const createPaymentBundle = async (
    customer: string,
    paymentMethod?: string
  ): Promise<{
    paymentInfo: PersistablePaymentInfo;
    paymentIntent: Stripe.PaymentIntent;
  }> => {
    switch (paymentPlan) {
      case "oneTime":
        const paymentIntent = await stripe.paymentIntents.create({
          amount: totalNoDecimal,
          currency,
          customer,
          application_fee_amount: oneWeAmountNoDecimal,
          transfer_data: {
            destination: destinationAccount,
          },
          metadata: {
            member,
            initiative,
            oneWeAmount,
            initiativeAmount,
            stripeFeeAmount,
            tipPercentage,
            denyStripeFee,
          },
          ...(paymentMethod
            ? {
                payment_method: paymentMethod,
                confirm: true,
                off_session: true,
                error_on_requires_action: true,
              }
            : { setup_future_usage: "off_session" }),
        });
        return {
          paymentInfo: {
            paymentPlan: {
              type: "oneTime",
              status: paymentMethod ? "active" : "incomplete",
              applicationFeeAmount: oneWeAmountNoDecimal,
            },
            ...(paymentMethod
              ? { paymentsStarted: new Date(paymentIntent.created * 1000) }
              : {}),
          },
          paymentIntent,
        };
      case "monthly":
        const subscription = await createSubscription(customer, paymentMethod);
        return {
          paymentInfo: {
            paymentPlan: {
              type: "monthly" as const,
              id: subscription.id,
              billingCycleAnchor: new Date(
                subscription.billing_cycle_anchor * 1000
              ),
              status: paymentMethod ? "active" : "incomplete",
              item: subscription.items.data[0].id,
              price: (await sponsorshipPricePromise).id,
              applicationFeePercent: applicationFeePercent,
            },
            ...(paymentMethod
              ? { paymentsStarted: new Date(subscription.created * 1000) }
              : {}),
          },
          paymentIntent: getExpandedPaymentIntent(subscription),
        };
    }
  };

  const updatePaymentAsFutureUsage = async (
    paymentIntent: Stripe.PaymentIntent
  ) => {
    if (paymentPlan == "oneTime") return;
    return stripe.paymentIntents.update(paymentIntent.id, {
      setup_future_usage: "off_session",
    });
  };

  const createSubscription = async (customer: string, paymentMethod?: string) =>
    stripe.subscriptions.create({
      metadata: {
        member,
        initiative,
        oneWeAmount,
        initiativeAmount,
        stripeFeeAmount,
        tipPercentage,
        denyStripeFee,
      },
      items: [
        {
          price: (await sponsorshipPricePromise).id,
          metadata: {
            initiative,
            member,
            tipPercentage,
            denyStripeFee,
          },
        },
      ],
      payment_settings: {
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
      application_fee_percent: applicationFeePercent,
      transfer_data: {
        destination: destinationAccount,
      },
      customer,
      payment_behavior: paymentMethod
        ? "error_if_incomplete"
        : "default_incomplete",
      ...(paymentMethod
        ? {
            collection_method: "charge_automatically",
            default_payment_method: paymentMethod,
          }
        : {}),
    });

  const sponsorshipPricePromise = stripe.prices.create({
    metadata: {
      initiative,
      member,
      tipPercentage,
      denyStripeFee,
    },
    unit_amount: totalNoDecimal,
    currency: currency,
    recurring: { interval: "month" },
    product: sponsorshipPlanId,
  });

  const getExpandedPaymentIntent = (subscription: Stripe.Subscription) =>
    (subscription.latest_invoice as Stripe.Invoice)
      .payment_intent as Stripe.PaymentIntent;

  const processNewCustomerRequest = async (res: NextApiResponse) => {
    if (step != "customerDetails") badRequest(res);
    const cleanUpBeforehandChanges = () => {
      const archiveLastSponsorshipPricePromise = !prevSponsorshipPrice
        ? Promise.resolve()
        : stripe.prices.update(prevSponsorshipPrice, {
            active: false,
          });
      if (subscriptionIn != undefined) {
        const ditch = (subscription: any) => {
          /** do nothing since subscriptions are initialized as default_incomplete. */
        };
        ditch(subscriptionIn);
      }
      return archiveLastSponsorshipPricePromise;
    };

    const cleanUpPromise = cleanUpBeforehandChanges();

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
    const isAnUpdate = customerIn != undefined;

    if (isAnUpdate) {
      customerPromise = stripe.customers.update(customerIn, stripeCustomer);
    } else {
      customerPromise = stripe.customers.create(stripeCustomer);
    }
    const paymentBundlePromise = (async () =>
      createPaymentBundle((await customerPromise).id))();
    const updatePaymentAsFutureUsagePromise = (async () =>
      updatePaymentAsFutureUsage((await paymentBundlePromise).paymentIntent))();
    const saveCustomerPromise = (async () =>
      firestore
        .doc(`${member}`)
        .withConverter(Utils.memberConverter)
        .update({
          customer: oneWeCustomer,
          stripe: {
            customer: {
              id: (await customerPromise).id,
              status: "incomplete",
            },
          },
        }))();
    const saveSponsorshipPromise = (async () =>
      saveSponsorshipWith((await paymentBundlePromise).paymentInfo))();
    const [customer, paymentBundle] = await Promise.all([
      customerPromise,
      paymentBundlePromise,
      saveCustomerPromise,
      saveSponsorshipPromise,
      cleanUpPromise,
      updatePaymentAsFutureUsagePromise,
    ]);
    res.status(200).json({
      customer: customer.id,
      clientSecret: paymentBundle.paymentIntent.client_secret,
      ...(paymentBundle.paymentInfo.paymentPlan.type == "monthly"
        ? { subscription: paymentBundle.paymentInfo.paymentPlan.id }
        : {}),
    });
  };

  const processRepeatCustomerRequest = async (res: NextApiResponse) => {
    if (step != "confirm") badRequest(res, 400, "Must be in confirm step");
    if (!customerIn || !paymentMethod)
      badRequest(
        res,
        400,
        `Missing customer or paymentMethod: ${JSON.stringify({
          customerIn,
          paymentMethod,
        })}`
      );
    const paymentBundle = await createPaymentBundle(customerIn, paymentMethod);

    await saveSponsorshipWith(paymentBundle.paymentInfo);

    res.status(200).json({});
  };

  switch (sponsorState) {
    case "initialize":
      await processNewCustomerRequest(res);
      break;
    case "repeat":
      await processRepeatCustomerRequest(res);
      break;
    default:
      badRequest(res);
  }
};

export default Sponsor;
