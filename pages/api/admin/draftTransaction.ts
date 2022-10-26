import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { logger } from "../../../common/logger";
import * as conversationUtils from "../../../modules/facebook/conversation/utils";
import {
  changesInResources,
  ChangesInResources,
  draftTransaction,
  TxDatum,
  TxMessage,
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
  const { message, buttons, messageType, resourcesChange } =
    await parseTransactionForm(req);

  console.log("message2: ", message);

  let draftTxData = Array<TxDatum>();

  if (message != "") {
    console.log("entraaaaaaaaaaaaa en mensaje");
    let txMessage: TxMessage = {
      type: messageType,
      text: message,
    };
    if (buttons.length > 0) {
      txMessage = { ...txMessage, buttons };
    }
    draftTxData.push({ type: "message", message: txMessage });
  }
  console.log("before object entries", draftTxData);
  if (Object.entries(resourcesChange).length > 0) {
    draftTxData.push({ type: "resourcesChange", resourcesChange });
  }

  const draftTx = draftTransaction.parse({
    data: draftTxData,
    createdAt: new Date().toISOString(),
  });
  console.log("look at meeeeeee", draftTx);
  addDraftTx(draftTx);

  res.status(200).end();
}
