import type { NextApiRequest, NextApiResponse } from "next";
import {
  draftTransaction,
  TxDatum,
  TxMessage,
  draftTransactionExtended,
} from "../../../modules/db/schemas";
import { addDraftTx } from "../../../common/db";
import { parseTransactionForm } from "../../../modules/admin/parseTransactionForm";
import { deleteDraftTxById } from "../../../common/db";

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "200mb",
  },
};

export default async function admin(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { message, buttons, messageType, resourcesChange, route } =
      await parseTransactionForm(req);
    let draftTxData = Array<TxDatum>();

    if (message != "") {
      let txMessage: TxMessage = {
        type: messageType,
        text: message,
      };
      if (buttons.length > 0) {
        txMessage = { ...txMessage, buttons };
      }
      draftTxData.push({ type: "message", message: txMessage });
    }
    if (Object.entries(resourcesChange).length > 0) {
      draftTxData.push({ type: "resourcesChange", resourcesChange });
    }
    let draftTx;
    if (route == undefined) {
      draftTx = draftTransaction.parse({
        data: draftTxData,
        createdAt: new Date().toISOString(),
      });
    } else {
      draftTx = draftTransactionExtended.parse({
        data: draftTxData,
        createdAt: new Date().toISOString(),
        route: route,
      });
    }
    addDraftTx(draftTx);

    res.status(200).end();
  }
  if (req.method === "DELETE") {
    deleteDraftTxById(String(req.query.id));
    res.status(200).end();
  }
}
