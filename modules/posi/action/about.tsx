import Place from "@mui/icons-material/Place";

import {
  Box,
  Typography,
  Stack,
  Divider,
  CardHeader,
  Icon,
  CardContent,
  CircularProgress,
} from "@mui/material";
import Media from "./../media";
import InitiativeCard from "../../initiatives/InitiativeCard";
import { PosiFormData } from "../../../functions/shared/src";
import RatingsStack from "../../../common/components/ratings";
import ValidationInfo from "./card/validationInfo";
import { useTranslations } from "next-intl";
import { useLocalizedPresentationInfo } from "../../../common/utils/translations";

const AboutContent = ({
  location,
  makerId,
  ratings,
  validation,
  ...locale2PresentationInfo
}: PosiFormData) => {
  const t = useTranslations("actions.about");
  const presentationInfo = useLocalizedPresentationInfo(
    locale2PresentationInfo
  );
  return (
    (presentationInfo && (
      <Box>
        <Box sx={{ boxShadow: 1 }} padding={2}>
          <Typography>{t("explanation")}</Typography>
          <Typography variant="h1" fontSize={35}>
            {presentationInfo.summary}
          </Typography>
          {validation && <ValidationInfo {...validation} />}
          <RatingsStack ratings={ratings} />
        </Box>
        <Stack divider={<Divider flexItem />} spacing={1} m={1.5}>
          <Box>
            <Box
              sx={{
                height: "50vh",
                width: "100%",
              }}
            >
              {presentationInfo.media.type == "video" ? (
                <Media
                  video={{
                    threshold: 0.9,
                    muted: false,
                    controls: true,
                    controlsList:
                      "play volume fullscreen nodownload noplaybackrate notimeline",
                    disablePictureInPicture: true,
                    src: presentationInfo.media.url!,
                  }}
                />
              ) : (
                <Media image={{ src: presentationInfo.media.url! }} />
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
                title={t("location")}
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
          <InitiativeCard makerId={makerId} />
        </Stack>
      </Box>
    )) || <CircularProgress />
  );
};

export default AboutContent;
