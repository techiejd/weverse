import type { NextPage, GetServerSideProps } from "next";
import { getAllUsersSnapshot } from "../../common/db";
import styles from "../../styles/Home.module.css";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { userData, UserData } from "../../modules/db/schemas";
import Link from "next/link";
import { makeUserNameQueryFilter } from "../../modules/admin/search";
import adminStyles from "../../styles/admin.module.css";
import DatePicker from "react-datepicker";
import setHours from "date-fns/addHours";
import setMinutes from "date-fns/addMinutes";
import "react-datepicker/dist/react-datepicker.css";

export const getServerSideProps: GetServerSideProps = (context) => {
  return getAllUsersSnapshot().then(async (usersSnapshot) => {
    return {
      props: {
        userDatas: usersSnapshot.docs.map((userSnapshot) =>
          userData.parse(userSnapshot.data())
        ),
      },
    };
  });
};

const search: NextPage<{
  userDatas: Array<UserData>;
}> = (props) => {
  const [userNameQueryInput, setUserNameQueryInput] = useState<string>("");
  const [foundUsers, setFoundUsers] = useState<Array<UserData>>([]);
  const [target, setTarget] = useState<"Name" | "Post">("Name");
  const [startDate, setStartDate] = useState<Date | null>(
    setHours(setMinutes(new Date(), 0), 12)
  );
  const [endDate, setEndDate] = useState<Date | null>(
    setHours(setMinutes(new Date(), 0), 12)
  );
  const { register } = useForm();

  const getNameRadio = () =>
    document.getElementById("Name") as HTMLInputElement;
  const getPostRadio = () =>
    document.getElementById("Post") as HTMLInputElement;

  const nameRadioClicked = (event: ChangeEvent<HTMLInputElement>) => {
    getPostRadio().checked = false;
    setTarget("Name");
  };
  const payloadRadioClicked = (event: ChangeEvent<HTMLInputElement>) => {
    getNameRadio().checked = false;
    setTarget("Post");
  };

  useEffect(() => {
    getNameRadio().checked = true;
  }, []);

  const processUserNameQueryInput = async (e: MouseEvent) => {
    e.preventDefault();

    const userNameQueryFilter = makeUserNameQueryFilter(
      userNameQueryInput.split("\n")
    );
    const foundUsers = props.userDatas.filter(userNameQueryFilter);

    setFoundUsers(foundUsers);
  };

  function processPostQueryInput(e: MouseEvent) {
    e.preventDefault();

    console.log("chosen date: toDateString ", startDate?.toDateString());
    console.log("chosen date: ", startDate?.toISOString());

    console.log("Start", typeof startDate);
    console.log("End", endDate);
  }
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Search By:</h1>
        <div>
          <label htmlFor={"Name"}>Name</label>
          <input type="radio" id={"Name"} onChange={nameRadioClicked} />
          <label htmlFor={"Post"}>Post</label>
          <input type="radio" id={"Post"} onChange={payloadRadioClicked} />
          <br />
        </div>
        {target === "Name" ? (
          <>
            <form>
              <textarea
                placeholder="Search users by user name here |"
                className={styles.textInput}
                {...register("userNameQueryInput", {
                  required: "*",
                  onChange: (e) => setUserNameQueryInput(e.target.value),
                })}
              />
              <hr />
              <button onClick={processUserNameQueryInput}>Search</button>
            </form>
            <hr />
            <ul>
              {foundUsers.map((user, i) => (
                <Link key={i} href={`./user/${user.psid}`}>
                  <a target="_blank">
                    <li className={adminStyles.cursor}>{user.name}</li>
                  </a>
                </Link>
              ))}
            </ul>
          </>
        ) : (
          <div>
            <br />
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
            />
            <hr />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
            />
            <hr />
            <button onClick={processPostQueryInput}>Search</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default search;
