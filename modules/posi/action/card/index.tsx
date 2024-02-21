import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Dialog,
} from "@mui/material";
import { PosiFormData } from "../../../../functions/shared/src";
import Media from "../../media";
import OverlayInfo from "./overlayInfo";
import RatingsStack from "../../../../common/components/ratings";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import LogInPrompt from "../../../../common/components/logInPrompt";
import { useMyMember } from "../../../../common/context/weverseUtils";
import ValidationInfo from "./validationInfo";
import { useLocalizedPresentationInfo } from "../../../../common/utils/translations";
import { useTranslations } from "next-intl";

const LogInPromptDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  //TODO(techiejd): Figure out the log in stuff. bring to top of app.
  const actionCardTranslations = useTranslations("actions.card");
  return (
    <Dialog open={open}>
      <LogInPrompt
        title={actionCardTranslations("logInToLike")}
        exitButtonBehavior={{ onClick: () => setOpen(false) }}
      />
    </Dialog>
  );
};

const MemberLogInTrigger = ({
  setLogInPromptDialogOpen,
}: {
  setLogInPromptDialogOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [myMember] = useMyMember();
  useEffect(() => {
    if (myMember) setLogInPromptDialogOpen(false);
  }, [myMember, setLogInPromptDialogOpen]);
  return <Box />;
};

const ImpactCard = ({ posiData }: { posiData: PosiFormData }) => {
  const presentationInfo = useLocalizedPresentationInfo(posiData);
  const media = !presentationInfo
    ? undefined
    : presentationInfo.media.type == "video"
    ? {
        video: {
          threshold: 0.9,
          muted: true,
          disablePictureInPicture: true,
          src: presentationInfo.media.url,
          controls: false,
          objectFit: "cover" as "cover",
        },
      }
    : { image: { src: presentationInfo.media.url } };
  const [logInPromptDialogOpen, setLogInPromptDialogOpen] = useState(false);
  return (
    <Card
      sx={{
        width: "100%",
        p: 1,
        borderRadius: 2,
      }}
      elevation={5}
    >
      <LogInPromptDialog
        open={logInPromptDialogOpen}
        setOpen={setLogInPromptDialogOpen}
      />
      <MemberLogInTrigger setLogInPromptDialogOpen={setLogInPromptDialogOpen} />
      <CardActionArea href={`/${posiData.path}`}>
        <Box
          sx={{
            width: "100%",
            height: "50vh",
            borderRadius: 3,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            {media && <Media {...media} />}
          </Box>
          <OverlayInfo
            action={posiData}
            setLogInPromptOpen={setLogInPromptDialogOpen}
          />
        </Box>
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            sx={{
              fontSize: 18,
            }}
          >
            {presentationInfo?.summary}
          </Typography>
          <RatingsStack ratings={posiData.ratings} />
          {posiData.validation && <ValidationInfo {...posiData.validation} />}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ImpactCard;
