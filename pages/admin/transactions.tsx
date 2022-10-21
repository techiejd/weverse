import type { NextPage } from "next";
import { FC, useEffect, useReducer, useState } from "react";
import {
  ChangesInResources,
  Transaction,
  TxMessage,
} from "../../modules/db/schemas";
// TODO(jimenez1917): Get correct styles
import styles from "../../styles/Home.module.css";
import adminStyles from "../../styles/Admin.module.css";
import Link from "next/link";
import { getAllTx } from "../../common/db";

// TODO(techiejd): Are these records or transactions?
export async function getServerSideProps() {
  return getAllTx().then((transactions) => {
    return {
      props: {
        transactions: transactions,
      },
    };
  });
}

const getDataByType = (tx: Transaction, type: string) =>
  tx.data.find((datum) => datum.type == type);
const getMessage = (tx: Transaction) =>
  (getDataByType(tx, "message") as { message: TxMessage }).message;
const getResourcesChange = (tx: Transaction) =>
  (
    getDataByType(tx, "resourcesChange") as {
      resourcesChange: ChangesInResources;
    }
  ).resourcesChange;

const Transactions: NextPage<{ transactions: Array<Transaction> }> = (
  props
) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Admin Transactions</h1>
        {props.transactions.map((tx, i) => (
          <div className={adminStyles.boxTransactions} key={i}>
            <p>
              <b>From: </b> 🧞‍♀️({tx.from.name}) →
            </p>
            <p>
              <b>To: </b>
            </p>
            {tx.to.map((user, i) => (
              <div key={i}>
                <Link href={`./user/${user.id}`}>
                  <a>
                    {user.id}: {user.name}
                  </a>
                </Link>
              </div>
            ))}
            {getDataByType(tx, "message") == undefined ? (
              <></>
            ) : (
              <div>
                <h2>Message</h2>
                <p>Type: {getMessage(tx).type}</p>
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
          </div>
        ))}
      </main>
    </div>
  );
};

export default Transactions;
