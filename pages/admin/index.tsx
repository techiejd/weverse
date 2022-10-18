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
import { ButtonInfo } from "../../modules/facebook/conversation/utils";

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

const Dashboard: NextPage<{ admin: UserData }> = (props) => {
  const [target, setTarget] = useState<"Notify" | "Response">("Notify");
  const [inputMessage, setInputMessage] = useState<string>("");
  const [resourcesChange, setResourcesChange] = useState<ChangesInResources>(
    {}
  );
  const [buttonInfos, setButtonInfos] = useState<Array<ButtonInfo>>([]);
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const body = ((): FormData => {
      const body = new FormData();
      body.append("message", data.message);
      body.append("buttons", JSON.stringify(buttonInfos));
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
        <h1 className={styles.title}>Actuar como Sofí : {props.admin.name}</h1>
        <div>
          <form action="/api/onboarding" onSubmit={handleSubmit(onSubmit)}>
            <UserManagerPortal
              userForTemplating={props.admin}
              resourcesChange={resourcesChange}
              setResourcesChange={setResourcesChange}
              target={target}
              setTarget={setTarget}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              buttonInfos={buttonInfos}
              setButtonInfos={setButtonInfos}
            />
            <button type="submit" className={styles.button}>
              Enviar
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
