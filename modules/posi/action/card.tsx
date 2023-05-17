import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  Divider,
  Rating,
  CardActions,
  Button,
} from "@mui/material";
import ShareActionArea from "../../../common/components/shareActionArea";
import { getPosiPage, getSharePropsForPosi } from "../input/context";
import { PosiFormData, posiFormData } from "shared";

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
          <Stack
            direction={"row"}
            spacing={2}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Stack direction={"row"}>
              <Typography ml={1} mr={2}>
                💥
              </Typography>
              <Typography color={"grey"}>Impacto:</Typography>
              <Typography ml={2}>0</Typography>
            </Stack>
            <Rating value={null} readOnly />
          </Stack>
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
