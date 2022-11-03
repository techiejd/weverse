import type { NextApiRequest, NextApiResponse } from "next";
import { deleteDraftTxById } from "../../../common/db";

export default async function admin(req: NextApiRequest, res: NextApiResponse) {
  let id = req.body;
  deleteDraftTxById(id);
  res.status(200).end();
}
