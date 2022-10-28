import type { GetServerSideProps, NextApiRequest, NextPage } from "next";

import React, {
  useState,
  MouseEvent,
  ChangeEvent,
  KeyboardEventHandler,
} from "react";
import styles from "../../styles/Home.module.css";
import { getAllChallengesSnapshot } from "../../common/db";
import { challengeData, ChallengeData } from "../../modules/db/schemas";
import { logger } from "../../common/logger";
import votestyles from "../../styles/vote.module.css";
import weraceStyles from "../../styles/challenge.module.css";
import { Card, CardContent, Grid } from "@mui/material";
import { pickBy, identity } from "lodash";
import Link from "next/link";
import DatePicker from "react-datepicker";
import setHours from "date-fns/addHours";
import setMinutes from "date-fns/addMinutes";
import "react-datepicker/dist/react-datepicker.css";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Challenge } from "../../modules/sofia/schemas";

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
  const incNumHashtags = (e: MouseEvent) => {
    e.preventDefault();

    setHashtags([...hashtags, inputHashtag]);
  };
  const decNumHashtags = (e: MouseEvent) => {
    e.preventDefault();
    if (hashtags.length > 0) {
      hashtags.pop();
      setHashtags([...hashtags]);
    }
  };
  const handleHashtagChange = (e: ChangeEvent, input: string, i: number) => {
    e.preventDefault();

    const element = document.getElementById(`hashtag${i}`) as HTMLInputElement;

    const isInvalid = (() => {
      const re = /^\w+$/; // ReGex for aZ09 and '_' in line
      return !re.test(input) && input != "";
    })();
    if (isInvalid) {
      element.value = inputHashtag;
      return;
    }

    setInputHashtag(input);
    hashtags[i] = input;
  };

  const processAddChallenge = (e: MouseEvent) => {
    e.preventDefault();

    let body: Challenge = {
      start: startDate,
      end: endDate,
      title: title,
      hashtags: hashtags,
    };

    const response = fetch("/api/weRace", {
      method: "POST",
      body: JSON.stringify(body),
    });

    // router.push("/admin/success");

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
            <>
              <div>
                <br />
                <h3>Start: </h3>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    if (date) {
                      setStartDate(date);
                    }
                  }}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                />
                <hr />
                <h3>End: </h3>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => {
                    if (date) {
                      setEndDate(date);
                    }
                  }}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                />
                <hr />
                <label htmlFor="title">Title: </label>
                <input
                  type="text"
                  placeholder="Title"
                  id="title"
                  name="title"
                  onChange={(event) => setTitle(event.target.value)}
                />
                <hr />
                <div className={weraceStyles.count}>
                  <button onClick={decNumHashtags}>
                    <RemoveIcon color="action" />
                  </button>
                  <h2>Add hash tags</h2>
                  <br />
                  <p>Only Letter,Numbers,Underscore</p>
                  <button onClick={incNumHashtags}>
                    <AddIcon color="action" />
                  </button>
                </div>
                {hashtags.map((hashtag, i) => (
                  <div key={i}>
                    <label htmlFor={`hashtag${i}`}>{i + 1} #: </label>
                    <input
                      type="text"
                      placeholder="Enter hashtag here."
                      id={`hashtag${i}`}
                      name="hashtags"
                      onChange={(e) =>
                        handleHashtagChange(e, e.target.value, i)
                      }
                    />
                  </div>
                ))}
                <br />
                <button onClick={processAddChallenge}>Guardar</button>
                <button onClick={() => setDisableAddChallenge(true)}>
                  Cancelar
                </button>
              </div>
            </>
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

export default AllChallenges;
