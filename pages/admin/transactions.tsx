import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Transaction } from "../../modules/db/schemas";
// TODO(jimenez1917): Get correct styles
import styles from "../../styles/Home.module.css";
import adminStyles from "../../styles/Admin.module.css";

// TODO(techiejd): Are these records or transactions?
export async function getServerSideProps() {
  const transactions: Array<Transaction> = [
    {
      from: { name: "Nico", id: "Nico's psid", actingAsSofi: true },
      to: [{ name: "David", id: "David's psid" }],
      data: [
        { type: "message", message: { text: "I'm a little teapot" } },
        { type: "resourcesChange", resourcesChange: { "🌟": -5, "👺": 3 } },
      ],
    },
  ];
  return {
    props: {
      transactions: transactions,
    },
  };
}

const Transactions: NextPage<{ transactions: Array<Transaction> }> = (
  props
) => {
  const [isSofi, setIsSofi] = useState<Boolean>(
    "actingAsSofi" in props.transactions[0].from
  );
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
        <div>
          {isSofi ? (
            <div className={adminStyles.boxTransactions}>
              <h1>From: Sofi → To: {props.transactions[0].to[0].name}</h1>
              <h2>{message}</h2>
              <ul>
                {Object.entries(resourcesTransactions).map((resource, i) => (
                  <li key={i}>
                    {resource}
                    <hr />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className={adminStyles.boxTransactions}>
              <h1>
                From: {props.transactions[0].from.name} → To:{" "}
                {props.transactions[0].to[0].name}
              </h1>
              <h2>{message}</h2>
              <ul>
                {Object.entries(resourcesTransactions).map((resource, i) => (
                  <li key={i}>
                    {resource}
                    <hr />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Transactions;
