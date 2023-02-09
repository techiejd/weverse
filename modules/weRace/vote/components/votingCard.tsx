import { useState, useEffect } from "react";
import { Candidate, Media } from "../../../../modules/sofia/schemas";
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

const noPagesPublicInfoFix1Url =
  // Yesica
  "302143605_5567605466660981_6489124609017351362";
const noPagesPublicInfoFix2Url =
  // Camila
  "9680260426559922442";
const pagesPublicInfoFixImages = [
  [noPagesPublicInfoFix1Url, "/yessica_hack.png"],
  [noPagesPublicInfoFix2Url, "/camila_hack.png"],
];

const getMessage = (candidate: Candidate) => {
  //TODO(techiejd): Make better plumbing for links.
  let message = candidate.message;
  if (candidate.link) {
    message = `${message}

Ver mas acá: ${candidate.link}`;
  }
  return message;
};

const VotingCard: React.FC<{
  candidate: Candidate;
  starAllowance: number;
  setStarAllowance: React.Dispatch<React.SetStateAction<number>>;
  incrementButtonsDisabled: boolean;
  candidate2Votes: Record<string, number>;
  setCandidate2Votes: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
  canModifyStarAllowance: boolean;
  setCanModifyStarAllowance: React.Dispatch<React.SetStateAction<boolean>>;
}> = (props) => {
  const [count, setCount] = useState(0);
  const [decrementButtonDisabled, setDecrementButtonDisabled] = useState(false);
  const [message, setMessage] = useState(<></>);
  useEffect(
    () =>
      setMessage(
        <ReactMarkdown remarkPlugins={[remarkGfm]} linkTarget="_blank">
          {String(getMessage(props.candidate))}
        </ReactMarkdown>
      ),
    [props.candidate]
  );
  useEffect(() => {
    setDecrementButtonDisabled(count === 0);
    props.setCandidate2Votes({
      ...props.candidate2Votes,
      [props.candidate.id]: count,
    });
    //TODO(techiejd): switch to use reducer to fix dependency list issues.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);
  const IncNum = () => {
    if (props.canModifyStarAllowance) {
      props.setCanModifyStarAllowance(false);
      props.setStarAllowance(props.starAllowance - 1);
      setCount(count + 1);
    }
  };
  const DecNum = () => {
    if (props.canModifyStarAllowance) {
      props.setCanModifyStarAllowance(false);
      props.setStarAllowance(props.starAllowance + 1);
      setCount(count - 1);
    }
  };

  const getFixedImage = (media: Media) => {
    //TODO(techiejd): Fix issues with images and videos without permissions.
    const fixedImageInfo = pagesPublicInfoFixImages.find((fixInfo) =>
      String(media.image).includes(fixInfo[0])
    );
    return fixedImageInfo ? fixedImageInfo[1] : undefined;
  };
  const getSrc = (media: Media) => {
    const fixedImage = getFixedImage(media);
    if (fixedImage) {
      return fixedImage;
    }
    if (media.type?.startsWith("video") && media.source) {
      return String(media.source);
    }

    return String(media.image);
  };
  const getType = (media: Media) => {
    if (getFixedImage(media)) {
      return "img";
    }
    if (media.type?.startsWith("video") && media.source) {
      return "video";
    }
    return "img";
  };

  return (
    <Card
      sx={{ maxWidth: 700, mt: 5 }}
      variant="outlined"
      style={{
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
                component={getType(m)}
                height="400px"
                max-width="650px"
                src={getSrc(m)}
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
      <CardContent>{message}</CardContent>
      <h1>🌟</h1>
      <CardActions style={{ justifyContent: "center" }}>
        <Tooltip title="Delete">
          <Button
            onClick={DecNum}
            disabled={decrementButtonDisabled}
            style={{
              borderRadius: 15,

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
