import type { NextPage } from "next";
import { getAllUsersSnapshot } from "../../common/db";
import styles from "../../styles/Home.module.css";

export async function getServerSideProps() {
  return getAllUsersSnapshot().then(async (usersSnapshot) => {
    return {
      props: {
        usersSnapshot: usersSnapshot,
      },
    };
  });
}

const search: NextPage<{
  usersSnapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>;
}> = (props) => {
  // TODO(jimenez1917): Add search functionality.
  // 1) Get queries from text input.
  // 2) Use /modules/admin/search makeQueryUsersSnapshot to query.
  // usersFound = makeQueryUsersSnapshot(queries)(props.usersSnapshot)
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Search within the WeVerse.</h1>

        <p className={styles.description}>FILL HERE</p>
      </main>
    </div>
  );
};

export default search;
