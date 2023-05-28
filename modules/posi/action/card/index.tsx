import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { PosiFormData } from "../../../../functions/shared/src";
import Media from "../../media";
import OverlayInfo from "./overlayInfo";
import RatingsStack from "../../../../common/components/ratings";

const ImpactCard = ({ posiData }: { posiData: PosiFormData }) => {
  const media =
    posiData.media.type == "video"
      ? {
          video: {
            threshold: 0.9,
            muted: true,
            disablePictureInPicture: true,
            src: posiData.media.url,
            controls: false,
            objectFit: "cover" as "cover",
          },
        }
      : { image: { src: posiData.media.url } };
  return (
    <Card
      sx={{
        width: "100%",
        p: 1,
        borderRadius: 2,
      }}
      elevation={5}
    >
      <CardActionArea href={`/posi/${posiData.id}`}>
        <Box
          sx={{
            width: "100%",
            height: "50vh",
            borderRadius: 3,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <Media {...media} />
          </Box>
          <OverlayInfo action={posiData} />
        </Box>
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            sx={{
              textAlign: "justify",
              textJustify: "inter-word",
              fontSize: 18,
            }}
          >
            {posiData.summary}
          </Typography>
          <RatingsStack ratings={posiData.ratings} />
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ImpactCard;
