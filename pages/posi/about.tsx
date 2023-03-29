import {
  Box,
  Typography,
  Stack,
  Card,
  SpeedDial,
  SpeedDialAction,
  Divider,
  CardHeader,
  CardContent,
  Paper,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Button,
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
import { useImpactPageContext } from "../../modules/posi/impactPage/context";
import { PillBoxMessage } from "../../common/components/pillBoxMessage";
import moment from "moment";
import { Dispatch, SetStateAction, useState } from "react";
import Linkify from "react-linkify";

const posiData = posiFormData.parse({
  summary: "We taught about AI to and inspired with AI 150 kids.",
  impactedPeople: { amount: 329, level: 2, howToIdentify: "asdfasdf" },
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
    contact: "Instagram - whatsgoodjd@",
    finance: "https://paypal.me/jdavid10001",
  },
});

const SupportDialog = ({
  open,
  setOpen,
  title,
  text,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  text: string;
}) => {
  const handleClose = () => setOpen(false);
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Linkify>{text}</Linkify>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Support = () => {
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [financeDialogOpen, setFinanceDialogOpen] = useState(false);
  const impactPageContext = useImpactPageContext();
  const actions = (() => {
    const actions = [
      {
        icon: <Share />,
        name: "Compartir",
        onClick: () => {
          impactPageContext?.launchShare();
        },
      },
    ];
    // It renders in backwards order lmao.
    if (posiData.howToSupport?.contact) {
      actions.unshift({
        icon: <ConnectWithoutContact />,
        name: "Conectar",
        onClick: () => setConnectDialogOpen(true),
      });
    }
    if (posiData.howToSupport?.finance) {
      actions.unshift({
        icon: <CardGiftcard />,
        name: "Financiar",
        onClick: () => setFinanceDialogOpen(true),
      });
    }
    return actions;
  })();

  return (
    <div>
      {posiData.howToSupport?.finance && (
        <SupportDialog
          open={financeDialogOpen}
          setOpen={setFinanceDialogOpen}
          title="El o la Maker dice que puede financiarlos de las siguientes maneras:"
          text={posiData.howToSupport!.finance}
        />
      )}
      {posiData.howToSupport?.contact && (
        <SupportDialog
          open={connectDialogOpen}
          setOpen={setConnectDialogOpen}
          title="El o la Maker dice que puede financiarlos de las siguientes maneras:"
          text={posiData.howToSupport!.contact}
        />
      )}
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
    </div>
  );
};

const AboutContent = () => {
  const dateFormat = "DD/MM/YY";
  return (
    <Box>
      <Box sx={{ boxShadow: 1 }} padding={1}>
        <Typography variant="h1" fontSize={35}>
          {posiData.summary}
        </Typography>{" "}
      </Box>
      <Stack divider={<Divider flexItem />} spacing={1} m={1.5}>
        <Paper>
          <Box alignItems={"normal"} width={"100%"} display={"flex"}>
            {posiData.tags.map((tag) => (
              <PillBoxMessage key={tag} sx={{ m: 1 }}>
                {tag}
              </PillBoxMessage>
            ))}
          </Box>
        </Paper>
        <Card>
          <CardHeader
            title={`${posiData.location.structuredFormatting.mainText}`}
            subheader={`${moment(posiData.dates.start).format(dateFormat)} - 
            ${moment(posiData.dates.end).format(dateFormat)}`}
          ></CardHeader>
        </Card>
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
        <Card>
          <CardContent>
            <Stack direction={"row"} alignItems={"center"}>
              <Avatar src={posiData.maker.pic} />
              <Typography>{posiData.maker.name}</Typography>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography>{posiData.about}</Typography>
          </CardContent>
        </Card>
      </Stack>
      <Support />
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
