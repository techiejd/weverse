import type { NextPage } from "next";
import styles from "../../styles/Home.module.css";
import cardStyles from "../../styles/card.module.css";

import Link from "next/link";

const Dashboard: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={cardStyles.vote}>
          <h1>Admin Dashboard</h1>
          <h2>Admin</h2>
          <br />
          <Link href={`/admin/search`}>
            <a target="_blank">
              <li>
                <b>SEARCH: </b> Capacidad para buscar usuarios puntuales
              </li>
            </a>
          </Link>
          <br />
          <Link href={`/admin/transactions`}>
            <a target="_blank">
              <li>
                <b>TRANSACTIONS: </b> Visualización de las transacciones hechas
                por parte de todos{" "}
              </li>
            </a>
          </Link>
          <br />
          <Link href={`/admin/notifyAll`}>
            <a target="_blank">
              <li>
                <b>NOTIFY ALL: </b> Capacidad para notificar a todos los miembro
                por parte del Admin{" "}
              </li>
            </a>
          </Link>
          <>
            <hr />
            <h3>Otros</h3>
            <Link href={`/werace`}>
              <a target="_blank">
                <li>
                  <b>WERACE: </b> Visualización de las WeRaces hechas
                </li>
              </a>
            </Link>
          </>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
