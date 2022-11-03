import { ChangesInResources, DraftTransaction, TxMessage } from "../db/schemas";

const getDataByType = (tx: DraftTransaction, type: string) =>
  tx.data?.find((datum) => datum.type == type);
const getMessage = (tx: DraftTransaction) =>
  (getDataByType(tx, "message") as { message: TxMessage }).message;
const getResourcesChange = (tx: DraftTransaction) =>
  (
    getDataByType(tx, "resourcesChange") as {
      resourcesChange: ChangesInResources;
    }
  ).resourcesChange;
export { getDataByType, getMessage, getResourcesChange };
