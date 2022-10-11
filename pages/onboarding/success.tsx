import type { NextPage } from "next";
import styles from "../../styles/Home.module.css";


// TODO(techiejd): Add table showing voting results.
const onboardingFormSubmitted: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Ya estas listo para Participar</h1>

        <p className={styles.description}>Pronto tendrás mas información</p>
      </main>
    </div>
  );
};

export default onboardingFormSubmitted;
