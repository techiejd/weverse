import type { NextPage } from "next";
import styles from "../../styles/Home.module.css";

// TODO(techiejd): Add table showing voting results.
const onvoteSubmitted: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Misión cumplida!</h1>
        <p className={styles.description}>
          Gracias, tu ayuda nos avanza un poco y cada avance es una ayuda.
        </p>
      </main>
    </div>
  );
};

export default onvoteSubmitted;
