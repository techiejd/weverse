import { useState, useEffect } from "react";
import { Candidate, Media, VotesRes } from "../../modules/sofia/schemas";
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
import Container from "@mui/material/Container";

const Cards = (props: { candidate: Candidate }) => {
  const [can, setCan] = useState<Candidate | undefined>();
  const [count, setCount] = useState(0);
  const IncNum = () => {
    setCount(count + 1);
  };
  const DecNum = () => {
    if (count > 0) setCount(count - 1);
    else {
      setCount(0);
      alert("min limit reached");
    }
  };
  useEffect(() => {
    setCan(props.candidate);
    console.log("can", can);
  }, []);

  return (
    <Container fixed>
      <Card sx={{ maxWidth: 500, mt: 5 }} variant="outlined">
        {can ? (
          <>
            {can.medias ? (
              <>
                <Carousel>
                  {can.medias.map((m, i) => (
                    <CardMedia
                      component="img"
                      max-height="200px"
                      width="100px"
                      // height={m.height}
                      image={m.image}
                      alt="green iguana"
                      key={i}
                    />
                  ))}
                </Carousel>
              </>
            ) : (
              <></>
            )}
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {can.message}
              </Typography>
            </CardContent>
            <h1>Estrellas</h1>
            <CardActions>
              <Tooltip title="Delete">
                <Button onClick={DecNum}>
                  <RemoveIcon color="action" />
                </Button>
              </Tooltip>
              <h1>{count}</h1>
              <Button onClick={IncNum}>
                <AddIcon color="action" />
              </Button>
            </CardActions>
          </>
        ) : (
          <>loading...</>
        )}
      </Card>
    </Container>
  );
};

export default Cards;
