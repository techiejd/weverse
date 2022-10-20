import type { NextPage } from "next";
import styles from "../../styles/Home.module.css";


// TODO(techiejd): Add table showing voting results.
const onboardingFormSubmitted: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Mensaje enviado</h1>

        <p className={styles.description}>Valida que el mensaje fue enviado</p>
      </main>
    </div>
  );
};

export default onboardingFormSubmitted;
