import { PlayCircle, Info } from "@mui/icons-material";
import {
  Box,
  Typography,
  Stack,
  Divider,
  CardHeader,
  Icon,
  CardContent,
} from "@mui/material";
import MakerCard from "../../../makers/MakerCard";
import PosiMedia from "./posiMedia";
import { PosiFormData } from "../../input/context";

const AboutContent = ({
  summary,
  video,
  location,
  howToIdentifyImpactedPeople,
  makerId,
  id,
}: PosiFormData) => {
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
            <PosiMedia
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
        {(location || howToIdentifyImpactedPeople) && (
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
                {location && (
                  <Stack>
                    <Typography variant="h3">
                      {location.structuredFormatting.mainText}
                    </Typography>
                    <Typography fontSize={10}>
                      {location.structuredFormatting.secondaryText}
                    </Typography>
                  </Stack>
                )}
                {howToIdentifyImpactedPeople && (
                  <Typography>{howToIdentifyImpactedPeople}</Typography>
                )}
              </Stack>
            </CardContent>
          </Box>
        )}
        <MakerCard makerId={makerId} />
      </Stack>
    </Box>
  );
};

export default AboutContent;
