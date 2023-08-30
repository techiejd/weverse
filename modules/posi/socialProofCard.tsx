import {
  CardHeader,
  Stack,
  Box,
  CircularProgress,
  Rating,
  Card,
  CardContent,
  CardActionArea,
  Typography,
} from "@mui/material";
import { Locale, SocialProof } from "../../functions/shared/src";
import { useAction, useMaker } from "../../common/context/weverseUtils";
import Media from "./media";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

const SocialProofCard = ({
  socialProof,
  showMaker = true,
  showAction = true,
}: {
  socialProof: SocialProof;
  showMaker?: boolean;
  showAction?: boolean;
}) => {
  const SocialProofCardHeader = () => {
    const [byMaker] = useMaker(socialProof.byMaker);
    return (
      <CardActionArea href={`/makers/${socialProof.byMaker}`}>
        <CardHeader
          title={
            <Stack
              direction={"row"}
              sx={{ justifyContent: "center", alignItems: "center" }}
            >
              <Box pr={2}>
                {byMaker ? `${byMaker.name}: ` : <CircularProgress />}
              </Box>
              <Rating value={socialProof.rating} />
            </Stack>
          }
        />
      </CardActionArea>
    );
  };
  const SocialProofCardContent = () => {
    const [action] = useAction(showAction ? socialProof.forAction : undefined);
    const [forMaker] = useMaker(showMaker ? socialProof.forMaker : undefined);
    const { locale: userLocale } = useRouter();
    const presentationInfo =
      (action &&
        ((userLocale && action[userLocale as Locale]) ||
          action[action?.locale!]!)) ||
      undefined;
    const cardTranslations = useTranslations("testimonials.card");
    return (
      <CardContent>
        {socialProof.text && <Typography>{socialProof.text}</Typography>}
        {action && (
          <Typography>
            {cardTranslations("forAction", {
              action: presentationInfo?.summary,
            })}
          </Typography>
        )}
        {forMaker && (
          <Typography>
            {cardTranslations("forMaker", {
              maker: forMaker.name,
            })}
          </Typography>
        )}
      </CardContent>
    );
  };
  return (
    <Card sx={{ width: "100%" }}>
      <SocialProofCardHeader />
      {socialProof.videoUrl && (
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
              src: socialProof.videoUrl,
            }}
          />
        </Box>
      )}
      <SocialProofCardContent />
    </Card>
  );
};

export default SocialProofCard;
