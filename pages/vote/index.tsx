import type { GetServerSideProps, NextPage } from "next";
import React, { useState, useEffect } from "react";
import {
  Candidate,
  Media,
  media as mediaSchema,
} from "../../modules/sofia/schemas";
import { pickBy, identity } from "lodash";

import Cards from "./card";
import Grid from "@mui/material/Grid";

import styles from "../../styles/Home.module.css";
import { getUserSnapshot } from "../../common/db";
import {
  getFlattenedPaginatedData,
  GroupHandler,
} from "../../modules/facebook/utils";
import {
  Post,
  attachment as attachmentSchema,
} from "../../modules/facebook/schemas";

const parsePostForVotingInfo = async (post: Post): Promise<Candidate> => {
  let medias = Array<Media>();
  if (post.attachments) {
    const attachment2MediaObject = (a: Record<string, unknown>) => {
      const attachment = attachmentSchema.parse(a);
      return mediaSchema.parse(
        pickBy(
          {
            height: attachment.media?.image?.height,
            width: attachment.media?.image?.width,
            image: attachment.media?.image?.src,
            source: attachment.media?.source,
            type: attachment.type,
          },
          identity
        )
      );
    };
    if (post.attachments.data[0] && post.attachments.data[0].subattachments) {
      medias = (
        await getFlattenedPaginatedData(post.attachments.data[0].subattachments)
      ).map(attachment2MediaObject);
    } else {
      medias = (await getFlattenedPaginatedData(post.attachments)).map(
        attachment2MediaObject
      );
    }
  }
  return pickBy(
    {
      message: post.message,
      id: post.id,
      medias: medias,
    },
    identity
  ) as Candidate;
};

const shuffle = (array: Array<any>) => {
  let currentIndex = array.length;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const getServerSideProps: GetServerSideProps = (context) => {
  // TODO(techiejd): move to a regular serversideprops fetch.
  // const voteFetch = async () => {
  //   const response = await fetch(
  //     "http://localhost:3000/api/vote?psid=5813040455394701"
  //   );
  //   const voteInfo = await response.json();
  //   console.log(voteInfo);
  //   setCandidates(voteInfo.candidates);
  // };
  // useEffect(() => {
  //   voteFetch();
  // }, []);
  console.log("context.query: ", JSON.stringify(context.query));
  const psid = String(context.query?.psid);

  return getUserSnapshot(psid).then(async (userSnapshot) => {
    const posts = await GroupHandler.getWeVersePosts(
      userSnapshot.data().token,
      undefined,
      undefined,
      // Add the since correctly
      "all"
    );
    shuffle(posts);
    const candidates = await Promise.all(posts.map(parsePostForVotingInfo));
    // setCandidates(candidates);

    return {
      props: {
        candidates: candidates,
        starAllowance: 5,
        psid: psid,
      },
    };
  });
};

const Challenge: NextPage<{
  psid: string;
  starAllowance: number;
  candidates: Array<Candidate>;
}> = (props) => {
  const candidates = props.candidates;
  const [starAllowance, setStarAllowance] = useState<number>(
    props.starAllowance
  );
  const [incrementButtonsDisabled, setIncrementButtonsDisabled] =
    useState<boolean>(false);
  useEffect(() => {
    setIncrementButtonsDisabled(starAllowance == 0);
  }, [starAllowance]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {candidates ? (
          <div>
            {candidates.map((can, i) => (
              <Grid
                container
                spacing={0}
                direction="column"
                textAlign="center"
                justifyContent="center"
                key={i}
              >
                <Cards
                  candidate={can}
                  starAllowance={starAllowance}
                  setStarAllowance={setStarAllowance}
                  incrementButtonsDisabled={incrementButtonsDisabled}
                />
              </Grid>
            ))}
          </div>
        ) : (
          <>loading...</>
        )}
      </main>
    </div>
  );
};

export default Challenge;
