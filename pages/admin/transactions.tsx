import type { NextPage } from "next";
import { FC, useEffect, useReducer, useState } from "react";
import { ChangesInResources, Transaction } from "../../modules/db/schemas";
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

const Transactions: NextPage<{ transactions: Array<Transaction> }> = (
  props
) => {
  const [message, setMessage] = useState<string>("");
  const [resourcesTransactions, setResourcesTransactions] = useState<Object>(
    {}
  );
  useEffect(() => {
    props.transactions[0].data.map((data, i) => {
      if (data.type === "resourcesChange" && data.resourcesChange) {
        setResourcesTransactions(data.resourcesChange);
      } else if (data.type === "message") {
        setMessage(data.message.text);
      }
    });
  }, []);
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
              <h2>{message}</h2>
            )}
            {getDataByType(tx, "resourcesChange") == undefined ? (
              <></>
            ) : (
              <ul>
                {Object.entries(
                  (
                    getDataByType(tx, "resourcesChange") as {
                      resourcesChange: ChangesInResources;
                    }
                  ).resourcesChange
                ).map((resource, i) => (
                  <li key={i}>
                    <div>
                      {resource}
                      <hr />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </main>
    </div>
  );
};

export default Transactions;
