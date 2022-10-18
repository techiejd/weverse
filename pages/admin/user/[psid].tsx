import type { GetServerSideProps, NextPage } from "next";
import styles from "../../../styles/Home.module.css";
import { getUserSnapshot } from "../../../common/db";
import {
  ChangesInResources,
  userData,
  UserData,
} from "../../../modules/db/schemas";
import { UserManagerPortal } from "../../../modules/admin/components/userManagerPortal";
import { useState } from "react";
import {
  ButtonInfo,
  MessageType,
} from "../../../modules/facebook/conversation/utils";

export const getServerSideProps: GetServerSideProps = (context) => {
  return getUserSnapshot(String(context.params?.psid)).then(
    async (usersSnapshot) => {
      return {
        props: {
          userData: userData.parse(usersSnapshot.data()),
        },
      };
    }
  );
};

const User: NextPage<{
  userData: UserData;
}> = (props) => {
  const [target, setTarget] = useState<MessageType>("Notify");
  const [inputMessage, setInputMessage] = useState<string>("");
  const [resourcesChange, setResourcesChange] = useState<ChangesInResources>(
    {}
  );
  const [buttonInfos, setButtonInfos] = useState<Array<ButtonInfo>>([]);
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div>
          <h1>{props.userData.name}</h1>
          <h2>Resources</h2>
          <hr />
          {Object.entries(props.userData.gameInfo.resources).map(
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
        <UserManagerPortal
          userForTemplating={props.userData}
          resourcesChange={resourcesChange}
          setResourcesChange={setResourcesChange}
          messageType={target}
          setMessageType={setTarget}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          buttonInfos={buttonInfos}
          setButtonInfos={setButtonInfos}
        />
      </main>
    </div>
  );
};

export default User;
