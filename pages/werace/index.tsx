import type { GetServerSideProps, NextPage } from "next";

import React, { useState, MouseEvent } from "react";
import styles from "../../styles/Home.module.css";
import { getAllChallengesSnapshot } from "../../common/db";
import { challengeData, ChallengeData } from "../../modules/db/schemas";
import votestyles from "../../styles/vote.module.css";
import { Card, CardContent, Grid } from "@mui/material";
import { pickBy, identity } from "lodash";
import Link from "next/link";
import { Challenge } from "../../modules/sofia/schemas";

import { useRouter } from "next/router";
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
  const [disableAddChallenge, setDisableAddChallenge] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [title, setTitle] = useState<string>("");
  const [inputHashtag, setInputHashtag] = useState<string>("");
  const [hashtags, setHashtags] = useState<Array<string>>([]);
  const router = useRouter();

  const processAddChallenge = async (e: MouseEvent) => {
    e.preventDefault();

    console.log("title", title);
    if (title == "") {
      alert("The title of the challenge cannot be empty!");
      return;
    }
    for (const i in hashtags) {
      if (hashtags[i] == "") {
        alert("Hashtags must be specified");
        return;
      }
    }

    let body: Challenge = {
      start: startDate,
      end: endDate,
      title: title,
      hashtags: hashtags,
    };

    const response: Promise<Response> = fetch("/api/weRace", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if ((await response)?.status === 200) {
      //restart the call of Data Base
      router.replace(router.asPath);
      //Must be restarting statesments
      setDisableAddChallenge(true);
      setStartDate(new Date());
      setEndDate(new Date());
      setTitle("");
      setInputHashtag("");
      setHashtags([]);
    }

    return true;
  };
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={votestyles.vote}>
          <h1> WeRaces</h1>
          {disableAddChallenge ? (
            <>
              <button onClick={() => setDisableAddChallenge(false)}>
                Add New Race
              </button>
            </>
          ) : (
            <AddChallengeCard
              setDisableAddChallenge={setDisableAddChallenge}
              setStartDate={setStartDate}
              startDate={startDate}
              setEndDate={setEndDate}
              endDate={endDate}
              setTitle={setTitle}
              setInputHashtag={setInputHashtag}
              inputHashtag={inputHashtag}
              setHashtags={setHashtags}
              hashtags={hashtags}
              processAddChallenge={processAddChallenge}
            />
          )}
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
                    <>
                      Title: {challenge.title}
                      <br />
                      Start: {challenge.start}
                      <br />
                      End: {challenge.end}
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
