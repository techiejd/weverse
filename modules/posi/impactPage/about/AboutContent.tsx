import { PlayCircle, Info, Summarize } from "@mui/icons-material";
import {
  Box,
  Typography,
  Stack,
  Divider,
  CardHeader,
  Icon,
  CardContent,
} from "@mui/material";
import moment from "moment";
import { PillBoxMessage } from "../../../../common/components/pillBoxMessage";
import CandidateMedia from "../../../vote/votingExperience/candidate/candidateMedia";
import { getShareProps, posiFormData } from "../../input/context";
import QuickStats from "../QuickStats";
import Support from "./Support";
import { z } from "zod";
import MakerCard from "../../../makers/MakerCard";

const aboutContentProps = posiFormData.extend({
  support: z.boolean().optional(),
});
export type AboutContentProps = z.infer<typeof aboutContentProps>;

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
  id,
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
        <Box>
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
        </Box>
        <Box>
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
        </Box>
        <MakerCard makerId={makerId} />
        <Box>
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
        </Box>
      </Stack>
      {support && (
        <Support
          howToSupport={howToSupport}
          shareProps={getShareProps({ summary, id })}
        />
      )}
    </Box>
  );
};

export default AboutContent;
