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
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

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
  const [messageType, setMessageType] = useState<MessageType>("Notify");
  const [inputMessage, setInputMessage] = useState<string>("");
  const [resourcesChange, setResourcesChange] = useState<ChangesInResources>(
    {}
  );
  const [buttonInfos, setButtonInfos] = useState<Array<ButtonInfo>>([]);
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  // TODO(jimenez1917): Modularize this submit and form logic away.
  const onSubmit = async () => {
    const body = ((): FormData => {
      const body = new FormData();
      body.append("messageType", messageType);
      body.append("message", inputMessage);
      body.append("buttons", JSON.stringify(buttonInfos));
      body.append("resourcesChange", JSON.stringify(resourcesChange));
      body.append("users", JSON.stringify([props.userData.psid]));
      // TODO(jddominguez): Get Media working.
      // for (let i = 0; i < selectedFiles.length; i++) {
      //   body.append("messageFiles", selectedFiles[i].file);
      // }
      return body;
    })();
    const response = fetch("/api/admin", {
      method: "POST",
      body: body,
    });

    router.push("/admin/success");

    return true;
  };

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <UserManagerPortal
            userForTemplating={props.userData}
            resourcesChange={resourcesChange}
            setResourcesChange={setResourcesChange}
            messageType={messageType}
            setMessageType={setMessageType}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            buttonInfos={buttonInfos}
            setButtonInfos={setButtonInfos}
          />
          <button type="submit" className={styles.button}>
            Enviar
          </button>
        </form>
      </main>
    </div>
  );
};

export default User;
