import type { NextPage } from "next";
import styles from "../../styles/Home.module.css";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { getUserSnapshot } from "../../common/db";
import { userData, UserData } from "../../modules/db/schemas";
import React from "react";
import { UserManagerPortal } from "../../modules/admin/components/userManagerPortal";

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
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const body = ((): FormData => {
      const body = new FormData();
      body.append("message", data.message);
      body.append("buttons", JSON.stringify(buttonInfos));
      for (let i = 0; i < selectedFiles.length; i++) {
        body.append("messageFiles", selectedFiles[i].file);
      }
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
            <UserManagerPortal userForTemplating={props.admin} />
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
