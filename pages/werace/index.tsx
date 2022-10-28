import type { GetServerSideProps, NextPage } from "next";

import React, { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import { getAllChallengesSnapshot } from "../../common/db";
import { challengeData, ChallengeData } from "../../modules/db/schemas";
import votestyles from "../../styles/vote.module.css";
import { Card, CardContent, Grid } from "@mui/material";
import { pickBy, identity } from "lodash";
import Link from "next/link";

import AddChallengeCard from "../../modules/weRace/components/addChallengeCard";

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

const AllChallenges: NextPage<{
  challengeData: Array<ChallengeData>;
}> = (props) => {
  const [newChallenge, addNewChallenge] = useState<ChallengeData>();
  const [challenges, setChallenges] = useState<Array<ChallengeData>>();

  useEffect(() => {
    setChallenges(props.challengeData);
  }, [props.challengeData]);

  useEffect(() => {
    if (newChallenge) {
      setChallenges((challenges) => {
        console.log("Broski in the use effect");
        console.log("Challenges: ", challenges);
        console.log("newChallenge: ", newChallenge);
        if (challenges == undefined) {
          return [newChallenge];
        }
        challenges.unshift(newChallenge);
        console.log("Challenges unshifted: ", challenges);
        return challenges;
      });
    }
  }, [newChallenge]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={votestyles.vote}>
          <h1> WeRaces</h1>
          <AddChallengeCard addNewChallenge={addNewChallenge} />
          {challenges ? (
            challenges.map((challenge, i) => (
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
                      <>
                        Title: {challenge.title}
                        <br />
                        Start: {challenge.start}
                        <br />
                        End: {challenge.end}
                        <br />
                        Hashtags:
                        {challenge.hashtags ? (
                          Object.values(challenge.hashtags).map(
                            (hashtag, j) => <p key={j}>{hashtag}</p>
                          )
                        ) : (
                          <p>Sin Hashtags</p>
                        )}
                      </>
                    </CardContent>
                  </Card>
                </Grid>
              </Link>
            ))
          ) : (
            <></>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllChallenges;
