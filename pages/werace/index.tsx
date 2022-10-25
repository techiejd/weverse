import type { GetServerSideProps, NextPage } from "next";

import React from "react";
import styles from "../../styles/Home.module.css";
import { getAllChallengesSnapshot } from "../../common/db";
import { challengeData, ChallengeData } from "../../modules/db/schemas";
import { logger } from "../../common/logger";
import cardStyles from "../../styles/card.module.css";
import { Card, CardContent, Grid } from "@mui/material";
import { pickBy, identity } from "lodash";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = (context) => {
  return getAllChallengesSnapshot().then(async (challengesSnapshot) => {
    return {
      props: {
        challengeData: challengesSnapshot.docs.map((challengeSnapshot) => {
          return challengeData.parse(
            pickBy(
              {
                ...challengeSnapshot.data(),
                start: new Date(
                  challengeSnapshot.data().start.toMillis()
                ).toString(),
                end: new Date(
                  challengeSnapshot.data().end?.toMillis()
                ).toString(),
                id: challengeSnapshot.id,
              },
              identity
            )
          );
        }),
      },
    };
  });
};

const AllChallege: NextPage<{
  challengeData: Array<ChallengeData>;
}> = (props) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={cardStyles.vote}>
          <h1> WeRaces</h1>
          <button disabled={true}> Add New Race</button>
          {props.challengeData.map((challenge, i) => (
            <Link key={i} href={`./werace/${challenge.id}`}>
              <Grid
                container
                spacing={0}
                direction="column"
                textAlign="center"
                justifyContent="center"
                key={i}
              >
                <Card
                  sx={{ maxWidth: 700, mt: 5 }}
                  variant="outlined"
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    borderColor: "white",
                    borderRadius: "15px",
                  }}
                >
                  <CardContent>
                    Title: {challenge.title}
                    <br />
                    Start: {challenge.start}
                    <br />
                    End: {challenge.end}
                    <br />
                    Hashtags: {challenge.hashtags}
                  </CardContent>
                </Card>
              </Grid>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AllChallege;
