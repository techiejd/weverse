import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import ShareActionArea from "../../../common/components/shareActionArea";
import { getPosiPage, getSharePropsForPosi } from "../input/context";
import { PosiFormData } from "../../../functions/shared/src";
import RatingsStack from "../../../common/components/ratings";
import Media, { VideoProps } from "../media";

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
    <Card sx={{ width: "100%" }}>
      <CardActionArea href={`/posi/${posiData.id}`}>
        <Box
          sx={{
            height: "50vh",
            width: "100%",
          }}
        >
          <Media {...media} />
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
      <CardActions>
        <Button
          size="small"
          variant="contained"
          href={getPosiPage(posiData.id)}
        >
          Conoce más
        </Button>
        <ShareActionArea
          shareProps={getSharePropsForPosi({
            summary: posiData.summary!,
            id: posiData.id,
          })}
        >
          <Button size="small">Comparte</Button>
        </ShareActionArea>
      </CardActions>
    </Card>
  );
};

export default ImpactCard;
