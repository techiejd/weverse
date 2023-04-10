import {
  PlayCircle,
  Info,
  SentimentVerySatisfied,
  Summarize,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Stack,
  Divider,
  Card,
  CardHeader,
  Icon,
  CardContent,
  Avatar,
  CircularProgress,
} from "@mui/material";
import moment from "moment";
import { PillBoxMessage } from "../../../../common/components/pillBoxMessage";
import CandidateMedia from "../../../vote/votingExperience/candidate/candidateMedia";
import { getShareProps, posiFormData } from "../../input/context";
import QuickStats from "../QuickStats";
import Support from "./Support";
import { z } from "zod";
import { AppState, useAppState } from "../../../../common/context/appState";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { maker } from "../../../../common/context/weverse";
import { useEffect } from "react";
import { doc } from "firebase/firestore";

const aboutContentProps = posiFormData.extend({
  support: z
    .object({
      shareId: z.string(),
    })
    .optional(),
});
export type AboutContentProps = z.infer<typeof aboutContentProps>;

const MakerCard = ({ makerId }: { makerId: string }) => {
  const appState = useAppState();
  const MakerCardContent = ({ appState }: { appState: AppState }) => {
    const makerDocRef = doc(appState.firestore, "makers", makerId);
    const [value, loading, error, reload] = useDocumentDataOnce(makerDocRef);

    return loading || value == undefined ? (
      <CircularProgress />
    ) : (
      <Stack direction={"row"} alignItems={"center"} spacing={2}>
        <Avatar src={maker.parse(value).pic} />
        <Typography>{maker.parse(value).name}</Typography>
      </Stack>
    );
  };

  return (
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
        {appState == undefined ? (
          <CircularProgress />
        ) : (
          <MakerCardContent appState={appState} />
        )}
      </CardContent>
    </Card>
  );
};

const AboutContent = ({
  summary,
  video,
  location,
  dates,
  impactedPeople,
  investedTimeLevel,
  tags,
  makerId,
  about,
  howToSupport,
  support,
}: AboutContentProps) => {
  const dateFormat = "DD/MM/YY";
  return (
    <Box>
      <Box sx={{ boxShadow: 1 }} padding={1}>
        <Typography
          variant="h1"
          fontSize={35}
          sx={{ textAlign: "justify", textJustify: "inter-word" }}
        >
          {summary}
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
                src: video,
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
                    {location.structuredFormatting.mainText}
                  </Typography>
                  <Typography fontSize={10}>
                    {location.structuredFormatting.secondaryText}
                  </Typography>
                </Stack>
                <Typography variant="h3">
                  {moment(dates.start).format(dateFormat)} -{" "}
                  {moment(dates.end).format(dateFormat)}
                </Typography>
              </Stack>
              <QuickStats
                impactedPeopleAmount={impactedPeople.amount}
                investedTimeLevel={investedTimeLevel}
              />
              <Box alignItems={"normal"} width={"100%"} display={"flex"}>
                {tags.map((tag) => (
                  <PillBoxMessage key={tag} sx={{ m: 1 }}>
                    #{tag}
                  </PillBoxMessage>
                ))}
              </Box>
            </Stack>
          </CardContent>
        </Card>
        <MakerCard makerId={makerId} />
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
            <Typography>{about}</Typography>
          </CardContent>
        </Card>
      </Stack>
      {support && (
        <Support
          howToSupport={howToSupport}
          shareProps={getShareProps({ summary }, support.shareId)}
        />
      )}
    </Box>
  );
};

export default AboutContent;
