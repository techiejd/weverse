import { z } from "zod";
import {
  DbBase,
  member,
  sponsorship,
  from,
  initiative,
} from "../../functions/shared/src";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp,
  WithFieldValue,
} from "firebase-admin/firestore";
import { NextApiResponse } from "next";
import Stripe from "stripe";
import { isDevEnvironment } from "../utils/firebaseAdmin";

namespace Utils {
  //TODO(techiejd): This is a hack to get around sharing the same schema between nextjs and firebase functions.
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
  export const fromConverter = makeDataConverter(from);
  export const initiativeConverter = makeDataConverter(initiative);
}

export default Utils;

export const badRequest = (
  res: NextApiResponse,
  errorCode?: number,
  message?: string
) => res.status(errorCode || 400).json({ error: message || "Bad Request" });

//TODO(techiejd): Put isDevEnvironment in a better place.
export const stripe = new Stripe(
  isDevEnvironment
    ? process.env.STRIPE_SECRET_KEY_DEV!
    : process.env.STRIPE_SECRET_KEY_PROD!,
  {
    apiVersion: "2022-11-15",
  }
);

export const publicBaseUrl = isDevEnvironment
  ? process.env.NEXT_PUBLIC_BASE_URL_DEV!
  : process.env.NEXT_PUBLIC_BASE_URL_PROD!;

export const createStripeAccountLink = async (
  accountId: string,
  forUser: string,
  type: "account_onboarding" | "account_update" = "account_onboarding"
) =>
  stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${publicBaseUrl}/members/${forUser}/accounts/${accountId}/refresh`,
    return_url: `${publicBaseUrl}/members/${forUser}/accounts/${accountId}/return`,
    type: type,
  });
