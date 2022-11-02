import type { NextApiRequest, NextApiResponse } from "next";
import {
  draftTransaction,
  TxDatum,
  TxMessage,
  draftTransactionExtended,
} from "../../../modules/db/schemas";
import { addDraftTx } from "../../../common/db";
import { parseTransactionForm } from "../../../modules/admin/parseTransactionForm";

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "200mb",
  },
};

export default async function admin(req: NextApiRequest, res: NextApiResponse) {
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
