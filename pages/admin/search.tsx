import type { NextPage, GetServerSideProps } from "next";
import { getAllUsersSnapshot } from "../../common/db";
import styles from "../../styles/Home.module.css";
import { MouseEvent, useState } from "react";
import { useForm } from "react-hook-form";
import {userData, UserData} from "../../modules/db/schemas";
import Link from "next/link";
import { makeUserNameQueryFilter } from "../../modules/admin/search";

export const getServerSideProps : GetServerSideProps = (context) => {
  return getAllUsersSnapshot().then(async (usersSnapshot) => {
    return {
      props: {
        userDatas: usersSnapshot.docs.map(userSnapshot => userData.parse(userSnapshot.data())),
      },
    };
  });
}

const search: NextPage<{
  userDatas: Array<UserData>;
}> = (props) => {
  const [userNameQueryInput, setUserNameQueryInput] = useState<string>("");
  const [foundUsers, setFoundUsers] = useState<Array<UserData>>([]);
  const { register} = useForm();

  const processUserNameQueryInput = async (e : MouseEvent) =>{
    e.preventDefault();

    const userNameQueryFilter = makeUserNameQueryFilter(userNameQueryInput.split('\n'));
    const foundUsers = props.userDatas.filter(userNameQueryFilter);

    setFoundUsers(foundUsers);
  };
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Search by user name: </h1>
        <form>
            <textarea
                placeholder="Search users by user name here |"
                className={styles.textInput}
                {...register("userNameQueryInput", {
                  required: "*",
                  onChange: (e) => setUserNameQueryInput(e.target.value),
                })}
            /><hr/>
            <button onClick={processUserNameQueryInput}>Search</button>
        </form>
        <hr/>
        <ul>
          {foundUsers.map((user,i) =>(
            <Link key={i} href={`./user/${user.psid}`}><a target="_blank"><li className={styles.cursor}>{user.name}</li></a></Link>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default search;
