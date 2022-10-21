import { useState, useEffect } from "react";
import { Candidate } from "../../../../modules/sofia/schemas";
import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Carousel from "react-material-ui-carousel";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const VotingCard: React.FC<{
  candidate: Candidate;
  starAllowance: number;
  setStarAllowance: React.Dispatch<React.SetStateAction<number>>;
  incrementButtonsDisabled: boolean;
  candidate2Votes: Record<string, number>;
  setCandidate2Votes: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
}> = (props) => {
  const [count, setCount] = useState(0);
  const [decrementButtonDisabled, setDecrementButtonDisabled] = useState(false);
  useEffect(() => {
    setDecrementButtonDisabled(count === 0);
    props.setCandidate2Votes({
      ...props.candidate2Votes,
      [props.candidate.id]: count,
    });
  }, [count]);
  const IncNum = () => {
    props.setStarAllowance(props.starAllowance - 1);
    setCount(count + 1);
  };
  const DecNum = () => {
    props.setStarAllowance(props.starAllowance + 1);
    setCount(count - 1);
  };

  return (
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
      {props.candidate.medias ? (
        <>
          <Carousel>
            {props.candidate.medias.map((m, i) => (
              <CardMedia
                component="img"
                height="400px"
                max-width="650px"
                image={m.image}
                alt="green iguana"
                key={i}
                sx={{ objectFit: "contain" }}
              />
            ))}
          </Carousel>
        </>
      ) : (
        <></>
      )}
      <CardContent>
        <Typography variant="body2" color="common.white">
          {props.candidate.message}
        </Typography>
      </CardContent>
      <h1>🌟</h1>
      <CardActions style={{ justifyContent: "center" }}>
        <Tooltip title="Delete">
          <Button
            onClick={DecNum}
            disabled={decrementButtonDisabled}
            style={{
              borderRadius: 15,
              backgroundColor: "grey",
              marginRight: "15px",
              fontSize: "10px",
            }}
          >
            <RemoveIcon color="action" />
          </Button>
        </Tooltip>
        <h1>{count}</h1>
        <Button
          onClick={IncNum}
          disabled={props.incrementButtonsDisabled}
          style={{
            borderRadius: 15,
            backgroundColor: "grey",
            marginLeft: "15px",
            fontSize: "10px",
          }}
        >
          <AddIcon color="action" />
        </Button>
      </CardActions>
    </Card>
  );
};

export default VotingCard;
