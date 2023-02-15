import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useVotingState } from "./votingExperience/context";
import { Candidate, Reporter } from "./votingExperience/votingExperience";
import board from "../../../../public/board.jpeg";
type ReporterScore = {
  totalVotes: number;
  candidates: {
    name: string;
    totalVotes: number;
  }[];
};
const countVotes = (
  acc: Record<Reporter, ReporterScore | undefined>,
  curCandidate: Candidate
) => {
  const sumVotes = curCandidate.sum ? curCandidate.sum : 0;
  if (
    curCandidate.reporter &&
    curCandidate.reporter &&
    acc[curCandidate.reporter] != undefined
  ) {
    return {
      ...acc,
      [curCandidate.reporter]: {
        totalVotes: acc[curCandidate.reporter]!.totalVotes + sumVotes,
        candidates: acc[curCandidate.reporter]!.candidates.push({
          name: curCandidate.name,
          totalVotes: sumVotes,
        }),
      },
    };
  }
  return acc;
};

const byVotes = (
  [reporterA, scoreA]: [string, ReporterScore | undefined],
  [reporterB, scoreB]: [string, ReporterScore | undefined]
) => {
  if (scoreA == undefined) {
    if (scoreB == undefined) {
      return 0;
    }
    return 1;
  }
  if (scoreB == undefined) {
    return -1;
  }
  return scoreB.totalVotes - scoreA.totalVotes;
};

const Finale = () => {
  const votingState = useVotingState();
  return (
    <Box>
      <Image src={board} />
      {votingState?.candidates &&
        Object.entries(
          Object.values(votingState.candidates).reduce(
            countVotes,
            {} as Record<Reporter, ReporterScore | undefined>
          )
        )
          .sort(byVotes)
          .map(([reporter, score], idx) => {
            return (
              <Box key={idx}>
                <Typography>
                  #{idx} = {reporter}{" "}
                </Typography>
                <Typography>{score ? score.totalVotes : 0}</Typography>
                {score?.candidates.map(({ name, totalVotes }, cIdx) => {
                  return (
                    <Typography key={cIdx}>
                      {" "}
                      #{cIdx} = {name}: {totalVotes}
                    </Typography>
                  );
                })}
              </Box>
            );
          })}
      <Typography>Hello wooddddrld</Typography>
    </Box>
  );
};

export default Finale;
