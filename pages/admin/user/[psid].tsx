import type { GetServerSideProps, NextPage } from "next";
import styles from "../../../styles/Home.module.css";
import { getUserSnapshot } from "../../../common/db";
import { userData, UserData } from "../../../modules/db/schemas";
import { UserManagerPortal } from "../../../modules/admin/components/userManagerPortal";

export const getServerSideProps: GetServerSideProps = (context) => {
  return getUserSnapshot(String(context.params?.psid)).then(
    async (usersSnapshot) => {
      return {
        props: {
          userDatas: userData.parse(usersSnapshot.data()),
        },
      };
    }
  );
};

const User: NextPage<{
  userDatas: UserData;
}> = (props) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div>
          <h1>{props.userDatas.name}</h1>
          <h2>Resources</h2>
          <hr />
          {Object.entries(props.userDatas.gameInfo.resources).map(
            ([resource, amount], i) => (
              <div key={i}>
                <p>
                  {resource}:{amount}
                </p>
                <hr />
              </div>
            )
          )}
        </div>
        <UserManagerPortal />
      </main>
    </div>
  );
};

export default User;
