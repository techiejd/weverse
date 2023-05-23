import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Stack,
  Avatar,
  LinearProgress,
} from "@mui/material";
import { PosiFormData } from "../../../functions/shared/src";
import RatingsStack from "../../../common/components/ratings";
import Media from "../media";
import { AppState, useAppState } from "../../../common/context/appState";
import { useMaker } from "../../../common/context/weverseUtils";
import { FmdGood } from "@mui/icons-material";

const OverlayInfo = ({ action }: { action: PosiFormData }) => {
  const appState = useAppState();
  const MakerTitle = ({ appState }: { appState: AppState }) => {
    const [maker, makerLoading, makerError] = useMaker(
      appState,
      action.makerId
    );
    const makerInfo = maker
      ? [
          <Typography key="makerTitleOnActionCard" color={"white"}>
            {maker.name}
          </Typography>,
          <Typography
            key="makerTypeOnActionCard"
            sx={{
              backgroundColor: "#d6ffcc",
              borderRadius: 5,
              height: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1,
            }}
          >
            {maker.type == "organization" ? maker.organizationType : maker.type}
          </Typography>,
        ]
      : [<LinearProgress key="makerLinearProgressOnActionCard" />];
    return (
      <>
        <Avatar
          key="makerAvatorOnActionCard"
          src={maker?.pic}
          sx={{ width: 25, height: 25, mr: 1 }}
        />
        {...makerInfo}
      </>
    );
  };
  return (
    <Stack
      sx={{
        backgroundColor: "transparent",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        justifyContent: "space-between",
        pt: 3,
        pl: 1,
        pr: 1,
        pb: 2,
      }}
    >
      <Stack
        sx={{
          width: "100%",
          minHeight: "33px",
          backgroundColor: "rgba(2, 13, 14,0.3)",
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "space-between",
          pl: 1,
          pr: 1,
        }}
        direction={"row"}
      >
        {appState ? (
          <MakerTitle appState={appState} />
        ) : (
          <LinearProgress sx={{ width: "100%" }} />
        )}
      </Stack>
      {action.location && (
        <Typography
          sx={{
            backgroundColor: "white",
            borderRadius: 5,
            minHeight: 23,
            width: "fit-content",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 1,
          }}
        >
          <FmdGood />
          {action.location.structuredFormatting.mainText}
        </Typography>
      )}
    </Stack>
  );
};

const ImpactCard = ({ posiData }: { posiData: PosiFormData }) => {
  const media =
    posiData.media.type == "video"
      ? {
          video: {
            threshold: 0.9,
            muted: true,
            disablePictureInPicture: true,
            src: posiData.media.url,
            controls: false,
            objectFit: "cover" as "cover",
          },
        }
      : { image: { src: posiData.media.url } };
  return (
    <Card
      sx={{
        width: "100%",
        p: 1,
        borderRadius: 2,
      }}
      elevation={5}
    >
      <CardActionArea href={`/posi/${posiData.id}`}>
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
            <Media {...media} />
          </Box>
          <OverlayInfo action={posiData} />
        </Box>
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            sx={{
              textAlign: "justify",
              textJustify: "inter-word",
              fontSize: 18,
            }}
          >
            {posiData.summary}
          </Typography>
          <RatingsStack ratings={posiData.ratings} />
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ImpactCard;
