import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>OneWe Technical Site</title>
        <meta name="description" content="OneWe technical site" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to {"OneWe's"} technical site!</h1>

        <p className={styles.description}>
          Simply put, you {"shouldn't"} be here!
        </p>
      </main>
    </div>
  );
};

export default Home;
