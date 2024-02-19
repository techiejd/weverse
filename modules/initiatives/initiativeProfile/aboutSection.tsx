import { Typography, Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { Fragment } from "react";
import { useLocalizedPresentationInfo } from "../../../common/utils/translations";
import { Initiative } from "../../../functions/shared/src";
import Media from "../../posi/media";

const AboutSection = ({ initiative }: { initiative?: Initiative }) => {
  const aboutTranslations = useTranslations("initiatives.about");
  const presentationInfo = useLocalizedPresentationInfo(initiative);
  const noAboutInfo =
    !presentationInfo?.presentationVideo && !presentationInfo?.about;
  return (
    <Fragment>
      <Typography variant="h2">{aboutTranslations("title")}</Typography>
      {presentationInfo?.presentationVideo && (
        <Box
          sx={{
            height: "50vh",
            width: "100%",
          }}
        >
          <Media
            video={{
              threshold: 0.9,
              muted: false,
              controls: true,
              controlsList:
                "play volume fullscreen nodownload noplaybackrate notimeline",
              disablePictureInPicture: true,
              src: presentationInfo.presentationVideo,
            }}
          />
        </Box>
      )}
      <Typography>
        {noAboutInfo ? aboutTranslations("none") : presentationInfo.about}
      </Typography>
    </Fragment>
  );
};

export default AboutSection;
