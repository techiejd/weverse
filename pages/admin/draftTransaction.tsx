import type { NextPage } from "next";
import styles from "../../styles/Home.module.css";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { getUserSnapshot } from "../../common/db";
import {
  ChangesInResources,
  userData,
  UserData,
} from "../../modules/db/schemas";
import React, { useState } from "react";
import { UserManagerPortal } from "../../modules/admin/components/userManagerPortal";
import {
  ButtonInfo,
  MessageType,
} from "../../modules/facebook/conversation/utils";

export async function getServerSideProps() {
  return getUserSnapshot(String(process.env.ADMIN_ID)).then(
    async (userSnapshot) => {
      return {
        props: {
          admin: userData.parse(userSnapshot.data()),
        },
      };
    }
  );
}

const DraftTransaction: NextPage<{ admin: UserData }> = (props) => {
  const [messageType, setMessageType] = useState<MessageType>("Notify");
  const [inputMessage, setInputMessage] = useState<string>("");
  const [resourcesChange, setResourcesChange] = useState<ChangesInResources>(
    {}
  );
  const [buttonInfos, setButtonInfos] = useState<Array<ButtonInfo>>([]);
  const [route, setRoute] = useState<string>("");
  const { handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async () => {
    const body = ((): FormData => {
      const body = new FormData();
      body.append("messageType", messageType);
      body.append("message", inputMessage);
      body.append("buttons", JSON.stringify(buttonInfos));
      body.append("resourcesChange", JSON.stringify(resourcesChange));
      body.append("route", route);
      return body;
    })();
    const response = fetch("/api/admin/draftTransactions", {
      method: "POST",
      body: body,
    });

    // router.push("/admin/success");

    return true;
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Guardar borrador de transaccion : {props.admin.name}
        </h1>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <UserManagerPortal
              userForTemplating={props.admin}
              resourcesChange={resourcesChange}
              setResourcesChange={setResourcesChange}
              messageType={messageType}
              setMessageType={setMessageType}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              buttonInfos={buttonInfos}
              setButtonInfos={setButtonInfos}
              route={route}
              setRoute={setRoute}
            />
            <button type="submit" className={styles.button}>
              Guardar
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default DraftTransaction;
