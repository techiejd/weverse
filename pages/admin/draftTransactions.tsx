import type { NextPage } from "next";
import { useState } from "react";
import {
  ChangesInResources,
  DraftTransaction,
  TxMessage,
} from "../../modules/db/schemas";
import styles from "../../styles/Home.module.css";
import adminStyles from "../../styles/admin.module.css";
import { getAllDraftTx } from "../../common/db";

export async function getServerSideProps() {
  return getAllDraftTx().then((draftTransactions) => {
    return {
      props: {
        draftTransactions: draftTransactions,
      },
    };
  });
}
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

const draftTransactions: NextPage<{
  draftTransactions: Array<DraftTransaction>;
}> = (props) => {
  const [draftTransactions, setDraftTransactions] = useState<
    Array<DraftTransaction>
  >(props.draftTransactions);
  const processDeleteDraftTransactions = (id: string) => {
    console.log("id", id);
    let body = id;
    fetch("/api/admin/deletedraftTransaction", {
      method: "POST",
      body: body,
    }).then(() => {
      setDraftTransactions(
        draftTransactions.filter((transaction) => transaction.id !== id)
      );
    });
  };
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Admin DraftTransactions</h1>
        {draftTransactions.map((tx, i) => (
          <div className={adminStyles.boxTransactions} key={i}>
            {getDataByType(tx, "message") == undefined ? (
              <></>
            ) : (
              <div>
                <h2>Message</h2>
                <p>Type: {getMessage(tx).type} </p>
                <p>{getMessage(tx).text}</p>
                {getMessage(tx).buttons?.map((buttonInfo, i) => (
                  <div key={i}>
                    <h3>Button {i}</h3>
                    <p>{buttonInfo.title}</p>
                    <p>
                      {buttonInfo.url ? buttonInfo.url : buttonInfo.payload}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {getDataByType(tx, "resourcesChange") == undefined ? (
              <></>
            ) : (
              <ul>
                {Object.entries(getResourcesChange(tx)).map((resource, i) => (
                  <li key={i}>
                    <div>
                      {resource}
                      <hr />
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <p>
              <b>Created At: </b>
              {tx.createdAt}
            </p>
            <p>
              <b>Route: </b> {tx.route}
            </p>
            <button
              className={adminStyles.deleteButton}
              onClick={() => processDeleteDraftTransactions(String(tx.id))}
            >
              Delete
            </button>
          </div>
        ))}
      </main>
    </div>
  );
};

export default draftTransactions;
