import type { GetServerSideProps, NextPage } from "next";
import styles from "../../../styles/Home.module.css";
import { getChallenge } from "../../../common/db";
import cardStyles from "../../../styles/card.module.css";

import { count, CountInfo } from "../../../modules/weRace/vote/utils/count";
import Link from "next/link";
import { challenge } from "../../../modules/sofia/schemas";
import { Card, CardContent } from "@mui/material";

export const getServerSideProps: GetServerSideProps = (context) => {
  const weRace = String(context.params?.weRace);
  return getChallenge(weRace).then(async (challengeSnapshot) => {
    return {
      props: {
        challenge: JSON.stringify(challenge.parse(challengeSnapshot.data())),
        countInfo: await count(weRace),
      },
    };
  });
};

const User: NextPage<{
  challenge: string;
  countInfo: CountInfo;
}> = (props) => {
  const weRace = challenge.parse(JSON.parse(props.challenge));
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={cardStyles.vote}>
          <h1>{weRace.title}</h1>
          <h2> WeRace</h2>
          <br />
          Start: {weRace.start.toISOString()}
          <br />
          End: {weRace.end ? weRace.end.toISOString() : "No end date"}
          <br />
          Hashtags: {weRace.hashtags ? weRace.hashtags : "No hashtags"}
          <br />
          <br />
          Escribiendo el {`"user.psid"`} dentro de este enlace puede ir a la
          pagina de votación de dicho usuario: <br />
          --
          {`http://www.one.tech/weRace/${weRace.id}/vote?psid=\${user.psid}`}
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
