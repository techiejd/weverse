import type { NextPage } from "next";
import { Transaction } from "../../modules/db/schemas";
// TODO(jimenez1917): Get correct styles
import styles from "../../styles/Home.module.css";

// TODO(techiejd): Are these records or transactions?
export async function getServerSideProps() {
  const transactions: Array<Transaction> = [
    {
      from: { name: "Nico", id: "Nico's psid", actingAsSofi: true },
      to: [{ name: "David", id: "David's psid" }],
      data: [
        { type: "message", message: { text: "I'm a little teapot" } },
        { type: "resourcesChange", resourcesChange: { "🌟": 5 } },
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
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Admin Transactions</h1>

        <p className={styles.description}>Valida que el mensaje fue enviado</p>
      </main>
    </div>
  );
};

export default Transactions;
