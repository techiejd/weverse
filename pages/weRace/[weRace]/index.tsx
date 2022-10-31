import type { GetServerSideProps, NextPage } from "next";
import styles from "../../../styles/Home.module.css";
import { getChallenge } from "../../../common/db";
import { ChallengeData, challengeData } from "../../../modules/db/schemas";
import cardStyles from "../../../styles/card.module.css";
import { pickBy, identity } from "lodash";

import { useRouter } from "next/router";
import { Card, CardContent, Grid } from "@mui/material";
import { MouseEvent } from "react";
import { count, CountInfo } from "../../../modules/weRace/vote/utils/count";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = (context) => {
  const weRace = String(context.params?.weRace);
  return getChallenge(weRace).then(async (challengeSnapshot) => {
    return {
      props: {
        challengeData: challengeData.parse(
          pickBy(
            {
              ...challengeSnapshot.data(),
              start: new Date(
                challengeSnapshot.data()?.start.toMillis()
              ).toString(),
              end: new Date(
                challengeSnapshot.data()?.end?.toMillis()
              ).toString(),
              id: weRace,
            },
            identity
          )
        ),
        countInfo: await count(weRace),
      },
    };
  });
};

const User: NextPage<{
  challengeData: ChallengeData;
  countInfo: CountInfo;
}> = (props) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={cardStyles.vote}>
          <h1>{props.challengeData.title}</h1>
          <h2> WeRace</h2>
          <br />
          Start: {props.challengeData.start}
          <br />
          End:{" "}
          {props.challengeData.end ? props.challengeData.end : "No end date"}
          <br />
          Hashtags:{" "}
          {props.challengeData.hashtags
            ? props.challengeData.hashtags
            : "No hashtags"}
          <br />
          {`http://www.one.tech/weRace/${props.challengeData.id}/vote?psid={user.psid}`}
          <br />
          <>
            <hr />
            <h2>User State</h2>
            <h3>Users who have not voted</h3>
            {props.countInfo.hasntVoted.map((user, i) => (
              <Link key={i} href={`/admin/user/${user.psid}`}>
                <a target="_blank">
                  <li>{user.name}</li>
                </a>
              </Link>
            ))}
          </>
          <>
            <h3>Users who have over voted</h3>
            {props.countInfo.overVoted.map((user, i) => (
              <Link key={i} href={`/admin/user/${user.psid}`}>
                <a target="_blank">
                  <li>{user.name}</li>
                </a>
              </Link>
            ))}
          </>
          <>
            <hr />
            <h2>WeRank Results</h2>
            {props.countInfo.postVoteData.map((post, i) => (
              <Card
                sx={{ maxWidth: 700, mt: 5 }}
                variant="outlined"
                style={{
                  backgroundColor: "black",
                  color: "white",
                  borderColor: "white",
                  borderRadius: "15px",
                }}
                key={i}
              >
                <CardContent>
                  <p>⚡Position: {i + 1}</p>
                  <p>📷Post: {post.message}</p>
                  <p>🌟Votes: {post.votes}</p>
                  <p>ID: {post.id}</p>
                </CardContent>
              </Card>
            ))}
          </>
        </div>
      </main>
    </div>
  );
};

export default User;
