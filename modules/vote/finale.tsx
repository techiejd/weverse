import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { Candidate, Reporter } from "./votingExperience/votingExperience";
import board from "../../public/board.jpeg";
import { useVoteState } from "./context";
import { useMemo, useState } from "react";
import { impacts } from "./hardcoded";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { logger } from "../../common/utils/logger";
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
  logger.info(acc);
  logger.info(curCandidate);
  const sumVotes = curCandidate.sum ? curCandidate.sum : 0;
  if (curCandidate.reporter) {
    return acc[curCandidate.reporter]
      ? {
          ...acc,
          [curCandidate.reporter]: {
            totalVotes: acc[curCandidate.reporter]!.totalVotes + sumVotes,
            candidates: acc[curCandidate.reporter]!.candidates.concat([
              {
                name: curCandidate.name,
                totalVotes: sumVotes,
              },
            ]),
          },
        }
      : {
          ...acc,
          [curCandidate.reporter]: {
            totalVotes: sumVotes,
            candidates: [
              {
                name: curCandidate.name,
                totalVotes: sumVotes,
              },
            ],
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

const ReporterListItem = (props: {
  rank: number;
  reporter: string;
  score?: ReporterScore;
}) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <>
      <ListItem>
        <ListItemIcon>
          <Typography>#{props.rank}</Typography>
        </ListItemIcon>
        <ListItemText
          primary={props.reporter}
          secondary={
            <Typography fontSize="12px">
              Este reportero directamente ha ayudado al impacto recibir:{" "}
              <b> {props.score ? props.score.totalVotes * 1000 : 0}</b>
            </Typography>
          }
        />
        {props?.score?.candidates && (
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemIcon>
          </ListItemButton>
        )}
      </ListItem>
      {props?.score?.candidates && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div">
            {props.score.candidates.map((candidate, i) => {
              return (
                <ListItem sx={{ pl: 6 }} key={i}>
                  <ListItemText
                    primary={
                      <Typography fontSize="16px">{candidate.name}</Typography>
                    }
                    secondary={`total votes: ${candidate.totalVotes}`}
                  />
                </ListItem>
              );
            })}
          </List>
        </Collapse>
      )}
    </>
  );
};

const Finale = () => {
  const voteState = useVoteState();
  const reporterScores: [string, ReporterScore][] = useMemo(() => {
    if (voteState?.ended) {
      const reporterScores = Object.entries(
        impacts.reduce((acc, impact) => {
          const reporter = impact.reporter!;
          const impactVotes = voteState?.ended?.votes[impact.id]
            ? voteState?.ended?.votes[impact.id]
            : 0;
          logger.info(impactVotes);
          const prevReporterScore = acc[reporter];
          const prevVotes = prevReporterScore
            ? prevReporterScore.totalVotes
            : 0;
          const prevCandidates = prevReporterScore
            ? prevReporterScore.candidates
            : [];
          return {
            ...acc,
            [reporter]: {
              totalVotes: prevVotes + impactVotes,
              candidates: prevCandidates.concat([
                { name: impact.name, totalVotes: impactVotes },
              ]),
            },
          };
        }, {} as Record<Reporter, ReporterScore | undefined>)
      );
      return reporterScores.map(([reporter, score]) => [
        reporter,
        score ? score : { totalVotes: 0, candidates: [] },
      ]);
    } else return [];
  }, [voteState?.ended]);

  return (
    <Box>
      <Typography variant="h1" fontSize={"40px"}>
        Voting has concluded!
      </Typography>
      <br />
      <Typography variant="h2" fontSize={"32px"}>
        See the results below.
      </Typography>
      <br />
      <Image src={board} />
      <br />
      <Paper>
        <List>
          {reporterScores.sort(byVotes).map(([reporter, score], idx) => {
            return (
              <div key={idx}>
                <ReporterListItem
                  rank={idx + 1}
                  reporter={reporter}
                  score={score}
                />
              </div>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
};

export default Finale;
