import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useWeRaceVoteState } from "../context";
import { ComparativeCard } from "./candidate/comparativeCard";
import { useVotingState } from "./context";
import VotingExperience, {
  CandidatesById,
  VotingExperienceInfo,
} from "./votingExperience";

const ComparativeContent = ({
  candidates,
  filterOnInterests,
}: {
  candidates: CandidatesById;
  filterOnInterests: string[];
}) => {
  const votingState = useVotingState();
  const [randomizedCandidates, setRandomizedCandidates] = useState(
    Object.entries(candidates)
  );
  /*
  TODO(techiejd): Look into randomizing bug or removing feature.
  useEffect(() => {
    // Randomizing - https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    setRandomizedCandidates((r) =>
      r
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
    );
  }, [candidates]);*/
  return (
    <Grid container spacing={1}>
      {randomizedCandidates
        .filter(([id, candidate]) => {
          // Filtering on my votes
          if (votingState) {
            if (!votingState.filteredOnMyVotes) {
              return true;
            }
            return votingState.votes[id] > 0;
          }
          return true;
        })
        .filter(([id, candidate]) => {
          // Filtering on my interests
          if (filterOnInterests.length == 0) return true;
          return filterOnInterests.some((interest) =>
            candidate.tags?.match(interest)
          );
        })
        .map(([id, candidate]) => (
          <Grid item sm={6} md={4} lg={2} xl={1} key={id}>
            <ComparativeCard candidate={candidate} height="277px" />
          </Grid>
        ))}
    </Grid>
  );
};

const ComparativeVotingExperience = (props: VotingExperienceInfo) => {
  //TODO(techiejd): Do setting of interests somewhere else
  const [interests, setInterests] = useState<string[]>([]);
  const voteState = useWeRaceVoteState();

  useEffect(() => {
    if (voteState?.votes?.interests) {
      setInterests(Object.keys(voteState?.votes?.interests));
    }
  }, [voteState?.votes?.interests]);

  return (
    <VotingExperience {...props}>
      <ComparativeContent
        candidates={props.votingState.candidates}
        filterOnInterests={interests}
      />
    </VotingExperience>
  );
};

export default ComparativeVotingExperience;
