import type { GetServerSideProps, NextPage } from "next";

import React, { useState } from "react";
import styles from "../../styles/Home.module.css";
import { getAllChallengesSnapshot } from "../../common/db";
import cardStyles from "../../styles/card.module.css";
import { Card, CardContent, Grid } from "@mui/material";
import Link from "next/link";
import { Challenge, challenge } from "../../modules/sofia/schemas";

import AddChallengeCard from "../../modules/weRace/components/addChallengeCard";

export const getServerSideProps: GetServerSideProps = (context) => {
  return getAllChallengesSnapshot().then(async (challengesSnapshot) => {
    return {
      props: {
        challenges: challengesSnapshot.docs.map((challengeSnapshot) => {
          return JSON.stringify({
            ...challenge.parse(challengeSnapshot.data()),
            id: challengeSnapshot.id,
          });
        }),
      },
    };
  });
};

const AllChallenges: NextPage<{
  challenges: Array<string>;
}> = (props) => {
  const [challenges, setChallenges] = useState<Array<Challenge>>(
    props.challenges.map((c) => challenge.parse(JSON.parse(c)))
  );

  const addNewChallenge = (challenge: Challenge) => {
    setChallenges([challenge, ...challenges]);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={cardStyles.vote}>
          <h1> WeRaces</h1>
          <AddChallengeCard addNewChallenge={addNewChallenge} />
          {challenges.map((challenge) => (
            <Link key={challenge.id} href={`./weRace/${challenge.id}`}>
              <Grid
                container
                spacing={0}
                direction="column"
                textAlign="center"
                justifyContent="center"
              >
                <Card
                  sx={{ maxWidth: 700, mt: 5 }}
                  variant="outlined"
                  style={{
                    color: "white",
                    borderColor: "white",
                    borderRadius: "15px",
                  }}
                >
                  <CardContent>
                    <>
                      Title: {challenge.title}
                      <br />
                      Start: {challenge.start.toISOString()}
                      <br />
                      End: {challenge.end?.toISOString()}
                      <br />
                      Hashtags:
                      {challenge.hashtags ? (
                        Object.values(challenge.hashtags).map((hashtag, j) => (
                          <p key={j}>{hashtag}</p>
                        ))
                      ) : (
                        <p>Sin Hashtags</p>
                      )}
                    </>
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

export default AllChallenges;
