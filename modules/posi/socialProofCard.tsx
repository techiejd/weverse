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
import { SocialProof } from "../../functions/shared/src";
import {
  useAction,
  useInitiative,
  useMember,
} from "../../common/context/weverseUtils";
import Media from "./media";
import { useTranslations } from "next-intl";
import { useLocalizedPresentationInfo } from "../../common/utils/translations";

const SocialProofCard = ({
  socialProof,
  showInitiative = true,
  showAction = true,
  href,
}: {
  socialProof: SocialProof;
  showInitiative?: boolean;
  showAction?: boolean;
  href?: string;
}) => {
  const SocialProofCardHeader = () => {
    const [byMember] = useMember(socialProof.byMember);
    return (
      <CardActionArea href={href ? href : `/${socialProof.byMember}`}>
        <CardHeader
          title={
            <Stack
              direction={"row"}
              sx={{ justifyContent: "center", alignItems: "center" }}
            >
              <Box pr={2}>
                {byMember ? `${byMember.name}: ` : <CircularProgress />}
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
    const [forInitiative] = useInitiative(
      showInitiative ? socialProof.forInitiative : undefined
    );
    const presentationInfo = useLocalizedPresentationInfo(action);
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
        {forInitiative && (
          <Typography>
            {cardTranslations("forInitiative", {
              initiative: forInitiative.name,
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
              muted: true,
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
