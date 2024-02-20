import { NextApiRequest, NextApiResponse } from "next";
import {
  badRequest,
  createStripeAccountLink,
} from "../../common/context/serverUtils";
import { getAuthentication } from "../../common/utils/firebaseAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { stripeAccountId } = req.body;
  if (!stripeAccountId) {
    return badRequest(res, 400, "Missing required fields");
  }
  // Check if user is signed in
  const user = await getAuthentication({ req });
  if (!user.authenticated) {
    return badRequest(res, 401, "User not authenticated");
  }

  const continueOnboardingLink = await createStripeAccountLink(
    stripeAccountId,
    user.uid
  );
  return res.status(200).json({ link: continueOnboardingLink.url });
}
