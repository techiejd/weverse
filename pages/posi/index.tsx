import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Fab,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { posiFormData, PosiFormData } from "../../modules/posi/input/context";
import { getDocs, collection } from "firebase/firestore";
import { useAppState } from "../../common/context/appState";
import QuickStats from "../../modules/posi/impactPage/QuickStats";

const ImpactCard = ({ posiData }: { posiData: PosiFormData }) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="video"
        sx={{ height: 140 }}
        image={posiData.video}
        autoPlay
        muted
        loop
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          sx={{ textAlign: "justify", textJustify: "inter-word", fontSize: 20 }}
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
      <CardActions>
        <Button size="small" variant="contained">
          Learn More
        </Button>
        <Button size="small">Share</Button>
      </CardActions>
    </Card>
  );
};

const Index = () => {
  //TODO(techiejd): Decouple the form data input from the impacts db output.
  //For example, maker info can go into a different collection.
  const [impacts, setImpacts] = useState<PosiFormData[]>([]);
  const appState = useAppState();
  useEffect(() => {
    if (appState) {
      const getImpacts = async () => {
        const querySnapshot = await getDocs(
          collection(appState.firestore, "impacts")
        );
        setImpacts(
          querySnapshot.docs.map((docSnapshot) => {
            const data = docSnapshot.data();
            console.log(data.dates);
            const dataDecoded = {
              ...data,
              dates: {
                start: new Date(data.dates.start.seconds * 1000),
                end: new Date(data.dates.end.seconds * 1000),
              },
            };
            console.log(dataDecoded.dates.start);
            return posiFormData.parse(dataDecoded);
          })
        );
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
        });
      };
      getImpacts();
    }
  }, [appState, setImpacts]);

  return (
    <Box>
      <Stack
        sx={{ alignItems: "center", justifyContent: "center", m: 1 }}
        spacing={1}
      >
        {impacts.map((impact, i) => (
          <ImpactCard key={i} posiData={impact} />
        ))}
      </Stack>
      <Fab
        variant="extended"
        sx={{
          position: "fixed",
          bottom: 64,
          right: 16,
        }}
        href="/posi/upload"
        color="primary"
      >
        <AddIcon sx={{ mr: 1 }} />
        <Typography>Agrega tu impacto!</Typography>
      </Fab>
    </Box>
  );
};

export default Index;
