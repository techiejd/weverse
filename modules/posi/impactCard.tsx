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
import ShareActionArea from "../../common/components/shareActionArea";
import QuickStats from "./impactPage/QuickStats";
import { PosiFormData, getPosiPage, getShareProps } from "./input/context";

const ImpactCard = ({ posiData }: { posiData: PosiFormData }) => {
  return (
    <Card sx={{ width: "100%" }}>
      <CardActionArea href={`/posi/${posiData.id}/about`}>
        <CardMedia
          component="video"
          sx={{ height: 180, objectFit: "cover" }}
          image={posiData.video}
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
              <Typography ml={1}>🤳</Typography>
              <Typography ml={2}>0</Typography>
            </Stack>
            <Rating value={null} readOnly />
          </Stack>
          <QuickStats
            impactedPeopleAmount={posiData.impactedPeople.amount}
            investedTimeLevel={posiData.investedTimeLevel}
          />
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          size="small"
          variant="contained"
          href={getPosiPage(posiData.id)}
        >
          Aprender más
        </Button>
        <ShareActionArea shareProps={getShareProps(posiData)}>
          <Button size="small">Share</Button>
        </ShareActionArea>
      </CardActions>
    </Card>
  );
};

export default ImpactCard;
