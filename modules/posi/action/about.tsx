import { PlayCircle, Image as ImageIcon, Place } from "@mui/icons-material";
import {
  Box,
  Typography,
  Stack,
  Divider,
  CardHeader,
  Icon,
  CardContent,
  CardActionArea,
} from "@mui/material";
import Media from "./../media";
import MakerCard from "../../makers/MakerCard";
import { PosiFormData } from "../../../functions/shared/src";
import RatingsStack from "../../../common/components/ratings";
import ValidationInfo from "./card/validationInfo";

const AboutContent = ({
  summary,
  media,
  location,
  howToIdentifyImpactedPeople,
  makerId,
  ratings,
  validation,
}: PosiFormData) => {
  // TODO(techiejd): Look into why it's happening.
  return summary && makerId && media ? (
    <Box>
      <Box sx={{ boxShadow: 1 }} padding={2}>
        <Typography variant="h1" fontSize={35}>
          {summary}
        </Typography>
        {validation && <ValidationInfo {...validation} />}
        <RatingsStack ratings={ratings} />
      </Box>
      <Stack divider={<Divider flexItem />} spacing={1} m={1.5}>
        <Box>
          {media.type == "video" ? (
            <CardHeader
              avatar={
                <Icon>
                  <PlayCircle />
                </Icon>
              }
              title={"Video de Portada"}
            />
          ) : (
            <CardHeader
              avatar={
                <Icon>
                  <ImageIcon />
                </Icon>
              }
              title={"Imagen de Portada"}
            />
          )}
          <Box
            sx={{
              height: "50vh",
              width: "100%",
            }}
          >
            {media.type == "video" ? (
              <Media
                video={{
                  threshold: 0.9,
                  muted: false,
                  controls: true,
                  controlsList:
                    "play volume fullscreen nodownload noplaybackrate notimeline",
                  disablePictureInPicture: true,
                  src: media.url!,
                }}
              />
            ) : (
              <Media image={{ src: media.url! }} />
            )}
          </Box>
        </Box>
        {location && (
          <Box>
            <CardHeader
              avatar={
                <Icon>
                  <Place />
                </Icon>
              }
              title={"Ubicación"}
            />

            <CardContent>
              <Stack>
                <Typography variant="h3">
                  {location.structuredFormatting!.mainText}
                </Typography>
                <Typography fontSize={10}>
                  {location.structuredFormatting!.secondaryText}
                </Typography>
              </Stack>
            </CardContent>
          </Box>
        )}
        {howToIdentifyImpactedPeople && (
          <Box>
            <CardHeader
              avatar={
                <Icon>
                  <Place />
                </Icon>
              }
              title={"¿A quiénes ayudó?"}
            />
            <CardContent>
              <Typography>{howToIdentifyImpactedPeople}</Typography>
            </CardContent>
          </Box>
        )}
        <MakerCard makerId={makerId} />
      </Stack>
    </Box>
  ) : (
    <></>
  );
};

export default AboutContent;
