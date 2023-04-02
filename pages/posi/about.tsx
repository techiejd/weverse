import {
  Box,
  Typography,
  Stack,
  Card,
  Divider,
  CardHeader,
  CardContent,
  Avatar,
  Icon,
} from "@mui/material";
import ImpactPage, { PageTypes } from "../../modules/posi/impactPage";
import CandidateMedia from "../../modules/vote/votingExperience/candidate/candidateMedia";
import {
  InvestedTimeLevel,
  levelToColors,
  posiFormData,
} from "../../modules/posi/input/context";
import {
  Assessment,
  EmojiPeople,
  Info,
  PlayCircle,
  SentimentVerySatisfied,
  Summarize,
  Timer,
} from "@mui/icons-material";
import { PillBoxMessage } from "../../common/components/pillBoxMessage";
import moment from "moment";
import Support from "../../modules/posi/impactPage/about/Support";

const posiData = posiFormData.parse({
  summary: "We taught about AI to and inspired with AI 150 kids.",
  impactedPeople: { amount: 329, howToIdentify: "asdfasdf" },
  investedTimeLevel: 3,
  tags: ["ambiente", "genero"],
  location: {
    id: "ChIJBa0PuN8oRI4RVju1x_x8E0I",
    structuredFormatting: {
      mainText: "Medellín",
      secondaryText: "Medellin, Antioquia, Colombia",
    },
    terms: [
      { offset: 0, value: "Medellín" },
      { offset: 10, value: "Medellin" },
      { offset: 20, value: "Antioquia" },
      { offset: 31, value: "Colombia" },
    ],
    types: ["locality", "political", "geocode"],
  },
  dates: {
    start: new Date("2023-03-06T05:00:00.000Z"),
    end: new Date("2023-03-09T05:00:00.000Z"),
  },
  video:
    "https://firebasestorage.googleapis.com/v0/b/weverse-72d95.appspot.com/o/80b2388e-18c6-41bc-b9e9-c81ae7039c54?alt=media&token=173fa22e-44d7-4f2d-92f8-338f3ca4584b",
  maker: {
    type: "individual",
    pic: "https://firebasestorage.googleapis.com/v0/b/weverse-72d95.appspot.com/o/d9c331f6-1210-41d7-a41f-8e3db84e75fe?alt=media&token=d771ecf3-719b-4bf7-8431-91104499c685",
    name: "adfasdf",
  },
  about: "aldkjfalksdjf",
  howToSupport: {
    contact: "Instagram - whatsgoodjd@ \n Calendar - calendar.google.com",
    finance: "https://paypal.me/jdavid10001",
  },
});

const QuickStats = ({
  impactedPeopleAmount,
  investedTimeLevel,
}: {
  impactedPeopleAmount: number;
  investedTimeLevel: InvestedTimeLevel;
}) => {
  //TODO(techiejd): Look into splitting this into different stats.
  return (
    <Stack>
      <Stack direction={"row"} spacing={2}>
        <Icon>
          <EmojiPeople />
        </Icon>
        <Typography>{impactedPeopleAmount}</Typography>
      </Stack>
      <Stack direction={"row"}>
        <Icon sx={{ mr: 2 }}>
          <Timer />
        </Icon>
        <Box
          sx={{
            backgroundColor: levelToColors[investedTimeLevel],
            width: investedTimeLevel / InvestedTimeLevel.year,
          }}
        >
          <Typography>{InvestedTimeLevel[investedTimeLevel]}</Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "grey",
            width: 1 - investedTimeLevel / InvestedTimeLevel.year,
          }}
        ></Box>
      </Stack>
    </Stack>
  );
};

const AboutContent = () => {
  const dateFormat = "DD/MM/YY";
  return (
    <Box>
      <Box sx={{ boxShadow: 1 }} padding={1}>
        <Typography
          variant="h1"
          fontSize={35}
          sx={{ textAlign: "justify", textJustify: "inter-word" }}
        >
          {posiData.summary}
        </Typography>{" "}
      </Box>
      <Stack divider={<Divider flexItem />} spacing={1} m={1.5}>
        <Card>
          <CardHeader
            avatar={
              <Icon>
                <PlayCircle />
              </Icon>
            }
            title={"Video"}
          />
          <Box
            sx={{
              height: "50vh",
              width: "100%",
            }}
          >
            <CandidateMedia
              video={{
                threshold: 0.9,
                muted: false,
                controls: true,
                controlsList:
                  "play volume fullscreen nodownload noplaybackrate notimeline",
                disablePictureInPicture: true,
                src: posiData.video,
              }}
            />
          </Box>
        </Card>
        <Card>
          <CardHeader
            avatar={
              <Icon>
                <Info />
              </Icon>
            }
            title={"Info Rapída"}
          />
          <CardContent>
            <Stack spacing={2}>
              <Stack
                direction={"row"}
                spacing={2}
                divider={<Divider orientation="vertical" flexItem />}
              >
                <Stack>
                  <Typography variant="h3">
                    {posiData.location.structuredFormatting.mainText}
                  </Typography>
                  <Typography fontSize={10}>
                    {posiData.location.structuredFormatting.secondaryText}
                  </Typography>
                </Stack>
                <Typography variant="h3">
                  {moment(posiData.dates.start).format(dateFormat)} -{" "}
                  {moment(posiData.dates.end).format(dateFormat)}
                </Typography>
              </Stack>
              <QuickStats
                impactedPeopleAmount={posiData.impactedPeople.amount}
                investedTimeLevel={posiData.investedTimeLevel}
              />
              <Box alignItems={"normal"} width={"100%"} display={"flex"}>
                {posiData.tags.map((tag) => (
                  <PillBoxMessage key={tag} sx={{ m: 1 }}>
                    #{tag}
                  </PillBoxMessage>
                ))}
              </Box>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardHeader
            avatar={
              <Icon>
                <SentimentVerySatisfied />
              </Icon>
            }
            title={"Maker"}
          />
          <CardContent>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Avatar src={posiData.maker.pic} />
              <Typography>{posiData.maker.name}</Typography>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardHeader
            avatar={
              <Icon>
                <Summarize />
              </Icon>
            }
            title={"Integro"}
          />
          <CardContent>
            <Typography>{posiData.about}</Typography>
          </CardContent>
        </Card>
      </Stack>
      <Support howToSupport={posiData.howToSupport} />
    </Box>
  );
};

const About = () => {
  return (
    <ImpactPage
      type={PageTypes.about}
      path={"localhost"}
      description={`${posiData.summary}`}
    >
      <AboutContent />
    </ImpactPage>
  );
};

export default About;
