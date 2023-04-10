import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  Fab,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  castFirestoreDocToPosiFormData,
  PosiFormData,
  getShareProps,
  getPosiPage,
} from "../../modules/posi/input/context";
import { getDocs, collection } from "firebase/firestore";
import { useAppState } from "../../common/context/appState";
import QuickStats from "../../modules/posi/impactPage/QuickStats";
import { PlusOne } from "@mui/icons-material";
import ShareActionArea from "../../common/components/shareActionArea";

const ImpactCard = ({
  posiData,
  id,
}: {
  posiData: PosiFormData;
  id: string;
}) => {
  return (
    <Card sx={{ width: "100%" }}>
      <CardActionArea href={`/posi/${id}/about`}>
        <CardMedia
          component="video"
          sx={{ height: 180 }}
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
        <Button size="small" variant="contained" href={getPosiPage(id)}>
          Aprender más
        </Button>
        <ShareActionArea shareProps={getShareProps(posiData, id)}>
          <Button size="small">Share</Button>
        </ShareActionArea>
      </CardActions>
    </Card>
  );
};

const Index = () => {
  //TODO(techiejd): Decouple the form data input from the impacts db output.
  //For example, maker info can go into a different collection.
  const [impactsAndIds, setImpactsAndIds] = useState<[string, PosiFormData][]>(
    []
  );
  const appState = useAppState();
  useEffect(() => {
    if (appState) {
      const getImpacts = async () => {
        const querySnapshot = await getDocs(
          collection(appState.firestore, "impacts")
        );
        setImpactsAndIds(
          querySnapshot.docs.map((docSnapshot) => {
            const data = docSnapshot.data();
            return [docSnapshot.id, castFirestoreDocToPosiFormData.parse(data)];
          })
        );
      };
      getImpacts();
    }
  }, [appState, setImpactsAndIds]);

  return (
    <Box mb={9}>
      <Stack
        sx={{ alignItems: "center", justifyContent: "center", m: 1 }}
        spacing={1}
      >
        <Typography variant="h1" justifyContent={"center"}>
          📺 <b>We</b>Screen
        </Typography>
        {impactsAndIds.length == 0 ? (
          <CircularProgress />
        ) : (
          impactsAndIds.map(([id, impact], i) => (
            <ImpactCard key={i} posiData={impact} id={id} />
          ))
        )}
      </Stack>
      <Fab
        variant="extended"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        href="/posi/upload"
        color="primary"
      >
        <PlusOne sx={{ mr: 1 }} />
        <Typography>Agrega tu impacto!</Typography>
      </Fab>
    </Box>
  );
};

export default Index;
