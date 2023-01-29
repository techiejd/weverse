import { useState, useEffect } from "react";
import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Carousel from "react-material-ui-carousel";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Player } from "video-react";
import { VotingAction, VotingActionType, VotingState } from "../reducer";

const VotingCard: React.FC<{
  voteDispatch: React.Dispatch<VotingAction>;
  votingState: VotingState;
}> = (props) => {
  const [count, setCount] = useState(0);
  const [decrementButtonDisabled, setDecrementDisabled] = useState(true);
  const id = "I'mAnIDTrustMe";

  useEffect(() => {
    setDecrementDisabled(count === 0);
  }, [count]);

  const increment = () => {
    setCount(count + props.votingState.step);
    props.voteDispatch({
      type: VotingActionType.increment,
      candidateId: id,
    });
  };
  const decrement = () => {
    setCount(count - props.votingState.step);
    props.voteDispatch({
      type: VotingActionType.decrement,
      candidateId: id,
    });
  };
  return (
    <Card
      variant="outlined"
      style={{
        backgroundColor: "black",
        color: "white",
        borderColor: "white",
        borderRadius: "15px",
        height: "45vh",
      }}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <CardMedia
        component="video"
        src="/ana14s.mp4"
        sx={{ objectFit: "contain", height: 1 / 2 }}
      />

      <p>{props.votingState.prepend}</p>
      <CardActions style={{ justifyContent: "center" }} sx={{ flexGrow: 1 }}>
        <Button
          onClick={decrement}
          disabled={decrementButtonDisabled}
          style={{
            borderRadius: 15,
            backgroundColor: "grey",
          }}
          size="small"
        >
          <RemoveIcon color="action" fontSize="small" />
        </Button>
        <p>{count}</p>
        <Button
          onClick={increment}
          disabled={props.votingState.incrementDisabled}
          style={{
            borderRadius: 15,
            backgroundColor: "grey",
          }}
          size="small"
        >
          <AddIcon color="action" fontSize="small" />
        </Button>
      </CardActions>
    </Card>
  );
};

export default VotingCard;
