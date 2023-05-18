import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import ShareActionArea from "../../../common/components/shareActionArea";
import { getPosiPage, getSharePropsForPosi } from "../input/context";
import { PosiFormData } from "../../../functions/shared/src";
import RatingsStack from "../../../common/components/ratings";

const ImpactCard = ({ posiData }: { posiData: PosiFormData }) => {
  return (
    <Card sx={{ width: "100%" }}>
      <CardActionArea href={`/posi/${posiData.id}`}>
        <CardMedia
          component={posiData!.media!.type!}
          sx={{ height: 270, objectFit: "cover" }}
          image={posiData!.media!.url}
          autoPlay
          muted
          loop
        />
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
