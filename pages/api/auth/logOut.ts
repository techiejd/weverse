import { NextApiRequest, NextApiResponse } from "next";
import { parseCookies, destroyCookie } from "nookies";
import { cookieOptions } from "../../../common/utils/firebaseAdmin";

export default async function logOut(
  req: NextApiRequest,
  res: NextApiResponse
) {
  destroyCookie({ res }, "user", cookieOptions);
  res.send("Logged out!");
}
