import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState, useEffect, MouseEvent } from "react";
import { pickBy, identity } from "lodash";
import Grid from "@mui/material/Grid";
import {
  Candidate,
  Media,
  media as mediaSchema,
} from "../../../../modules/sofia/schemas";
import styles from "../../../../styles/Home.module.css";
import { getUserSnapshot } from "../../../../common/db";
import {
  getFlattenedPaginatedData,
  GroupHandler,
} from "../../../../modules/facebook/utils";
import {
  Post,
  attachment as attachmentSchema,
} from "../../../../modules/facebook/schemas";
import VotingCard from "./votingCard";
import votestyles from "../../../../styles/vote.module.css";

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
  const weRace = String(context.query?.weRace);
  const psid = String(context.query?.psid);
  const submitToLink = `/api/weRace/${weRace}/vote/${psid}`;
  console.log(submitToLink);

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

    return {
      props: {
        candidates: candidates,
        starAllowance: 5,
        psid: psid,
        submitLink: submitToLink,
      },
    };
  });
};

const Vote: NextPage<{
  psid: string;
  starAllowance: number;
  candidates: Array<Candidate>;
  submitLink: string;
}> = (props) => {
  const candidates = props.candidates;
  const [canModifyStarAllowance, setCanModifyStarAllowance] = useState(true);
  const [starAllowance, setStarAllowance] = useState<number>(
    props.starAllowance
  );
  const [candidate2Votes, setCandidate2Votes] = useState<
    Record<string, number>
  >({});
  const [incrementButtonsDisabled, setIncrementButtonsDisabled] =
    useState<boolean>(false);
  useEffect(() => {
    setIncrementButtonsDisabled(starAllowance <= 0);
    setCanModifyStarAllowance(true);
  }, [starAllowance]);
  const router = useRouter();
  const submitVotes = (e: MouseEvent) => {
    e.preventDefault();

    const body = (() => {
      const filteredVotes = Object.entries(candidate2Votes).filter(
        ([candidate, votes]) => votes > 0
      );
      const body = {
        psid: props.psid,
        votes: Object.fromEntries(filteredVotes),
      };
      return JSON.stringify(body);
    })();
    const response = fetch("/api/admin", {
      method: "POST",
      body,
    });

    router.push("/admin/success");

    return true;
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={votestyles.vote}>
          <div className={votestyles.stars}>
            <h1> Tienes 🌟:{starAllowance} Votos </h1>
          </div>
          {candidates.map((can, i) => (
            <Grid
              container
              spacing={0}
              direction="column"
              textAlign="center"
              justifyContent="center"
              key={i}
            >
              <VotingCard
                candidate={can}
                starAllowance={starAllowance}
                setStarAllowance={setStarAllowance}
                incrementButtonsDisabled={incrementButtonsDisabled}
                candidate2Votes={candidate2Votes}
                setCandidate2Votes={setCandidate2Votes}
                canModifyStarAllowance={canModifyStarAllowance}
                setCanModifyStarAllowance={setCanModifyStarAllowance}
              />
            </Grid>
          ))}
        </div>
        <button
          id={votestyles.mybutton}
          className={votestyles.buttonFixed}
          onClick={submitVotes}
        >
          Votar
        </button>
      </main>
    </div>
  );
};

export default Vote;
