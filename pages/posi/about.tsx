import {
  Box,
  List,
  ListItem,
  Typography,
  Stack,
  Card,
  SpeedDial,
  SpeedDialAction,
} from "@mui/material";
import ImpactPage, { PageTypes } from "../../modules/posi/impactPage";
import CandidateMedia from "../../modules/vote/votingExperience/candidate/candidateMedia";
import { posiFormData } from "../../modules/posi/input/context";
import {
  CardGiftcard,
  ConnectWithoutContact,
  Handshake,
  Share,
} from "@mui/icons-material";
import { useRef } from "react";
import { useWebSharePortal } from "../../modules/posi/impactPage/WebSharePortal";
import {
  ImpactPageContext,
  useImpactPageContext,
} from "../../modules/posi/impactPage/context";

const Tags = () => {
  return (
    <List>
      <ListItem>
        <Typography>Gender Equality</Typography>
      </ListItem>
    </List>
  );
};

const Maker = () => {
  return (
    <Box>
      <Typography> Mi Barrio Mi Sueño</Typography>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          height: 88,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box flexGrow={1}>
          <Box
            sx={{
              height: "72px",
              width: "100px",
            }}
          >
            <CandidateMedia video={{ threshold: 0.2, src: "/ana14s.mp4" }} />
          </Box>
        </Box>
        <Stack
          sx={{
            alignItems: "center",
            textOverflow: "ellipsis",
            overflow: "hidden",
            minWidth: "0px",
            width: "100%",
          }}
          flexGrow={2}
        >
          <Typography>Medellin, Colombia</Typography>
          <Typography>Foundation</Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

const posiData = posiFormData.parse({
  summary: "We taught about AI to and inspired with AI 150 kids.",
  impactedPeople: { amount: 329, level: 2, howToIdentify: "asdfasdf" },
  tags: ["ambiente"],
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
  howToSupport: "adsfadf",
});

const AboutContent = () => {
  const impactPageContext = useImpactPageContext();
  const actions = [
    // It renders in backwards order lmao.
    { icon: <CardGiftcard />, name: "Financiar" },
    {
      icon: <ConnectWithoutContact />,
      name: "Conectar",
    },
    {
      icon: <Share />,
      name: "Compartir",
      onClick: () => {
        impactPageContext?.launchShare();
      },
    },
  ];
  return (
    <Box>
      <Typography color={"black"}></Typography>
      <Stack>
        <Typography variant="h1">{posiData.summary}</Typography>
        <Card
          sx={{
            borderRadius: 4,
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
        </Card>
      </Stack>
      <SpeedDial
        ariaLabel="Support"
        sx={{
          position: "fixed",
          bottom: 64,
          right: 16,
        }}
        icon={
          <div>
            <Handshake />
            <Typography fontSize={8} mt={-1}>
              Soportar
            </Typography>
          </div>
        }
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

const About = () => {
  return (
    <ImpactPage
      type={PageTypes.about}
      path={"localhost"}
      description={`Aprenda sobre este impacto: ${posiData.summary}`}
    >
      <AboutContent />
    </ImpactPage>
  );
};

export default About;
