import {
  Box,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  useVotingState,
  useVotingDispatch,
  VotingActionType,
} from "../context";
import { VotingBar } from "./votingBar";
import CloseIcon from "@mui/icons-material/Close";
import CandidateMedia from "./candidateMedia";
import { Candidate } from "../votingExperience";

const ExplanationBox = (props: { title: string; text: string }) => {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: "10px",
        }}
      >
        {props.title}
      </Typography>
      <Typography
        sx={{
          fontSize: "16px",
        }}
      >
        {props.text}
      </Typography>
    </Box>
  );
};

const Impact = (props: Candidate) => {
  return (
    <Stack divider={<Divider flexItem />} spacing={2}>
      <Box
        sx={{
          borderRadius: 4,
          height: "406px",
          width: "100%",
        }}
      >
        {props.video ? (
          <CandidateMedia
            video={{
              threshold: 0.9,
              muted: false,
              controls: true,
              controlsList:
                "play volume fullscreen nodownload noplaybackrate notimeline",
              disablePictureInPicture: true,
              src: props.video,
            }}
          />
        ) : (
          <CandidateMedia image={{ src: props.image! }} />
        )}
      </Box>
      {props.location && (
        <ExplanationBox title="📍 Ubicación" text={props.location} />
      )}
      {props.reporter && (
        <ExplanationBox title="📸 Reportero" text={props.reporter} />
      )}
      {props.tags && (
        <ExplanationBox title="✨ Áreas de impacto" text={props.tags} />
      )}
      {props.summary && (
        <ExplanationBox title="📝 Summary" text={props.summary} />
      )}
    </Stack>
  );
};

const FocusedCandidateDialog = () => {
  const votingState = useVotingState();
  const votingDispatch = useVotingDispatch();

  const closeCandidate = () => {
    if (votingDispatch)
      votingDispatch({
        type: VotingActionType.get,
        filteredOnMyVotes: votingState?.filteredOnMyVotes,
        candidateId: undefined,
      });
  };

  return (
    <Dialog
      open={votingState?.focusedCandidate != undefined}
      onClose={closeCandidate}
      scroll="paper"
      disableEnforceFocus
    >
      <DialogTitle>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "18px",
              }}
            >
              {
                votingState?.candidates[String(votingState?.focusedCandidate)]
                  ?.name
              }
            </Typography>
            {votingState?.candidates[String(votingState?.focusedCandidate)]
              ?.rank && (
              <Typography variant="h3" sx={{ fontSize: "14px" }}>
                🏁 #{" "}
                {
                  votingState?.candidates[String(votingState?.focusedCandidate)]
                    ?.rank
                }
              </Typography>
            )}
          </Box>
          <IconButton onClick={closeCandidate}>
            <CloseIcon color="secondary" />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        {votingState?.candidates[String(votingState?.focusedCandidate)] && (
          <Impact
            {...votingState?.candidates[String(votingState?.focusedCandidate)]}
          />
        )}
      </DialogContent>
      <DialogActions sx={{}}>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <VotingBar
            sx={{
              height: "48px",
              width: "144px",
            }}
            candidateId={votingState!.focusedCandidate!}
          ></VotingBar>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default FocusedCandidateDialog;
